// Dependencies
import React, { useState, useEffect } from "react";

// Components
import Typography from "../Typography";
import Button from "../Button";

// StyleSheet
import styles from "./AIAgent.module.scss";
import sdk from "@farcaster/frame-sdk";

interface AIAgentProps {
  message: string;
  className?: string;
  button1Text?: string;
  button2Text?: string;
  onButton1Click?: () => void;
  onButton2Click?: () => void;
  autoAnimate?: boolean;
  typingSpeed?: number;
}

const AIAgent: React.FC<AIAgentProps> = ({
  message,
  className = "",
  button1Text,
  button2Text,
  onButton1Click,
  onButton2Click,
  autoAnimate = true,
  typingSpeed = 50,
}) => {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (!autoAnimate) {
      setDisplayedMessage(message);
      if (button1Text && button2Text) {
        setShowButtons(true);
      }
      return;
    }

    setIsTyping(true);
    setDisplayedMessage("");
    setShowButtons(false);

    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedMessage(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        // Show buttons after typing is complete
        if (button1Text && button2Text) {
          setShowButtons(true);
        }
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [message, autoAnimate, typingSpeed, button1Text, button2Text]);

  const handleButton1Click = () => {
    console.log("yes");
    sdk.haptics.selectionChanged();
    onButton1Click?.();
  };

  const handleButton2Click = () => {
    console.log("no");
    sdk.haptics.selectionChanged();
    onButton2Click?.();
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.bubble}>
        <Typography
          variant="geist"
          weight="medium"
          size={14}
          className={styles.message}
        >
          {displayedMessage}
          {isTyping && <span className={styles.cursor}>|</span>}
        </Typography>
      </div>

      {showButtons && (
        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            caption={button1Text || "Yes"}
            onClick={handleButton1Click}
            className={styles.responseButton}
          />
          <Button
            variant="secondary"
            caption={button2Text || "No"}
            onClick={handleButton2Click}
            className={styles.responseButton}
          />
        </div>
      )}
    </div>
  );
};

export default AIAgent;
