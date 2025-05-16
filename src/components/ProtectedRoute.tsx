'use client';

// This component no longer requires authentication
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Simply render children without any authentication checks
  return <>{children}</>;
};

export default ProtectedRoute;
