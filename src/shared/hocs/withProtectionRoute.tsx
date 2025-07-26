// Dependencies
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

// Hooks
import { useAuth } from "@/hooks/auth";

// Components
import LoaderIndicator from "../components/LoaderIndicator";
import TBALoginScreen from "../components/TBALoginScreen";

const withProtectionRoute = (
  WrappedComponent: React.ComponentType,
  permission: "always" | "only-connected" | "only-disconnected"
): React.ComponentType => {
  return (props) => {
    const { 
      isLoading, 
      data, 
      isPending, 
      refetch, 
      isTBAClient, 
      showTBALogin, 
      isLoggingIn, 
      handleTBALogin 
    } = useAuth();
    
    console.log("INSIDE HERE");
    console.log(data);
    console.log(permission);
    console.log(isLoading);
    console.log(isPending);
    console.log("TBA Client:", isTBAClient);
    console.log("Show TBA Login:", showTBALogin);

    useEffect(() => {
      refetch();
    }, []);

    // Show TBA login screen for TBA clients without token
    if (showTBALogin) {
      return (
        <TBALoginScreen 
          onLoginClick={handleTBALogin}
          isLoggingIn={isLoggingIn}
        />
      );
    }

    if (isLoading || isPending) {
      return <LoaderIndicator variant={"fullscreen"} />;
    } else {
      if (!data && permission === "only-connected") {
        return <Navigate to="/login" />;
      }

      if (data && permission === "only-disconnected") {
        return <Navigate to={"/"} />;
      }
    }

    return (
      <>
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withProtectionRoute;
