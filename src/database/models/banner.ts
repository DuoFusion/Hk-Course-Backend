import { required } from "joi";
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    action: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const bannerModel = mongoose.model("banner", bannerSchema);
   