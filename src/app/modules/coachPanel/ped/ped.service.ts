import { ICategory } from './ped.interface';
import { PEDDatabaseModel } from './ped.model';

/* ---------- Utils ---------- */

const generateId = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, '-');

const isSundayEvening = () => {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 18; // Sunday after 6 PM
};

const getCurrentWeekLabel = async (coachId: string) => {
  const count = await PEDDatabaseModel.countDocuments({ coachId });
  return `week_${count || 1}`;
};

const getNextWeekLabel = (week: string) => {
  const num = Number(week.split(' ')[1]);
  return `Week ${num + 1}`;
};

/* ---------- Service ---------- */

export class PEDDatabaseService {
  async createWeeklyPEDDatabase(payload: {
    coachId: string;
    category: string;
    subCategory: { name: string }[];
  }) {
    const { coachId, category, subCategory } = payload;

    let week = await getCurrentWeekLabel(coachId);

    // ✅ Sunday evening → create next week automatically
    if (isSundayEvening()) {
      const nextWeek = getNextWeekLabel(week);

      const exists = await PEDDatabaseModel.findOne({
        coachId,
        week: nextWeek,
      });

      if (!exists) {
        const prevWeekDoc = await PEDDatabaseModel.findOne({
          coachId,
          week,
        });

        if (prevWeekDoc) {
          await PEDDatabaseModel.create({
            coachId,
            week: nextWeek,
            categories: JSON.parse(JSON.stringify(prevWeekDoc.categories)),
          });
        }
      }

      week = nextWeek;
    }

    // ✅ Get or create current week document
    let weekDoc = await PEDDatabaseModel.findOne({ coachId, week });

    if (!weekDoc) {
      weekDoc = await PEDDatabaseModel.create({
        coachId,
        week,
        categories: [],
      });
    }

    // ✅ Prepare subCategories
    const formattedSubCategories = subCategory.map(sub => ({
      id: generateId(sub.name),
      name: sub.name,
      dosage: '',
      frequency: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: '',
      sun: '',
    }));

    // ✅ Category check
    const existingCategory = weekDoc.categories.find(
      (cat: ICategory) => cat.name === category
    );

    if (existingCategory) {
      existingCategory.subCategory.push(...formattedSubCategories);
    } else {
      weekDoc.categories.push({
        name: category,
        subCategory: formattedSubCategories,
      });
    }

    await weekDoc.save();
    return weekDoc;
  }

  async getPEDByWeek(coachId: string, week: string) {
    return PEDDatabaseModel.findOne({ coachId, week }).lean();
  }

  async getAllPED(coachId: string) {
    return PEDDatabaseModel.find({ coachId }).sort({ createdAt: 1 }).lean();
  }
}
