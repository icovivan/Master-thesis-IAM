import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No user data available
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100 mt-1">{user.title || 'Employee'}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p className="text-lg text-gray-800">{user.uid}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>

          {user.department && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
              <p className="text-lg text-gray-800">{user.department}</p>
            </div>
          )}

          {user.title && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
              <p className="text-lg text-gray-800">{user.title}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;