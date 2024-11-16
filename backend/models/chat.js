import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  history: [
    {
      role: { type: String },
      parts: [
        {
          text: { type: String },
          img: { type: String }, // Add img field to store image data
        },
      ],
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;





