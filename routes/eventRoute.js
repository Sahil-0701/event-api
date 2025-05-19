import express from "express";
import {
  addEvent,
  getAllEvents,
  listEvents,
  removeEvent,
  singleEvent,
  updateEvent,
} from "../controllers/eventController.js";
import { upload, handleMulterError } from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";

const eventRouter = express.Router();

eventRouter.post(
  "/add",
  protect,
  upload.array('images', 4),
  handleMulterError,
  addEvent
);
eventRouter.get("/list", listEvents);
eventRouter.get("/all", getAllEvents);
eventRouter.post("/remove", protect, removeEvent);
eventRouter.post("/single", singleEvent);
eventRouter.post("/update", protect, upload.none(), updateEvent);


export default eventRouter;
