import sdk from "@farcaster/frame-sdk";
import { ErrorResponse } from "@/services/user";

export interface ErrorHandlingOptions {
  showToast?: boolean;
  showModal?: boolean;
  trackAnalytics?: boolean;
  onRetry?: () => void;
  onSignUp?: () => void;
  toastProvider?: {
    showToast: (
      message: string,
      type: "success" | "error" | "warning" | "info",
      duration?: number
    ) => void;
  };
}

export interface UserFriendlyError {
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  actionText?: string;
  action?: () => void;
  secondaryActionText?: string;
  secondaryAction?: () => void;
  showTimer?: boolean;
  timerMessage?: string;
}

/**
 * Maps error types to user-friendly messages and actions
 */
export const mapErrorToUserMessage = (
  error: ErrorResponse["error"],
  options: ErrorHandlingOptions = {}
): UserFriendlyError => {
  switch (error.type) {
    case "DAILY_LIMIT_REACHED":
      return {
        title: "Daily Limit Reached",
        message:
          "You can only submit one running session per day. Please try again tomorrow!",
        type: "warning",
        showTimer: true,
        timerMessage: "You can submit again in:",
      };

    case "USER_NOT_FOUND":
      return {
        title: "Account Required",
        message: "Please create an account first to submit running sessions.",
        type: "error",
        actionText: "Sign Up",
        action: options.onSignUp,
      };

    case "DUPLICATE_SESSION":
      return {
        title: "Already Processed",
        message: "This running session has already been processed.",
        type: "info",
      };

    case "PROCESSING_ERROR":
    default:
      return {
        title: "Processing Error",
        message:
          "An error occurred while processing your running session. Please try again.",
        type: "error",
      };
  }
};

/**
 * Handles errors with haptic feedback and user notifications
 */
export const handleSubmissionError = (
  error: ErrorResponse["error"],
  options: ErrorHandlingOptions = {}
): UserFriendlyError => {
  // Provide haptic feedback based on error type
  switch (error.type) {
    case "DAILY_LIMIT_REACHED":
      sdk.haptics.notificationOccurred("warning");
      break;
    case "USER_NOT_FOUND":
    case "PROCESSING_ERROR":
      sdk.haptics.notificationOccurred("error");
      break;
    case "DUPLICATE_SESSION":
      sdk.haptics.impactOccurred("light");
      break;
    default:
      sdk.haptics.notificationOccurred("error");
  }

  // Track analytics if enabled
  if (options.trackAnalytics) {
    trackErrorAnalytics(error);
  }

  const userError = mapErrorToUserMessage(error, options);

  // Show toast notification if enabled
  if (options.showToast && options.toastProvider) {
    const toastType =
      userError.type === "warning"
        ? "warning"
        : userError.type === "info"
        ? "info"
        : "error";
    options.toastProvider.showToast(userError.message, toastType);
  }

  return userError;
};

/**
 * Tracks error occurrences for monitoring purposes
 */
export const trackErrorAnalytics = (error: ErrorResponse["error"]) => {
  // In a real app, this would send to your analytics service
  console.log("Error Analytics:", {
    errorType: error.type,
    errorCode: error.code,
    statusCode: error.statusCode,
    message: error.message,
    timestamp: new Date().toISOString(),
  });

  // Example: Send to analytics service
  // analytics.track('running_session_error', {
  //   error_type: error.type,
  //   error_code: error.code,
  //   status_code: error.statusCode,
  // });
};

/**
 * Calculates time until next day (for daily limit timer)
 */
export const getTimeUntilNextDay = (): {
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

/**
 * Formats time until next day as a readable string
 */
export const formatTimeUntilNextDay = (): string => {
  const { hours, minutes, seconds } = getTimeUntilNextDay();

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Type guard to check if a response is an error
 */
export const isErrorResponse = (response: any): response is ErrorResponse => {
  return response && response.success === false && response.error;
};
