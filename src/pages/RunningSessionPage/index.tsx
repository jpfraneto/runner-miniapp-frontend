// Dependencies
import React from "react";
import { useParams } from "react-router-dom";

// Components
import RunningSessionDetail from "@/shared/components/RunningSessionDetail";

const RunningSessionPage: React.FC = () => {
  const { castHash } = useParams<{ castHash: string }>();

  if (!castHash) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Invalid Cast Hash</h2>
          <p>No cast hash provided in the URL.</p>
        </div>
      </div>
    );
  }

  return <RunningSessionDetail castHash={castHash} />;
};

export default RunningSessionPage;
