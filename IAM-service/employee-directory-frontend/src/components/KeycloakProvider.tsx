/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import keycloak from '../config/keycloak';

interface KeycloakContextType {
  keycloak: typeof keycloak;
  authenticated: boolean;
  initialized: boolean;
  login: () => void;
  logout: () => void;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider = ({ children }: KeycloakProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Define initKeycloak BEFORE useEffect
const initKeycloak = async () => {
  try {
    const auth = await keycloak.init({
      onLoad: 'login-required',  // Changed from 'check-sso'
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });

    console.log('Keycloak initialized, authenticated:', auth);
    setAuthenticated(auth);
    setInitialized(true);

    // Token refresh
    keycloak.onTokenExpired = () => {
      console.log('Token expired, refreshing...');
      keycloak.updateToken(30).catch(() => {
        console.error('Failed to refresh token');
        keycloak.login();
      });
    };

    // Add callback handlers
    keycloak.onAuthSuccess = () => {
      console.log('Auth success!');
    };

    keycloak.onAuthError = () => {
      console.error('Auth error!');
    };

    keycloak.onAuthRefreshSuccess = () => {
      console.log('Token refreshed!');
    };

    keycloak.onAuthRefreshError = () => {
      console.error('Token refresh failed!');
    };

  } catch (error) {
    console.error('Keycloak initialization error:', error);
    setInitialized(true);
  }
};

  // Now useEffect can call it
  useEffect(() => {
    initKeycloak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Initializing authentication...</div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider
      value={{
        keycloak,
        authenticated,
        initialized,
        login,
        logout,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};