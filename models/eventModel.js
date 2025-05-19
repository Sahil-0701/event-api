import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventTitle: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    organizer: { type: String, required: true },
    eventImages: [{ type: String, required: true }],

    totalSeats: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },
    eventType: {
      type: String,
      enum: ["concert", "conference", "workshop", "meetup"],
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "admin",
      required: true 
    },
    organizationName: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const eventModel =
  mongoose.models.event || mongoose.model("event", eventSchema);
export default eventModel;
