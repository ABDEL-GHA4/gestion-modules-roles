import { Schema, model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "manager" | "agent";

export interface IUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  modules: number[];
  assignedRoles: number[];
}

const userSchema = new Schema<IUser>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "agent"],
      required: true
    },
    modules: { type: [Number], default: [] },
    assignedRoles: { type: [Number], default: [] }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        const { _id, password, ...cleanRet } = ret;
        return cleanRet;
      }
    }
  }
);

userSchema.pre("save", async function (this: HydratedDocument<IUser>, next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>("User", userSchema);
