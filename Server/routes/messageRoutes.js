import express from "express";
import {
  allMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.route("/:chatId").get(protect, allMessages);
messageRouter.route("/").post(protect, sendMessage);

export {messageRouter};