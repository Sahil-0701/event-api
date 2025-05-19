import eventModel from "../models/eventModel.js";
import { v2 as cloudinary } from "cloudinary";
import adminModel from "../models/adminModel.js";

const addEvent = async (req, res) => {
  try {
    const {
      eventTitle,
      eventDescription,
      eventDate,
      startTime,
      endTime,
      venue,
      organizer,
      totalSeats,
      ticketPrice,
      eventType,
      isFeatured,
    } = req.body;

    const admin = await adminModel.findById(req.user._id);
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const imageUrl = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: "image",
                  folder: "event-images",
                },
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          });
          imageUrls.push(imageUrl);
        }
      } catch (uploadError) {
        return res.json({
          success: false,
          message: "Error uploading images: " + uploadError.message,
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const newEvent = new eventModel({
      eventTitle,
      eventDescription,
      eventDate,
      startTime,
      endTime,
      venue,
      organizer,
      totalSeats: Number(totalSeats),
      ticketPrice: Number(ticketPrice),
      eventType,
      isFeatured: isFeatured === "true",
      eventImages: imageUrls,
      createdBy: admin._id,
      organizationName: admin.organizationName,
    });

    const savedEvent = await newEvent.save();

    admin.events.push(savedEvent._id);
    await admin.save();

    res.json({ success: true, event: savedEvent });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const listEvents = async (req, res) => {
  try {
    if (req.user && req.user.role === "admin") {
      const events = await eventModel.find({ createdBy: req.user._id });
      return res.json({ success: true, events });
    }

    if (req.user && req.user.role === "owner") {
      const events = await eventModel.find({});
      return res.json({ success: true, events });
    }

    const events = await eventModel.find({});
    res.json({ success: true, events });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel
      .find({})
      .populate("createdBy", "name organizationName")
      .sort({ eventDate: 1 });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const removeEvent = async (req, res) => {
  try {
    const event = await eventModel.findById(req.body.id);

    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    if (
      !event.createdBy ||
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.json({
        success: false,
        message: "Not authorized to delete this event",
      });
    }

    if (event.eventImages && event.eventImages.length > 0) {
      try {
        for (const imageUrl of event.eventImages) {
          const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      } catch {}
    }

    await eventModel.findByIdAndDelete(req.body.id);

    await adminModel.findByIdAndUpdate(req.user._id, {
      $pull: { events: req.body.id },
    });

    res.json({
      success: true,
      message: "Event and associated images deleted successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const singleEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await eventModel
      .findById(eventId)
      .populate("createdBy", "name organizationName");
    res.json({ success: true, event });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId, eventTitle, eventDescription } = req.body;

    if (!eventId) {
      return res.json({ success: false, message: "Event ID is required" });
    }

    const event = await eventModel.findById(eventId);

    if (!event) {
      return res.json({ success: false, message: "Event not found" });
    }

    if (
      !event.createdBy ||
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.json({
        success: false,
        message: "Not authorized to update this event",
      });
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      { eventTitle, eventDescription },
      { new: true }
    );

    if (!updatedEvent) {
      return res.json({ success: false, message: "Failed to update event" });
    }

    res.json({ success: true, event: updatedEvent });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export { addEvent, listEvents, removeEvent, singleEvent, updateEvent ,getAllEvents };
