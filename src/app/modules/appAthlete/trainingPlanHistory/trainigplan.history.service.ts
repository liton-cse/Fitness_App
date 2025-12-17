import { calculateOneRM, calculatePR } from '../../../../util/calculate.pr';
import { ITrainingPushDayHistory } from './trainigplan.history.interface';
import { TrainingPushDayHistoryModel } from './trainingplan.history.model';

export class TrainingPushDayHistoryService {
  /**
   * Create a new Training Push Day History record
   */
  async createTrainingPushDayHistory(payload: ITrainingPushDayHistory) {
    const result = await TrainingPushDayHistoryModel.create(payload);
    return result;
  }

  /**
   * Get all Training Push Day History for a user
   * Optionally filter by trainingName
   */
  async getTrainingPushDayHistory(userId: string, trainingName?: string) {
    const query: Record<string, any> = { userId };

    if (trainingName) {
      query.trainingName = {
        $regex: trainingName,
        $options: 'i',
      };
    }

    const histories = await TrainingPushDayHistoryModel.find(query).lean();

    if (histories.length < 2) {
      return {
        histories,
        pr: {
          weightPR: false,
          repsPR: false,
          oneRMPR: false,
          totalPR: 0,
        },
      };
    }

    const previous = histories.slice(0, -1).flatMap(h => h.pushData);
    const current = histories[histories.length - 1].pushData;

    const prResult = calculatePR(previous, current);

    const result = histories.map(history => ({
      ...history,
      pushData: history.pushData.map((set: any) => ({
        ...set,
        oneRM: calculateOneRM(set.weight, set.reps),
      })),
      pr: prResult.totalPR,
    }));

    return result;
  }

  /**
   * Update a Training Push Day History record by ID
   */
  async updateTrainingPushDayHistory(
    userId: string,
    id: string,
    payload: Partial<ITrainingPushDayHistory>
  ) {
    const result = await TrainingPushDayHistoryModel.findOneAndUpdate(
      { _id: id, userId },
      payload,
      { new: true, runValidators: true }
    );
    return result;
  }

  /**
   * Delete a Training Push Day History record by ID
   */
  async deleteTrainingPushDayHistory(userId: string, id: string) {
    const result = await TrainingPushDayHistoryModel.findOneAndDelete({
      _id: id,
      userId,
    });
    return result;
  }
}
