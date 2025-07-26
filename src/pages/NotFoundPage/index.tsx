// Dependencies
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

// Hooks
import { useAuth } from "@/shared/hooks/auth/useAuth";

export default function NotFoundPage(): React.ReactNode {
  const navigate = useNavigate();
  const { data: user, isLoading } = useAuth();
  
  const handleContactDev = () => {
    try {
      sdk.actions.viewProfile({ fid: 16098 });
    } catch (error) {
      console.error("Failed to open profile:", error);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [user, isLoading, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {!user && (
        <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
          Something went wrong
        </h1>
      )}
      <img
        src="/runner.gif"
        alt="runner"
        style={{ 
          width: "100px", 
          marginBottom: "16px",
          transform: user ? "translateX(100px)" : "translateX(0)",
          transition: "transform 1s ease-in-out"
        }}
      />
      {!user && (
        <>
          <p style={{ fontSize: "16px", marginBottom: "24px", opacity: 0.8 }}>
            The app might be temporarily unavailable or under maintenance.
          </p>
          <button
            onClick={handleContactDev}
            style={{
              backgroundColor: "#8B5CF6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            dm the dev @jpfraneto.eth
          </button>

          <p style={{ fontSize: "12px", marginTop: "16px", opacity: 0.6 }}>
            BUT FIRST TRY REFRESHING AND BEING PATIENT! its as skill that will help
            you throughout your whole life
          </p>
          <p style={{ fontSize: "12px", marginTop: "16px", opacity: 0.6 }}>
            or go and get some $runner{" "}
            <span
              onClick={() => {
                sdk.actions.swapToken({});
              }}
            >
              (click here!)
            </span>
          </p>
        </>
      )}
    </div>
  );
}
