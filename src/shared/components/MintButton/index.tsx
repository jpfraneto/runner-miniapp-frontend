import React, { useState } from "react";
import { LuSparkle } from "react-icons/lu";
import sdk from "@farcaster/frame-sdk";
import styles from "./MintButton.module.scss";

interface MintButtonProps {
  weekNumber: number;
  className?: string;
}

const MintButton: React.FC<MintButtonProps> = ({ weekNumber, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleMint = async () => {
    try {
      setIsLoading(true);
      sdk.haptics.impactOccurred("medium");
      
      // Hardcoded smart contract details for future use
      // const contractAddress = "0x1234567890abcdef1234567890abcdef12345678";
      // const chainId = 8453; // Base chain
      
      // Simulate transaction call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      setTxHash(mockTxHash);
      setShowConfirmation(true);
      
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        setTxHash(null);
      }, 5000);
      
    } catch (error) {
      console.error("Mint failed:", error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation && txHash) {
    return (
      <div className={`${styles.confirmationContainer} ${className}`}>
        <LuSparkle className={styles.confirmationIcon} />
      </div>
    );
  }

  return (
    <button
      className={`${styles.mintButton} ${className} ${isLoading ? styles.loading : ''}`}
      onClick={handleMint}
      disabled={isLoading}
      title={`Mint Week ${weekNumber}`}
    >
      {isLoading ? (
        <div className={styles.loadingSpinner} />
      ) : (
        <LuSparkle className={styles.sparkleIcon} />
      )}
    </button>
  );
};

export default MintButton;