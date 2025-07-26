import React, { useEffect, useState } from 'react';
import styles from './Toast.module.scss';
import sdk from '@farcaster/frame-sdk';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Haptic feedback when toast appears
    switch (type) {
      case 'success':
        sdk.haptics.notificationOccurred('success');
        break;
      case 'error':
        sdk.haptics.notificationOccurred('error');
        break;
      case 'warning':
        sdk.haptics.notificationOccurred('warning');
        break;
      case 'info':
        sdk.haptics.impactOccurred('light');
        break;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [type, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '';
    }
  };

  const handleClose = () => {
    sdk.haptics.impactOccurred('light');
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!isVisible && !onClose) return null;

  return (
    <div className={`${styles.toast} ${styles[type]} ${!isVisible ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;