import { ICategory } from './ped.interface';
import { PEDDatabaseModel } from './ped.model';

/* ---------- Utils ---------- */


const isSundayEvening = () => {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 18; // Sunday after 6 PM
};

const getCurrentWeekLabel = async (coachId: string, athleteId: string) => {
  const count = await PEDDatabaseModel.countDocuments({
    coachId,
    athleteId,
  });
  return `week_${count || 1}`;
};

const getNextWeekLabel = (week: string) => {
  const num = Number(week.split('_')[1]);
  return `week_${num + 1}`;
};

/* ---------- Service ---------- */

export class PEDDatabaseService {
  async createOrUpdatePEDTemplate(payload: {
    category: string;
    subCategory: { name: string }[];
  }) {
    const { category, subCategory } = payload;

    // 1️⃣ Find the SINGLE template document
    let pedDoc = await PEDDatabaseModel.findOne();

    // 2️⃣ Create ONLY ONCE
    if (!pedDoc) {
      pedDoc = await PEDDatabaseModel.create({
        categories: [],
      });
    }

    // 3️⃣ Prepare subCategories
    const formattedSubCategories = subCategory.map(sub => ({
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

    // 4️⃣ Find category
    const existingCategory = pedDoc.categories.find(
      (cat: any) => cat.name === category
    );

    if (existingCategory) {
      // 5️⃣ Push ONLY new subCategories
      const existingNames = new Set(
        existingCategory.subCategory.map((sub: any) => sub.name)
      );

      const newSubCategories = formattedSubCategories.filter(
        sub => !existingNames.has(sub.name)
      );

      if (newSubCategories.length > 0) {
        existingCategory.subCategory.push(...newSubCategories);
      }
    } else {
      // 6️⃣ Push new category
      pedDoc.categories.push({
        name: category,
        subCategory: formattedSubCategories,
      });
    }

    await pedDoc.save();
    return pedDoc;
  }

  async getPEDByWeek(week: string) {
    return PEDDatabaseModel.findOne({ week }).lean();
  }

  async getAllPED() {
    return PEDDatabaseModel.findOne({ week: '' }).sort({ createdAt: 1 }).lean();
  }

  async getAllPEDForApp(athleteId: string, week?: string) {
    const query: any = { athleteId };

    if (week) {
      query.week = week;
    }

    return PEDDatabaseModel.find(query)
      .sort({ createdAt: -1 }) // latest first
      .lean();
  }

  /**
   * Get PED data for athlete
   * If athlete-specific data doesn't exist,
   * create it from template
   */
  async getOrCreateForAthlete(athleteId: string, coachId: string) {
    // 1️⃣ Get latest athlete record
    const latestRecord = await PEDDatabaseModel.findOne({
      athleteId,
      coachId,
    }).sort({ createdAt: -1 });

    let week: string;

    // 2️⃣ Decide week
    if (latestRecord && isSundayEvening()) {
      week = getNextWeekLabel(latestRecord.week);
    } else if (latestRecord) {
      week = latestRecord.week;
    } else {
      week = 'week_1';
    }

    // 3️⃣ Check if record already exists
    let record = await PEDDatabaseModel.findOne({
      athleteId,
      coachId,
      week,
    });

    if (record) return record;

    // 4️⃣ Get TEMPLATE
    const template = await PEDDatabaseModel.findOne().lean();

    if (!template) {
      throw new Error('PED template not found');
    }

    // 5️⃣ Create athlete copy
    record = await PEDDatabaseModel.create({
      athleteId,
      coachId,
      week,
      categories: structuredClone(template.categories),
    });

    return record;
  }

  /**
   * Coach updates athlete PED data
   */
  async updateForAthlete(
    athleteId: string,
    coachId: string,
    week: string,
    categories: any[]
  ) {
    const record = await PEDDatabaseModel.findOne({
      athleteId,
      coachId,
      week,
    });

    if (!record) {
      throw new Error('Athlete PED record not found');
    }

    // 🔁 Loop through each incoming category
    categories.forEach((incomingCategory: any) => {
      // Find the existing category in record
      const existingCategory = record.categories.find(
        (cat: any) => cat.name === incomingCategory.name
      );

      if (!existingCategory) return;

      // 🔁 Loop through subCategories to update
      incomingCategory.subCategory.forEach((incomingSub: any) => {
        const existingSub = existingCategory.subCategory.find(
          (sub: any) => sub.name === incomingSub.name
        );

        if (!existingSub) return;

        // ✅ Update only allowed fields
        existingSub.dosage = incomingSub.dosage ?? existingSub.dosage;
        existingSub.frequency = incomingSub.frequency ?? existingSub.frequency;
        existingSub.mon = incomingSub.mon ?? existingSub.mon;
        existingSub.tue = incomingSub.tue ?? existingSub.tue;
        existingSub.wed = incomingSub.wed ?? existingSub.wed;
        existingSub.thu = incomingSub.thu ?? existingSub.thu;
        existingSub.fri = incomingSub.fri ?? existingSub.fri;
        existingSub.sat = incomingSub.sat ?? existingSub.sat;
        existingSub.sun = incomingSub.sun ?? existingSub.sun;
      });
    });

    await record.save();
    return record;
  }
}
