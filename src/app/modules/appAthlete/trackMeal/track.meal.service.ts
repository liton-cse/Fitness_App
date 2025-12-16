import mongoose, { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../../errors/ApiError';
import { IFoodItem } from './track.meal.interface';
import { DailyTrackingMealModel } from './track.meal.model';
import { FoodItemModel } from '../../adminPanel/nutrition/Food/food.model';
import {
  calculateFoodMacros,
  calculateNutritionStats,
} from '../../../../util/calculate.total.track.meal';
import { AthleteModel } from '../../adminPanel/athlete/athleteModel';
interface DeleteFoodParams {
  userId: string;
  date: string;
  mealId?: string;
  foodId?: string | undefined;
}
export class DailyTrackingService {
  /**
   * Create or add TrackMeal (max 7 per day)
   */
  async createDailyTracking(payload: {
    userId: string;
    mealNumber: string;
    food: IFoodItem[];
  }) {
    const today = new Date().toISOString().split('T')[0];

    const tracking = await DailyTrackingMealModel.findOne({
      userId: payload.userId,
      date: today,
    });

    const newMeal = {
      mealNumber: payload.mealNumber,
      food: payload.food,
    };

    if (tracking) {
      if (tracking.meals.length >= 7) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Maximum 7 meals allowed per day'
        );
      }

      tracking.meals.push(newMeal);
      await tracking.save();
      return tracking;
    }

    return DailyTrackingMealModel.create({
      userId: payload.userId,
      date: today,
      meals: [newMeal],
    });
  }

  /**
   * Get daily tracking (optional date filter)
   */
  async getDailyTracking(userId: string, date?: string) {
    const filter: any = { userId };
    if (date) filter.date = date;

    const [dailyTracking, athlete] = await Promise.all([
      DailyTrackingMealModel.find(filter).lean().sort({ date: -1 }),
      AthleteModel.findOne({ userId }, { water: 1 }).lean(),
    ]);

    if (!dailyTracking.length) {
      return {
        data: [],
        totals: {
          totalProtein: 0,
          totalFats: 0,
          totalCarbs: 0,
          totalCalories: 0,
        },
        water: athlete?.water || 0,
      };
    }

    // 🔹 Collect food names
    const foodNames = new Set<string>();
    dailyTracking.forEach(tracking =>
      tracking.meals.forEach(meal =>
        meal.food.forEach(food => foodNames.add(food.foodNme))
      )
    );

    // 🔹 Fetch food master data
    const foodDataList = await FoodItemModel.find({
      name: { $in: [...foodNames] },
    }).lean();

    // 🔹 Fast lookup
    const foodMap: Record<string, any> = Object.create(null);
    foodDataList.forEach(food => {
      foodMap[food.name] = food;
    });

    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let totalCalories = 0;

    // 🔹 Calculate macros
    for (const tracking of dailyTracking) {
      for (const meal of tracking.meals) {
        let mealProtein = 0;
        let mealFats = 0;
        let mealCarbs = 0;
        let mealCalories = 0;

        for (const food of meal.food) {
          const foodData = foodMap[food.foodNme];
          if (!foodData) continue;

          const qty = food.quantity ? +food.quantity : 1;
          const { protein, fats, carbs, calories } = calculateFoodMacros(
            foodData,
            qty
          );

          mealProtein += protein;
          mealFats += fats;
          mealCarbs += carbs;
          mealCalories += calories;
        }

        meal.totalProtein = +mealProtein.toFixed(2);
        meal.totalFats = +mealFats.toFixed(2);
        meal.totalCarbs = +mealCarbs.toFixed(2);
        meal.totalCalories = +mealCalories.toFixed(2);

        totalProtein += mealProtein;
        totalFats += mealFats;
        totalCarbs += mealCarbs;
        totalCalories += mealCalories;
      }
    }

    const stats = calculateNutritionStats({
      totalProtein,
      totalFats,
      totalCarbs,
    });

    return {
      data: dailyTracking,
      totals: {
        totalProtein: +totalProtein.toFixed(2),
        totalFats: +totalFats.toFixed(2),
        totalCarbs: +totalCarbs.toFixed(2),
        totalCalories: +totalCalories.toFixed(2),
      },
      water: athlete?.water || 0,
      stats,
    };
  }

  /**
   * Update ONLY foodName & quantity of a TrackMeal
   */
  async updateTrackMeal(
    userId: string,
    date: string,
    mealId: string,
    food: IFoodItem[]
  ) {
    console.log(userId, mealId, food);
    const tracking = await DailyTrackingMealModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      date,
    });

    if (!tracking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tracking not found');
    }

    const meal = tracking.meals.find(m => m._id?.toString() === mealId);

    if (!meal) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');
    }
    meal.food = food;
    await tracking.save();

    return tracking;
  }

  /**
   * Delete a TrackMeal by index
   * If meals array becomes empty → delete DailyTracking
   */

  async deleteTrackMeal({ userId, date, mealId, foodId }: DeleteFoodParams) {
    // Find the tracking document
    const tracking = await DailyTrackingMealModel.findOne({
      userId,
      date,
    });

    if (!tracking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tracking not found');
    }
    if (mealId && foodId) {
      const meal = tracking.meals.find(m => m._id?.toString() === mealId);
      if (!meal) throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');

      const foodIndex = meal.food.findIndex(f => f._id?.toString() === foodId);
      if (foodIndex === -1)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Food item not found');

      meal.food.splice(foodIndex, 1);

      if (meal.food.length === 0) {
        const mealIndex = tracking.meals.findIndex(
          m => m._id?.toString() === mealId
        );
        tracking.meals.splice(mealIndex, 1);
      }

      // If no meals left, delete the entire tracking
      if (tracking.meals.length === 0) {
        await tracking.deleteOne();
        return { message: 'Daily tracking deleted (no meals left)' };
      }

      // Mark nested array as modified
      tracking.markModified('meals');
      await tracking.save();
      return tracking;
    }

    if (mealId) {
      const mealIndex = tracking.meals.findIndex(
        m => m._id?.toString() === mealId
      );
      if (mealIndex === -1)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Meal not found');

      tracking.meals.splice(mealIndex, 1);

      if (tracking.meals.length === 0) {
        await tracking.deleteOne();
        return { message: 'Daily tracking deleted (no meals left)' };
      }

      await tracking.save();
      return tracking;
    }

    await tracking.deleteOne();
    return { message: 'Daily tracking deleted entirely' };
  }
}
