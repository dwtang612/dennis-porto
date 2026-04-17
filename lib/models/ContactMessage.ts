import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ContactMessage = InferSchemaType<typeof ContactMessageSchema>;

export const ContactMessageModel: Model<ContactMessage> =
  (models.ContactMessage as Model<ContactMessage> | undefined) ??
  model<ContactMessage>("ContactMessage", ContactMessageSchema);
