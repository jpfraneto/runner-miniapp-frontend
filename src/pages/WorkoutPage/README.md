# WorkoutPage Component

A React component similar to HomePage but with enhanced functionality for logging workouts with images and sharing them on Farcaster.

## Features

- **Modal-based Image Selection**: Opens a custom modal for seamless image selection
- **Multiple Image Support**: Users can select up to 2 images from their device
- **Image Preview**: Shows previews of selected images with file information
- **Pinata Integration**: Placeholder for uploading images to Pinata IPFS
- **Farcaster Integration**: Automatically composes and shares casts with workout images
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Usage

```tsx
import WorkoutPage from "@/pages/WorkoutPage";

// Use in your router
<Route path="/workout" element={<WorkoutPage />} />;
```

## Component Structure

```
WorkoutPage/
├── index.tsx                    # Main component
├── WorkoutPage.module.scss      # Component styles
└── README.md                    # This file
```

## Dependencies

- `@farcaster/frame-sdk` - For Farcaster integration
- `react-router-dom` - For routing
- Custom modal system - For image selection UI
- Shared components - Typography, Button, etc.

## Workflow

1. User clicks "Log Today's Workout" button
2. Custom modal opens with image selection interface
3. User selects 1-2 images from their device
4. Images are previewed with file information
5. User clicks "Upload & Share" button
6. Images are uploaded to Pinata (placeholder implementation)
7. Cast is composed with image URLs and shared on Farcaster
8. Success/error feedback is shown to user

## TODO

- [ ] Implement actual Pinata upload functionality
- [ ] Add image compression/optimization
- [ ] Add loading states for upload progress
- [ ] Add image validation (size, format, etc.)
- [ ] Add retry mechanism for failed uploads

## Styling

The component uses SCSS modules with:

- Dark theme with orange accent colors
- Responsive breakpoints
- Smooth animations and transitions
- Modern UI elements with proper spacing

## Modal Integration

The component integrates with the existing modal system:

- Uses `useModal` hook for state management
- Custom `WorkoutImageSelectionModal` for image selection
- `BottomAlertModal` for success/error messages
