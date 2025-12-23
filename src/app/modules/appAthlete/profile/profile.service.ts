import { AthleteModel } from '../../adminPanel/athlete/athleteModel';
import { CoachModel } from '../../adminPanel/coach/coachModel';
import { ShowManagementModel } from '../../coachPanel/showManagement/management.model';
import { TimelineHistoryModel } from '../../coachPanel/timeLine/timeline.model';
import { User } from '../../user/user.model';

export class ProfileService {
  static async getAthleteDetails(athleteId: string) {
    // 1️⃣ Fetch athlete (all fields)
    const athlete = await AthleteModel.findById(athleteId).lean();
    console.log('Athlete:', athlete);

    if (!athlete) throw new Error('Athlete not found');

    // 2️⃣ Get coach name
    let coachName = '';
    if (athlete.coachId) {
      const coach = await CoachModel.findById({ _id: athlete.coachId })
        .select('name')
        .lean();
      coachName = coach?.name || '';
    } else {
      const user = await User.findById({ _id: athleteId })
        .select('name')
        .lean();
      coachName = user?.name || '';
    }

    // 3️⃣ Fetch latest timeline info
    const timeline = await TimelineHistoryModel.findOne()
      .select('nextCheckInDate')
      .lean();
    console.log('Timeline:', timeline);

    // 4️⃣ Fetch show management data
    const shows = await ShowManagementModel.findOne()
      .sort({ createdAt: -1 })
      .lean();
    const countDown = calculateCountdown(shows?.date!);
    console.log('Shows:', shows);

    // 5️⃣ Combine response
    return {
      athlete,
      coachName,
      timeline,
      shows,
      countDown,
    };
  }
}

// Calculate countdown in days
const calculateCountdown = (dateStr: string) => {
  const showDate = new Date(dateStr);
  const now = new Date();
  const diffMs = showDate.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
