import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  mode: { type: String, enum: ["single", "multi"], default: "single" },
  date: { type: Date, default: Date.now },
  charactersTyped: { type: Number, default: 0 },
  errors: { type: Number, default: 0 }
});

export default mongoose.model("Score", scoreSchema);
