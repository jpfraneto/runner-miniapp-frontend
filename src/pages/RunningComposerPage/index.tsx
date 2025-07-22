// Dependencies
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";

const RunningComposerPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Try to open the cast composer in the /running channel
    const openCastComposer = async () => {
      try {
        // Use composeCast instead of openCastComposer
        await sdk.actions.composeCast({
          text: "Just finished my run! 🏃‍♂️",
          embeds: [],
        });
        console.log("Cast composer opened successfully");
      } catch (error) {
        console.error("Failed to open cast composer:", error);
      }
    };

    openCastComposer();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "white", fontSize: "24px", marginBottom: "10px" }}>
          Log Your Run
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "16px" }}>
          Share your running session with the community
        </p>
      </div>

      <button
        onClick={() => navigate("/home")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default RunningComposerPage;
