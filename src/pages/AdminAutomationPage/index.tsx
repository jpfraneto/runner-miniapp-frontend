import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import AppLayout from "@/shared/layouts/AppLayout";
import AdminAutomationPanel from "@/shared/components/AdminAutomationPanel";

const AdminAutomationPage: React.FC = () => {
  const { data: user } = useAuth();

  // Only allow access to FID 16098
  if (!user || user.fid !== 16098) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout>
      <AdminAutomationPanel />
    </AppLayout>
  );
};

export default AdminAutomationPage;