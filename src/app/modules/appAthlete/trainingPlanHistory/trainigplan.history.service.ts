import { ITrainingPushDayHistory } from './trainigplan.history.interface';
import { TrainingPushDayHistoryModel } from './trainingplan.history.model';

function calculateOneRM(weight: number, reps: number): number {
  return Math.round(weight * (1 + reps / 30));
}

function calculateTotalVolume(
  pushData: { weight: number; reps: number }[]
): number {
  return pushData.reduce((total, set) => total + set.weight * set.reps, 0);
}
function calculateVolumePR(previousHistories: any[], currentVolume: number) {
  const previousVolumes = previousHistories.map(h =>
    calculateTotalVolume(h.pushData)
  );

  const maxPreviousVolume = Math.max(...previousVolumes, 0);

  return currentVolume > maxPreviousVolume;
}
// 1RM = Weight × (1 + Reps / 30)

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

    const histories = await TrainingPushDayHistoryModel.find(query)
      .sort({ createdAt: 1 })
      .lean();

    if (!histories.length) {
      return {
        histories: [],
        pr: {
          volumePR: false,
        },
      };
    }

    const enrichedHistories = histories.map(history => {
      const totalWeight = calculateTotalVolume(history.pushData);

      return {
        ...history,
        totalWeight,
        pushData: history.pushData.map(set => ({
          ...set,
          oneRM: calculateOneRM(set.weight, set.reps),
        })),
      };
    });

    // 🟢 PR CHECK (only last workout)
    const currentHistory = enrichedHistories[enrichedHistories.length - 1];
    const previousHistories = enrichedHistories.slice(0, -1);

    const volumePR = calculateVolumePR(
      previousHistories,
      currentHistory.totalWeight
    );

    return {
      histories: enrichedHistories,
      pr: {
        volumePR,
      },
    };
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
