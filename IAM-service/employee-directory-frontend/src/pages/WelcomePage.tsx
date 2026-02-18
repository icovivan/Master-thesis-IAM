import { useKeycloak } from '../components/KeycloakProvider';

const WelcomePage = () => {
  const { login } = useKeycloak();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">TechCorp</h1>
          <p className="text-gray-600 mt-2">Employee Directory</p>
          <div className="mt-2 inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
            Phase 2 - Keycloak Authentication
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Welcome!</h2>
          <p className="text-gray-600 mb-4">
            This application uses <strong>Keycloak</strong> for authentication with OAuth2/OIDC protocol.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-medium mb-2">✨ Features:</p>
            <ul className="space-y-1 ml-4">
              <li>• Single Sign-On (SSO)</li>
              <li>• Centralized authentication</li>
              <li>• Token-based security</li>
              <li>• No password handling in app</li>
            </ul>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Login with Keycloak
        </button>

        {/* Test Credentials Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Test Credentials:</p>
          <p className="text-xs text-gray-600">Username: <code className="bg-gray-200 px-1">jdoe</code></p>
          <p className="text-xs text-gray-600">Password: <code className="bg-gray-200 px-1">password123</code></p>
          <p className="text-xs text-gray-500 mt-2 italic">
            You'll be redirected to Keycloak's login page
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;