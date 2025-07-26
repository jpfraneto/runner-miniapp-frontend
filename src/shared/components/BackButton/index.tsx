import React from 'react';
import styles from './BackButton.module.scss';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  className = '',
  children = '← Back'
}) => {
  return (
    <button 
      onClick={onClick} 
      className={`${styles.backButton} ${className}`}
    >
      {children}
    </button>
  );
};

export default BackButton;