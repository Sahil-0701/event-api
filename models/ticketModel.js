import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    ticketType: {
      type: String,
      required: true,
      enum: ["regular", "vip", "early-bird"],
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "cancelled", "used"],
      default: "active",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Generate unique ticket number before saving
ticketSchema.pre("save", async function (next) {
  if (!this.ticketNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    this.ticketNumber = `TICKET-${timestamp}-${random}`;
  }
  next();
});

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel; 