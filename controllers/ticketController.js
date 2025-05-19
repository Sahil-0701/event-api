import ticketModel from "../models/ticketModel.js";
import eventModel from "../models/eventModel.js";
import userModel from "../models/userModel.js";

// Purchase tickets for an event
const purchaseTickets = async (req, res) => {
  try {
    const { eventId, quantity, ticketType } = req.body;
    const userId = req.user.id;

    // Find event
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check if event is active
    if (event.status !== "active") {
      return res.status(400).json({ success: false, message: "Event is not active" });
    }

    // Calculate total amount based on ticket type
    let pricePerTicket;
    switch (ticketType) {
      case "vip":
        pricePerTicket = event.vipPrice;
        break;
      case "early-bird":
        pricePerTicket = event.earlyBirdPrice;
        break;
      default:
        pricePerTicket = event.regularPrice;
    }

    const totalAmount = pricePerTicket * quantity;

    // Create ticket
    const ticket = new ticketModel({
      user: userId,
      event: eventId,
      quantity,
      totalAmount,
      ticketType,
    });

    await ticket.save();

    // Update event capacity
    event.capacity -= quantity;
    await event.save();

    res.status(201).json({
      success: true,
      ticket: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        event: {
          name: event.name,
          date: event.date,
          venue: event.venue,
        },
        quantity,
        totalAmount,
        ticketType,
        purchaseDate: ticket.purchaseDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's tickets
const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await ticketModel
      .find({ user: userId })
      .populate("event", "name date venue images")
      .sort({ purchaseDate: -1 });

    res.json({
      success: true,
      tickets: tickets.map((ticket) => ({
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        event: {
          name: ticket.event.name,
          date: ticket.event.date,
          venue: ticket.event.venue,
          image: ticket.event.images[0],
        },
        quantity: ticket.quantity,
        totalAmount: ticket.totalAmount,
        ticketType: ticket.ticketType,
        status: ticket.status,
        purchaseDate: ticket.purchaseDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single ticket details
const getTicketDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const ticket = await ticketModel
      .findOne({ _id: ticketId, user: userId })
      .populate("event", "name date venue images description");

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.json({
      success: true,
      ticket: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        event: {
          name: ticket.event.name,
          date: ticket.event.date,
          venue: ticket.event.venue,
          description: ticket.event.description,
          image: ticket.event.images[0],
        },
        quantity: ticket.quantity,
        totalAmount: ticket.totalAmount,
        ticketType: ticket.ticketType,
        status: ticket.status,
        purchaseDate: ticket.purchaseDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel ticket
const cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const ticket = await ticketModel.findOne({ _id: ticketId, user: userId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    if (ticket.status !== "active") {
      return res.status(400).json({ success: false, message: "Ticket cannot be cancelled" });
    }

    // Update ticket status
    ticket.status = "cancelled";
    await ticket.save();

    // Update event capacity
    const event = await eventModel.findById(ticket.event);
    event.capacity += ticket.quantity;
    await event.save();

    res.json({
      success: true,
      message: "Ticket cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { purchaseTickets, getUserTickets, getTicketDetails, cancelTicket }; 