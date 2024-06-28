import  express from "express";
import {
    accessChat,
      fetchChats,
      createGroupChat,
      removeFromGroup,
      addToGroup,
      renameGroup,updatingPic
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.route("/").post(protect, accessChat);
chatRouter.route("/").get(protect, fetchChats);
chatRouter.route("/group").post(protect, createGroupChat);
chatRouter.route("/rename").put(protect, renameGroup);
chatRouter.route("/groupremove").put(protect, removeFromGroup);
chatRouter.route("/groupadd").put(protect, addToGroup);
chatRouter.route("/updatePic").put(protect, updatingPic);

export {chatRouter};