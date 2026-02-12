import { DataTypes, Model, Sequelize } from 'sequelize';

export type UserAttributes = {
  id: number;
  username: string;
  password: string;
  email: string;
};

export type UserModel = Model<UserAttributes>;


export const defineUser = (sequelize: Sequelize) => {
  return sequelize.define<UserModel>('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });
};