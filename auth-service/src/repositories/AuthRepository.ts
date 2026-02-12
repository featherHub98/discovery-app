import { UserModel } from '../models/User';

export const createAuthRepository = (userModel: any) => {
  
  const findByUsername = async (username: string) => {
    return userModel.findOne({ where: { username } });
  };

  const createUser = async (username: string, email: string, hashedPassword: string) => {
    return userModel.create({ username, email, password: hashedPassword });
  };

  return {
    findByUsername,
    createUser,
  };
};