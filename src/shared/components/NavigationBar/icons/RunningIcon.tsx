// Dependencies
import React from "react";

interface RunningIconProps {
  className?: string;
}

const RunningIcon: React.FC<RunningIconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13.5 5.5C13.5 6.88 12.38 8 11 8S8.5 6.88 8.5 5.5 9.62 3 11 3 13.5 4.12 13.5 5.5Z" />
      <path d="M9.8 8.9L7 23H9.1L10.9 15L13.5 17V23H15.5V15.5L12.5 13.5L13.5 10.5C14.5 12 16.5 13 19 13V11C17.5 11 16.5 10.5 16 9.5L14.5 7.5C14.1 7.1 13.6 6.9 13 6.9S12.1 7.1 11.7 7.5L9.8 8.9Z" />
    </svg>
  );
};

export default RunningIcon;