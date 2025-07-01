# Run Detail Page

A comprehensive page for displaying detailed information about a completed workout run.

## Features

- **Run Summary**: Displays key metrics (distance, time, pace) in a prominent card layout
- **Detailed Stats**: Shows comprehensive workout data including calories, heart rate, elevation, etc.
- **AI Confidence Indicator**: Visual indicator showing the confidence level of AI data extraction
- **Screenshot Gallery**: Interactive gallery of workout screenshots with modal view
- **Celebration Animation**: Special animation when coming from upload flow
- **Personal Best Badges**: Highlights when a run is a new personal best
- **Farcaster Integration**: Direct sharing to Farcaster with workout data
- **Verification Flow**: Option to verify low-confidence extractions

## Navigation Flow

1. **From Upload Flow**: After successful workout upload, users are automatically redirected to `/runs/:runId` with celebration state
2. **Direct Access**: Users can navigate directly to run details via URL
3. **Back Navigation**: Users can go back to previous page or close to home

## Route

```
/runs/:runId
```

## Props

The component uses React Router's `useParams` to get the run ID from the URL.

## State Management

- Uses TanStack Query for data fetching with caching
- Handles loading, error, and success states
- Manages celebration animation state
- Controls image gallery modal state

## Dependencies

- React Router for navigation
- Framer Motion for animations
- Farcaster Frame SDK for sharing
- TanStack Query for data fetching

## Styling

- Mobile-first responsive design
- Dark theme matching app design
- Smooth animations and transitions
- Accessible color contrast ratios
