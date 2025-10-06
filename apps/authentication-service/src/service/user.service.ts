import { type User, UserModel } from "../model/user.model.ts";

export const createUser = (userToCreate: Partial<User>) => {
  return UserModel.create(userToCreate);
};

export const findUserById = (id: string) => UserModel.findById(id);

export const findUserByEmail = (email: User["email"]) =>
  UserModel.findOne({ email });
