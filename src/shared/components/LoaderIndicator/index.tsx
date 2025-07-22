// Dependencies
import React from "react";

// StyleSheet
import styles from "./LoaderIndicator.module.scss";

interface LoaderIndicatorProps {
  variant?: "default" | "fullscreen";
  size?: number;
}

const LoaderIndicator: React.FC<LoaderIndicatorProps> = ({
  variant = "default",
  size = 160,
}) => {
  return (
    <div
      className={styles[variant]}
      style={{ width: "100%", height: `${size}px` }}
    >
      <div
        className={styles.runnerCharacter}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

export default LoaderIndicator;
