import { AthleteModel } from '../../adminPanel/athlete/athleteModel';
import CheckInModel from '../../appAthlete/checkIn/checkin.model';
import { DailyTrackingModel } from '../../appAthlete/dailyTracking/daily.tracking.model';

export class CoachDashboardService {
  /**
   * get Dashboard data from datavbase..
   */
  async getCoachDashboard(coachId: string) {
    // 📅 Start & End of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 🚀 Run all queries in parallel
    const [
      totalAthletes,
      totalActiveUsers,
      totalCompletedCheckin,
      totalPendingCheckin,
      totalDailyTrackingToday,
    ] = await Promise.all([
      // Total athletes under coach
      AthleteModel.countDocuments({ coachId }),

      // Total active athletes
      AthleteModel.countDocuments({ coachId, isActive: 'Active' }),

      // Completed checkins
      CheckInModel.countDocuments({
        coachId,
        checkinCompleted: 'Completed',
      }),

      // Pending checkins
      CheckInModel.countDocuments({
        coachId,
        checkinCompleted: 'Pending',
      }),

      // Daily tracking submitted today
      DailyTrackingModel.countDocuments({
        coachId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }),
    ]);

    console.log(
      totalAthletes,
      totalActiveUsers,
      totalCompletedCheckin,
      totalPendingCheckin,
      totalDailyTrackingToday,
    );

    return {
      totalAthletes,
      totalActiveUsers,
      checkins: {
        completed: totalCompletedCheckin,
        pending: totalPendingCheckin,
      },
      dailyTracking: {
        submittedToday: totalDailyTrackingToday,
      },
    };
  }
  async getWeeklyCheckins(coachId: string) {
    // 📅 Start & End of week
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);

    // 🚀 Run all queries in parallel
    const [totalCompletedCheckin, totalPendingCheckin] = await Promise.all([
      // Completed checkins
      CheckInModel.countDocuments({
        coachId,
        checkinCompleted: 'Completed',
      }),

      // Pending checkins
      CheckInModel.countDocuments({
        coachId,
        checkinCompleted: 'Pending',
      }),
    ]);

    return {
      weeklyCheckins: {
        completed: totalCompletedCheckin,
        pending: totalPendingCheckin,
      },
    };
  }
}
