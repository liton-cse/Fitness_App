import { ICoach } from './coachInterface';
import { CoachModel } from './coachModel';

export class CoachService {
  async createUser(data: ICoach) {
    return await CoachModel.create(data);
  }

  async getUsers() {
    return await CoachModel.find();
  }

  async getUserById(id: string) {
    return await CoachModel.findById(id);
  }

  async updateUser(id: string, data: Partial<ICoach>) {
    return await CoachModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string) {
    return await CoachModel.findByIdAndDelete(id);
  }
}
