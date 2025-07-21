// Dependencies
import React from 'react';
import sdk from "@farcaster/frame-sdk";

export default function NotFoundPage(): React.ReactNode {
  const handleContactDev = () => {
    try {
      sdk.actions.viewProfile({ fid: 16098 });
    } catch (error) {
      console.error("Failed to open profile:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.8 }}>
        The app might be temporarily unavailable or under maintenance.
      </p>
      <button
        onClick={handleContactDev}
        style={{
          backgroundColor: '#8B5CF6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Contact @jpfraneto.eth
      </button>
      <p style={{ fontSize: '14px', marginTop: '16px', opacity: 0.6 }}>
        DM the dev to report the issue
      </p>
    </div>
  );
}
