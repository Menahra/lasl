import {
  type DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";
import argon2 from "argon2";
import { nanoid } from "nanoid";
import { UserSettings } from "@/src/model/user.settings.model.ts";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hashedPassword = await argon2.hash(this.password);
  this.password = hashedPassword;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User extends TimeStamps {
  @prop({ lowercase: true, required: true, unique: true })
  email!: string;

  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode!: string;

  @prop({ default: null })
  passwordResetCode!: string | null;

  @prop({ default: false })
  verified!: boolean;

  @prop({ _id: false, type: () => UserSettings, default: {} })
  settings!: UserSettings;

  async validatePassword(
    this: DocumentType<User>,
    candidatePassword: User["password"],
  ) {
    return await argon2.verify(this.password, candidatePassword);
  }
}

export const UserModel = getModelForClass(User);
