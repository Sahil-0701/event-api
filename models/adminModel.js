import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organizationName: { type: String, required: true },
    role: { type: String, default: "admin" },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "event" }]
  },
  {
    timestamps: true
  }
);

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel; 