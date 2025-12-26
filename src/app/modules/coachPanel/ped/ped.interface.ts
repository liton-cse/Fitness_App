/* ---------- Interfaces ---------- */

export interface ISubCategory {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface ICategory {
  name: string;
  subCategory: ISubCategory[];
}

export interface IPEDDatabase extends Document {
  coachId?: string;
  athleteId?: string;
  week: string;
  categories: ICategory[];
  createdAt: Date;
  updatedAt: Date;
}
