import { Schema, model } from "mongoose";

export interface IAgentModule {
  agentId: number;
  moduleId: number;
}

const agentModuleSchema = new Schema<IAgentModule>(
  {
    agentId: { type: Number, required: true, index: true },
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

agentModuleSchema.index({ agentId: 1, moduleId: 1 }, { unique: true });

export default model<IAgentModule>("AgentModule", agentModuleSchema);
