import mongoose, { Schema, models } from "mongoose";

const NoteSchema = new Schema({
    id: { type: Number, required: true },
    content: { type: String, required: true },
    updatedAt: { type: String, required: true },
    userEmail: { type: String, required: true }
}, { timestamps: true });

export default models.Note || mongoose.model("Note", NoteSchema);