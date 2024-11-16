import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";

// .env फाइल को लोड करना
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// MongoDB से कनेक्शन स्थापित करना
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Database connection error:", err);
  }
};

// यूज़र की सभी चैट्स प्राप्त करने का रूट
app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  console.log("Fetching chats for user:", userId);

  try {
    const userChats = await UserChats.findOne({ userId });
    if (!userChats) {
      return res.status(404).json({ message: "No chats found for this user" });
    }
    res.status(200).json(userChats.chats);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    res.status(500).json({ message: "Failed to retrieve chats. Please try again." });
  }
});

// एक नया चैट बनाने का रूट
app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  console.log("Creating new chat for user:", userId);

  try {
    // नया चैट ऑब्जेक्ट बनाना और उसे MongoDB में सेव करना
    const newChat = new Chat({ userId, text });
    await newChat.save();

    // यूज़र की चैट्स लिस्ट में नया चैट जोड़ना
    let userChats = await UserChats.findOne({ userId });
    if (!userChats) {
      userChats = new UserChats({ userId, chats: [] });
    }
    userChats.chats.push(newChat._id);
    await userChats.save();

    res.status(201).json(newChat._id);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Failed to create chat. Please try again." });
  }
});

// विशिष्ट चैट प्राप्त करने का रूट
app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const chatId = req.params.id;
  console.log("Fetching chat with ID:", chatId);

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Internal server error!" });
  }
});


app.listen(port, () => {
  connect();
  console.log(`Server running on port ${port}`);
});







