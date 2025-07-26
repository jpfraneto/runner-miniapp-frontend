// Dependencies
import React from "react";

// Components
import Typography from "@/shared/components/Typography";

// StyleSheet
import styles from "./TBALoginScreen.module.scss";

interface TBALoginScreenProps {
  onLoginClick: () => void;
  isLoggingIn: boolean;
}

const TBALoginScreen: React.FC<TBALoginScreenProps> = ({
  onLoginClick,
  isLoggingIn,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography
          variant="gta"
          weight="wide"
          size={32}
          lineHeight={36}
          className={styles.title}
          textAlign="center"
        >
          LOGIN ON BASE
        </Typography>
        
        <div className={styles.runnerContainer}>
          <img 
            src="/runner.gif" 
            alt="Runner" 
            className={styles.runnerGif}
          />
        </div>

        <button
          onClick={onLoginClick}
          className={styles.loginButton}
          disabled={isLoggingIn}
        >
          <Typography
            variant="geist"
            weight="medium"
            size={16}
            lineHeight={20}
          >
            {isLoggingIn ? "LOGGING IN..." : "LOGIN"}
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default TBALoginScreen;