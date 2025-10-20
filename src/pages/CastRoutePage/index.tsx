import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sdk } from "@farcaster/miniapp-sdk";
import LoaderIndicator from "@/shared/components/LoaderIndicator";

export function CastRoutePage() {
  // grab hash from url ("https://{baseUrl}/cast/{hash}")
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // if we have a hash, open the cast hash through the farcaster sdk
    if (hash) {
      sdk.actions.viewCast({ hash });
    }

    // navigate to the home page (or elsewhere) after a short timeout (hidden from users since miniapp is minimized)
    const timeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);

    return () => clearTimeout(timeout);
  }, [hash, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "60vh",
        padding: "16px",
      }}
    >
      <LoaderIndicator size={160} />
      <div style={{ marginTop: 12, color: "#bbb" }}>Opening cast...</div>
    </div>
  );
}
