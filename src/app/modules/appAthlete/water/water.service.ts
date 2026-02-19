import { IWater } from './water.interface';
import { Water } from './water.model';

// helper to format today's date YYYY-MM-DD
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const createWaterToDB = async (
  payload: Omit<IWater, 'date'>
) => {
  const waterData: IWater = {
    ...payload,
    date: getTodayDate(),
  };

  const result = await Water.create(waterData);
  return result;
};

const getAllWaterFromDB = async (userId: string) => {
  return await Water.find({ userId });
};

const getSingleWaterFromDB = async (id: string) => {
  return await Water.findById(id);
};

const updateWaterInDB = async (
  id: string,
  payload: Partial<IWater>
) => {
  return await Water.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteWaterFromDB = async (id: string) => {
  return await Water.findByIdAndDelete(id);
};

export const WaterService = {
  createWaterToDB,
  getAllWaterFromDB,
  getSingleWaterFromDB,
  updateWaterInDB,
  deleteWaterFromDB,
};
