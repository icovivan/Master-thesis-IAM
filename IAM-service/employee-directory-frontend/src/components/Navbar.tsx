import { Link } from 'react-router-dom';
import { useKeycloak } from './KeycloakProvider';

const Navbar = () => {
  const { authenticated, logout, keycloak } = useKeycloak();

  if (!authenticated) {
    return null;
  }

  const userName = keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || 'User';

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              TechCorp Directory <span className="text-xs bg-purple-700 px-2 py-1 rounded ml-2">Phase 2</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="hover:bg-purple-700 px-3 py-2 rounded transition"
              >
                Employees
              </Link>
              <Link
                to="/profile"
                className="hover:bg-purple-700 px-3 py-2 rounded transition"
              >
                My Profile
              </Link>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm">
              Welcome, <span className="font-semibold">{userName}</span>
            </span>
            <button
              onClick={logout}
              className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;