import { ICategory } from './ped.interface';
import { PEDDatabaseModel } from './ped.model';

/* ---------- Utils ---------- */

const generateId = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, '-');

const isSundayEvening = () => {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 18; // Sunday after 6 PM
};

const getCurrentWeekLabel = async () => {
  const count = await PEDDatabaseModel.countDocuments();
  return `week_${count || 1}`;
};

const getNextWeekLabel = (week: string) => {
  const num = Number(week.split(' ')[1]);
  return `Week ${num + 1}`;
};

/* ---------- Service ---------- */

export class PEDDatabaseService {
  async createWeeklyPEDDatabase(payload: {
    category: string;
    subCategory: { name: string }[];
  }) {
    const { category, subCategory } = payload;

    let week = await getCurrentWeekLabel();

    // ✅ Sunday evening → create next week automatically
    if (isSundayEvening()) {
      const nextWeek = getNextWeekLabel(week);

      const exists = await PEDDatabaseModel.findOne({ week: nextWeek });

      if (!exists) {
        const prevWeekDoc = await PEDDatabaseModel.findOne({ week });

        if (prevWeekDoc) {
          await PEDDatabaseModel.create({
            week: nextWeek,
            categories: JSON.parse(JSON.stringify(prevWeekDoc.categories)),
          });
        }
      }

      week = nextWeek;
    }

    // ✅ Get or create week document
    let weekDoc = await PEDDatabaseModel.findOne({ week });

    if (!weekDoc) {
      weekDoc = await PEDDatabaseModel.create({
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

    // ✅ Find category in the SAME week
    const existingCategory = weekDoc.categories.find(
      (cat: ICategory) => cat.name === category
    );

    if (existingCategory) {
      // ✅ Add ONLY new subcategories (avoid duplicates)
      const existingNames = new Set(
        existingCategory.subCategory.map(sub => sub.name)
      );

      const newSubCategories = formattedSubCategories.filter(
        sub => !existingNames.has(sub.name)
      );

      existingCategory.subCategory.push(...newSubCategories);
    } else {
      // ✅ New category → just add to the same week
      weekDoc.categories.push({
        name: category,
        subCategory: formattedSubCategories,
      });
    }

    await weekDoc.save();
    return weekDoc;
  }

  async getPEDByWeek(week: string) {
    return PEDDatabaseModel.findOne({ week }).lean();
  }

  async getAllPED() {
    return PEDDatabaseModel.find().sort({ createdAt: 1 }).lean();
  }
}
