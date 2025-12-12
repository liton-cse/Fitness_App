export interface IDosageInfo {
  dosage?: string;
  frequency?: string;
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface IPEDInfo {
  week?: string;
  category: string;
  subCategory: string;
  ped: IDosageInfo;
}
