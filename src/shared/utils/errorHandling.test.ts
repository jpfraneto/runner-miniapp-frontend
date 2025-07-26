// Test file demonstrating error handling implementation
// Run this to test the error handling functionality

import { 
  handleSubmissionError, 
  mapErrorToUserMessage, 
  isErrorResponse,
  formatTimeUntilNextDay 
} from './errorHandling';

import { ErrorResponse } from '@/services/user';

// Mock error responses for testing
export const mockErrorResponses = {
  dailyLimit: {
    success: false,
    processed: false,
    error: {
      type: 'DAILY_LIMIT_REACHED' as const,
      message: 'Daily submission limit reached',
      code: 'DAILY_LIMIT_001',
      statusCode: 429
    },
    castHash: 'test-cast-hash'
  } as ErrorResponse,

  userNotFound: {
    success: false,
    processed: false,
    error: {
      type: 'USER_NOT_FOUND' as const,
      message: 'User not found in system',
      code: 'USER_001',
      statusCode: 404
    }
  } as ErrorResponse,

  duplicateSession: {
    success: false,
    processed: false,
    error: {
      type: 'DUPLICATE_SESSION' as const,
      message: 'Session already processed',
      code: 'DUPLICATE_001',
      statusCode: 409
    }
  } as ErrorResponse,

  processingError: {
    success: false,
    processed: false,
    error: {
      type: 'PROCESSING_ERROR' as const,
      message: 'Failed to process running session',
      code: 'PROCESSING_001',
      statusCode: 500
    }
  } as ErrorResponse
};

// Test functions
export const testErrorHandling = () => {
  console.log('🧪 Testing Error Handling Implementation');
  console.log('=====================================');

  // Test daily limit error
  console.log('\n1. Testing Daily Limit Error:');
  const dailyLimitError = mapErrorToUserMessage(mockErrorResponses.dailyLimit.error);
  console.log('✅ Title:', dailyLimitError.title);
  console.log('✅ Message:', dailyLimitError.message);
  console.log('✅ Type:', dailyLimitError.type);
  console.log('✅ Shows Timer:', dailyLimitError.showTimer);

  // Test user not found error
  console.log('\n2. Testing User Not Found Error:');
  const userNotFoundError = mapErrorToUserMessage(mockErrorResponses.userNotFound.error);
  console.log('✅ Title:', userNotFoundError.title);
  console.log('✅ Message:', userNotFoundError.message);
  console.log('✅ Action Text:', userNotFoundError.actionText);

  // Test duplicate session error
  console.log('\n3. Testing Duplicate Session Error:');
  const duplicateError = mapErrorToUserMessage(mockErrorResponses.duplicateSession.error);
  console.log('✅ Title:', duplicateError.title);
  console.log('✅ Message:', duplicateError.message);
  console.log('✅ Type:', duplicateError.type);

  // Test processing error
  console.log('\n4. Testing Processing Error:');
  const processingError = mapErrorToUserMessage(mockErrorResponses.processingError.error);
  console.log('✅ Title:', processingError.title);
  console.log('✅ Message:', processingError.message);
  console.log('✅ Action Text:', processingError.actionText);

  // Test error response detection
  console.log('\n5. Testing Error Response Detection:');
  console.log('✅ Daily limit is error:', isErrorResponse(mockErrorResponses.dailyLimit));
  console.log('✅ Success response is error:', isErrorResponse({ success: true, verified: true }));

  // Test timer formatting
  console.log('\n6. Testing Timer Formatting:');
  console.log('✅ Time until next day:', formatTimeUntilNextDay());

  console.log('\n🎉 All error handling tests completed!');
};

// Usage examples for integration
export const usageExamples = {
  // Example 1: Basic error handling in component
  handleApiError: (response: any) => {
    if (isErrorResponse(response)) {
      const errorDetails = handleSubmissionError(response.error, {
        trackAnalytics: true,
        onRetry: () => console.log('Retry clicked'),
        onSignUp: () => console.log('Sign up clicked')
      });
      return errorDetails;
    }
    return null;
  },

  // Example 2: Error handling with toast notifications
  handleApiErrorWithToast: (response: any, toastProvider: any) => {
    if (isErrorResponse(response)) {
      const errorDetails = handleSubmissionError(response.error, {
        showToast: true,
        trackAnalytics: true,
        toastProvider,
        onRetry: () => console.log('Retry clicked'),
      });
      return errorDetails;
    }
    return null;
  },

  // Example 3: Custom error handling with specific actions
  handleDailyLimitError: (response: any) => {
    if (isErrorResponse(response) && response.error.type === 'DAILY_LIMIT_REACHED') {
      return handleSubmissionError(response.error, {
        trackAnalytics: true,
        // Could add custom logic here for daily limit
      });
    }
    return null;
  }
};