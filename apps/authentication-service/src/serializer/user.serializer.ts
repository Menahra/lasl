import type { DocumentType } from "@typegoose/typegoose";
import type { User } from "@/src/model/user.model.ts";

export type SerializedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  settings: User["settings"];
  createdAt?: Date;
  updatedAt?: Date;
};

export const serializeUser = (user: DocumentType<User>): SerializedUser => {
  const userObj = user.toObject({ virtuals: true });

  return {
    id: userObj._id.toString(),
    email: userObj.email,
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    settings: userObj.settings,
    ...(userObj.createdAt ? { createdAt: userObj.createdAt } : {}),
    ...(userObj.updatedAt ? { updatedAt: userObj.updatedAt } : {}),
  };
};
