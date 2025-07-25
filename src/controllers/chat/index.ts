import { Request, Response } from "express";
import { chatModel, studentsModel } from "../../database";
import { responseMessage } from "../../helper";
import { object } from "joi";

let ObjectId = require("mongoose").Types.ObjectId;


export const send_message = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const chat = await new chatModel({ senderId, receiverId, message }).save();
    return res.status(200).json({ success: true, message: "Message sent", data: chat });
  } catch (error) {
    return res.status(500).json({ success: false, responseMessage: responseMessage.internalServerError, error });
  }
};

export const get_chat_between_users = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const messages = await chatModel.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, responseMessage: responseMessage.internalServerError, error });
  }
};

export const get_all_chats = async (req, res) => {
  try {
    const allChats = await chatModel.findOne()
      .populate("senderId", "name role")
      .populate("receiverId", "name role");
    return res.status(200).json({ success: true, allChats });
  } catch (error) {
    return res.status(500).json({ success: false, responseMessage: responseMessage.internalServerError, error });
  }
};

export const delete_chat = async (req, res) => {
  try {
    const { id } = req.body
    await chatModel.findOneAndDelete({ _id: new ObjectId(id) });
    return res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, responseMessage: responseMessage.internalServerError, error });
  }
};

export const block_user = async (req, res) => {
  try {
    const { id } = req.body;
    await studentsModel.findOneAndUpdate({ _id: new ObjectId(id) }, { isBlocked: true });
    return res.status(200).json({ success: true, message: "User Blocked" });
  } catch (error) {
    return res.status(500).json({ success: false, responseMessage: responseMessage.internalServerError, error });
  }
};
