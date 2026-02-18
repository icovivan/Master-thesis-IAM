import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useKeycloak } from './KeycloakProvider';

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authenticated, login } = useKeycloak();

  useEffect(() => {
    if (!authenticated) {
      login();
    }
  }, [authenticated, login]);

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;