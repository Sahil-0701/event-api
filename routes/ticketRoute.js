import express from "express";
import { purchaseTickets, getUserTickets, getTicketDetails, cancelTicket } from "../controllers/ticketController.js";
import protect from "../middleware/authMiddleware.js";

const ticketRouter = express.Router();

// All routes require authentication
ticketRouter.use(protect);

// Purchase tickets
ticketRouter.post("/purchase", purchaseTickets);

// Get user's tickets
ticketRouter.get("/my-tickets", getUserTickets);

// Get single ticket details
ticketRouter.get("/:ticketId", getTicketDetails);

// Cancel ticket
ticketRouter.post("/:ticketId/cancel", cancelTicket);

export default ticketRouter; 