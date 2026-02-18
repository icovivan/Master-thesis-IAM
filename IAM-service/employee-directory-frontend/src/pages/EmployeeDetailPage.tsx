import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Employee } from '../types';
import { employeesAPI } from '../services/api';

const EmployeeDetailPage = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (uid) {
      fetchEmployee(uid);
    }
  }, [uid]);

  const fetchEmployee = async (employeeUid: string) => {
    try {
      const response = await employeesAPI.getEmployeeByUid(employeeUid);
      setEmployee(response.employee);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employee details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading employee details...</div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Employee not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-purple-600 hover:underline"
        >
          ← Back to Employee List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Employee Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-8 text-white">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-purple-600 text-4xl font-bold">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{employee.name}</h1>
              <p className="text-xl text-purple-100 mt-1">{employee.title}</p>
              <p className="text-purple-200 mt-1">{employee.department} Department</p>
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <a href={`mailto:${employee.email}`} className="text-purple-600 hover:underline">
                  {employee.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Phone</p>
                <a href={`tel:${employee.phone}`} className="text-gray-800">
                  {employee.phone}
                </a>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-start">
              <div className="bg-pink-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Department</p>
                <p className="text-gray-800">{employee.department}</p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">Username</p>
                <p className="text-gray-800">{employee.uid}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;