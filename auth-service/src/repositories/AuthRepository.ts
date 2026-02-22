import { UserModel } from '../models/User';

export const createAuthRepository = () => {
  
  const findByUsername = async (username: string) => {
    return UserModel.findOne({ username });
  };

  const createUser = async (username: string, email: string, hashedPassword: string) => {
    return UserModel.create({ username, email, password: hashedPassword });
  };

  return {
    findByUsername,
    createUser,
  };
};