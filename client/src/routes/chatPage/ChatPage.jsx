import "./chatPage.css";
import React from "react";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  console.log("Chat ID from URL:", chatId);
  
  console.log("Chat ID:", chatId); // Log the chatId to ensure it's correct
  

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error fetching chat: ${response.statusText}`);
      }

      return response.json();
    },
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isLoading ? (
            "Loading..."
          ) : isError ? (
            <p>{error.message}</p>
          ) : (
            data?.history?.map((message, i) => (
              <React.Fragment key={i}>
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                  />
                )}
                <div className={message.role === "user" ? "message user" : "message"}>
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </React.Fragment>
            ))
          )}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;






