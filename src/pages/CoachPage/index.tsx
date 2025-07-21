// Dependencies
import React, { useState, useRef, useEffect } from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import Typography from "@/shared/components/Typography";

// StyleSheet
import styles from "./CoachPage.module.scss";

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "coach";
  timestamp: Date;
}

const CoachPage: React.FC = () => {
  const [messages, _setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! I'm your AI running coach. I'm here to help you stay motivated and improve your running performance.",
      sender: "coach",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example options (could be dynamic per message)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Header */}

        {/* Chat Container */}
        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === "user"
                    ? styles.userMessage
                    : styles.coachMessage
                }`}
              >
                <div className={styles.messageBubble}>
                  <Typography
                    variant="geist"
                    weight="regular"
                    size={14}
                    lineHeight={18}
                  >
                    {message.text}
                  </Typography>
                  <div className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CoachPage;
