import { type User, UserModel } from "../model/user.model.ts";

export const createUser = (userToCreate: Partial<User>) => {
  return UserModel.create(userToCreate);
};
