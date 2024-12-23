import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!isAuthenticated) {
        router.push("/auth/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
  return AuthenticatedComponent;
};

export default withAuth;
