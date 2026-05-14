import { Schema, model } from "mongoose";

export interface IModule {
  id: number;
  name: string;
  description: string;
}

const moduleSchema = new Schema<IModule>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true }
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

export default model<IModule>("Module", moduleSchema);
