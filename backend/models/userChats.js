import mongoose from "mongoose";

const userChatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  chats: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
      title: { type: String },
    },
  ],
});

const UserChats = mongoose.model("UserChats", userChatsSchema);
export default UserChats;





