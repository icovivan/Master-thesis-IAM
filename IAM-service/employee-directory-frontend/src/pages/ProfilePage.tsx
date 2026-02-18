import { useState, useEffect } from 'react';
import { useKeycloak } from '../components/KeycloakProvider';
import { profileAPI } from '../services/api';
import type { UserProfile } from '../types';

const ProfilePage = () => {
  const { keycloak } = useKeycloak();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getCurrentUser();
      setProfile(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Profile not found'}
        </div>
      </div>
    );
  }

  const userName = keycloak.tokenParsed?.name || profile.name;
  const userInitials = profile.firstName && profile.lastName 
    ? `${profile.firstName[0]}${profile.lastName[0]}`
    : profile.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-purple-600 text-3xl font-bold">
              {userInitials}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-purple-100 mt-1">{profile.title || 'Employee'}</p>
              {profile.department && (
                <p className="text-purple-200 text-sm mt-1">{profile.department} Department</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="text-lg text-gray-800">{profile.uid}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-lg text-gray-800">{profile.email}</p>
          </div>

          {profile.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              <p className="text-lg text-gray-800">{profile.phone}</p>
            </div>
          )}

          {profile.department && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
              <p className="text-lg text-gray-800">{profile.department}</p>
            </div>
          )}

          {profile.title && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
              <p className="text-lg text-gray-800">{profile.title}</p>
            </div>
          )}

          {/* Keycloak Token Info (for demo purposes) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentication Info</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Authenticated via:</span>
                <span className="ml-2 text-gray-800">Keycloak (OAuth2/OIDC)</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Session ID:</span>
                <span className="ml-2 text-gray-800 font-mono text-xs">
                  {keycloak.tokenParsed?.sid?.substring(0, 20)}...
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Token expires:</span>
                <span className="ml-2 text-gray-800">
                  {keycloak.tokenParsed?.exp 
                    ? new Date(keycloak.tokenParsed.exp * 1000).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;