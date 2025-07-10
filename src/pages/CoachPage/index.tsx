// Dependencies
import React, { useState, useRef, useEffect } from "react";

// Components
import AppLayout from "@/shared/layouts/AppLayout";
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! I'm your AI running coach. I'm here to help you stay motivated and improve your running performance. How can I help you today?",
      sender: "coach",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example options (could be dynamic per message)
  const options = [
    "How do I stay motivated?",
    "How can I improve my pace?",
    "What's a good running schedule?",
    "How do I prevent injuries?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateCoachResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple response logic based on keywords
    if (
      lowerMessage.includes("motivation") ||
      lowerMessage.includes("motivated")
    ) {
      return "Remember why you started! Every step you take is progress. You're building a stronger, healthier version of yourself. Keep pushing forward! 💪";
    }

    if (lowerMessage.includes("pace") || lowerMessage.includes("speed")) {
      return "Great question! Your pace will naturally improve with consistent training. Focus on building endurance first, then gradually increase your speed. Don't rush the process! 🏃‍♂️";
    }

    if (lowerMessage.includes("distance") || lowerMessage.includes("far")) {
      return "Distance comes with time and consistency. Start with what feels comfortable and gradually increase by 10% each week. Your body will adapt! 📏";
    }

    if (lowerMessage.includes("tired") || lowerMessage.includes("exhausted")) {
      return "Rest is just as important as training! Listen to your body and don't be afraid to take rest days. Recovery is where the magic happens! 😴";
    }

    if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
      return "Setting goals is fantastic! Make them SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. What's your next running goal? 🎯";
    }

    if (lowerMessage.includes("form") || lowerMessage.includes("technique")) {
      return "Good running form is key! Keep your head up, shoulders relaxed, and land midfoot. Don't overthink it - natural movement is often best! 🏃‍♀️";
    }

    if (lowerMessage.includes("schedule") || lowerMessage.includes("plan")) {
      return "Consistency is key! Try running 3-4 times per week with rest days in between. Start with shorter runs and gradually build up. You've got this! 📅";
    }

    if (lowerMessage.includes("injury") || lowerMessage.includes("pain")) {
      return "If you're experiencing pain, it's important to rest and recover. Don't push through pain - it's your body's way of telling you something needs attention. Consider seeing a professional if it persists! 🩹";
    }

    if (
      lowerMessage.includes("nutrition") ||
      lowerMessage.includes("food") ||
      lowerMessage.includes("eat")
    ) {
      return "Fuel your runs! Eat a light meal 2-3 hours before running, stay hydrated, and refuel within 30 minutes after your run. Your body needs good nutrition to perform! 🍎";
    }

    if (
      lowerMessage.includes("weather") ||
      lowerMessage.includes("rain") ||
      lowerMessage.includes("cold")
    ) {
      return "Don't let weather stop you! Dress appropriately for the conditions. In cold weather, layer up. In rain, wear moisture-wicking clothes. Every run in challenging conditions makes you stronger! 🌧️";
    }

    // Default responses
    const defaultResponses = [
      "That's a great question! Running is a journey, and everyone's path is different. What specific aspect would you like to focus on? 🤔",
      "I love your enthusiasm! Running is about progress, not perfection. Keep showing up and you'll see improvements over time! ✨",
      "You're doing amazing! Remember, every runner was once a beginner. Consistency is more important than speed or distance. Keep going! 🚀",
      "That's exactly the right mindset! Running is as much mental as it is physical. Trust the process and enjoy the journey! 🧠",
      "Great thinking! Running is a skill that develops with practice. Be patient with yourself and celebrate every small victory! 🎉",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const handleOptionClick = async (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateCoachResponse(option),
        sender: "coach",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachResponse]);
      setIsTyping(false);
    }, 1500);
  };

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
            {isTyping && (
              <div className={`${styles.message} ${styles.coachMessage}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CoachPage;
