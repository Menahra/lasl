import {
  getModelForClass,
  modelOptions,
  prop,
  type Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";
import { User } from "./user.model.ts";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Session extends TimeStamps {
  @prop({ ref: () => User })
  user!: Ref<User>;

  @prop({ default: true })
  valid!: boolean;
}

export const SessionModel = getModelForClass(Session);
