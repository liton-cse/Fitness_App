import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { AthleteModel } from '../athlete/athleteModel';
import { CoachModel } from '../coach/coachModel';
import { DailyTrackingModel } from '../../appAthlete/dailyTracking/daily.tracking.model';
import CheckInModel from '../../appAthlete/checkIn/checkin.model';

export class DashboardService {
  async getDashboardInfo() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const [
      athleteStats,
      totalCoach,
      totalDailyTrackingToday,
      totalCheckInThisWeek,
    ] = await Promise.all([
      // ✅ ONE query for all athlete statss
      AthleteModel.aggregate([
        {
          $facet: {
            totalAthlete: [{ $count: 'count' }],
            enhanced: [{ $match: { status: 'Enhanced' } }, { $count: 'count' }],
            natural: [{ $match: { status: 'Natural' } }, { $count: 'count' }],
            active: [{ $match: { isActive: 'Active' } }, { $count: 'count' }],
            inactive: [
              { $match: { isActive: 'In-Active' } },
              { $count: 'count' },
            ],
          },
        },
      ]),

      // Coaches
      CoachModel.estimatedDocumentCount(),

      // Daily tracking today
      DailyTrackingModel.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),

      // Check-ins this week
      CheckInModel.countDocuments({
        createdAt: { $gte: weekStart, $lte: weekEnd },
      }),
    ]);

    const stats = athleteStats[0];

    return {
      totalAthlete: stats.totalAthlete[0]?.count || 0,
      totalEnhancedAthlete: stats.enhanced[0]?.count || 0,
      totalNaturalAthlete: stats.natural[0]?.count || 0,
      totalActiveUser: stats.active[0]?.count || 0,
      totalInactiveUser: stats.inactive[0]?.count || 0,
      totalCoach,
      totalDailyTrackingToday,
      totalCheckInThisWeek,
    };
  }

  async getDashboardAlert() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* ---------------- Total Athletes ---------------- */
    const totalAthlete = await AthleteModel.countDocuments();

    /* -------- Athletes with Elevated Blood Pressure --------
     Systolic: 120–129
     Diastolic: < 80
  */
    const elevatedBpAthlete = await DailyTrackingModel.countDocuments({
      $expr: {
        $and: [
          { $gte: [{ $toInt: '$bloodPressure.systolic' }, 120] },
          { $lte: [{ $toInt: '$bloodPressure.systolic' }, 129] },
          { $lt: [{ $toInt: '$bloodPressure.diastolic' }, 80] },
        ],
      },
    });

    /* -------- Total Submitted Daily Tracking (Today) -------- */
    const totalSubmittedDailyTracking = await DailyTrackingModel.countDocuments(
      {
        createdAt: { $gte: today },
      }
    );

    /* -------- Missed Daily Tracking -------- */
    const totalMissedDailyTracking = totalAthlete - totalSubmittedDailyTracking;

    return {
      elevatedBpAthlete,
      totalMissedDailyTracking,
    };
  }
}
