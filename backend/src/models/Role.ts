import { Schema, model } from "mongoose";

export interface IRole {
  id: number;
  name: string;
  label: string;
  moduleId: number;
}

const roleSchema = new Schema<IRole>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    moduleId: { type: Number, required: true, index: true }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        const { _id, ...cleanRet } = ret;
        return cleanRet;
      }
    }
  }
);

export default model<IRole>("Role", roleSchema);
