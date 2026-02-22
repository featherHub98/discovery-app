import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


type AuthRepository = {
  findByUsername: (username: string) => Promise<any>;
  createUser: (username: string, email: string, hash: string) => Promise<any>;
};

export const createAuthService = (repo: AuthRepository, jwtSecret: string) => {
  
  const register = async (username: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return repo.createUser(username, email, hashedPassword);
  };

  const login = async (username: string, password: string) => {
    const user = await repo.findByUsername(username);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      jwtSecret, 
      { expiresIn: '1h' }
    );

    return { 
      token, 
      user: { id: user.id, username: user.username } 
    };
  };

  return {
    register,
    login,
  };
};