// Dependencies
import React from "react";

interface LeaderboardIconProps {
  className?: string;
}

const LeaderboardIcon: React.FC<LeaderboardIconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16 4H18V21H16V4Z" />
      <path d="M10 8H12V21H10V8Z" />
      <path d="M4 12H6V21H4V12Z" />
      <path d="M12 2L15 5H9L12 2Z" />
    </svg>
  );
};

export default LeaderboardIcon;