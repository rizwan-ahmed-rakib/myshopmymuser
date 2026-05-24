import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import AddEmployeeModal from "./AddEmployeeModal";
import BASE_URL_of_POS from "../../../posConfig";
import UpdateProfileSuccessPopup from "./UpdateProfileSuccessPopup";
import UpdateEmployeeProfileModal from "./UpdateProfileModal";

const EmployeeProfilePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchEmployeeProfile();
    }, [id]);

    const fetchEmployeeProfile = async () => {
        try {
            const response = await axios.get(`${BASE_URL_of_POS}/api/users/create-new-user-with-profile/${id}/`);
            setEmployee(response.data);
        } catch (error) {
            console.error("Error fetching employee profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };



    const handleUpdateSuccess = (updatedData) => {
        // Update local state
        setEmployee(prev => ({...prev, ...updatedData}));
        setShowEditModal(false);

        // Show success popup
        setSuccessMessage("Employee profile has been updated successfully!");
        setShowSuccessPopup(true);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Employee not found</h2>
                    <button
                        onClick={() => navigate("/employees")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Employees
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/employees")}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <svg xmlns="http://www.w3.org2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                        Back to Employees
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                        <div
                            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
                    </div>

                    {/* Profile Header */}
                    <div className="px-8 pb-8 -mt-16 relative">
                        <div className="flex flex-col md:flex-row md:items-end justify-between">
                            <div className="flex items-end">
                                {/* Profile Image */}
                                <div className="relative">
                                    <div
                                        className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                                        <img
                                            src={employee.profile_picture || "https://via.placeholder.com/150"}
                                            alt={employee.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/150";
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                </div>

                                {/* Name and Role */}
                                <div className="ml-6 mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
                                    <div className="flex items-center mt-2">
                                        <span
                                            className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mr-3">
                                            {employee.role}
                                        </span>
                                        <span className="text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1"
                                                 viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            {employee.address || "No address provided"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 mt-4 md:mt-0">
                                <button
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2"
                                         viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                    </svg>
                                    Message
                                </button>
                                <button
                                    onClick={handleEditProfile}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2"
                                         viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                    </svg>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Personal Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-6 w-6 text-gray-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Full Name</h3>
                                            <p className="text-gray-900">{employee.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-6 w-6 text-gray-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Email</h3>
                                            <p className="text-gray-900">{employee.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-6 w-6 text-gray-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Phone</h3>
                                            <p className="text-gray-900">{employee.user?.phone_number || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="h-6 w-6 text-gray-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Address</h3>
                                            <p className="text-gray-900">{employee.address || "No address provided"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Employment Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-5 w-5 text-blue-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Department</p>
                                                <p className="font-semibold">{employee.department || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div
                                                className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-5 w-5 text-green-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path
                                                        d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                                    <path fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Monthly Salary</p>
                                                <p className="font-semibold">৳{employee.salary?.toLocaleString() || "0"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div
                                                className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-5 w-5 text-purple-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Sales Target</p>
                                                <p className="font-semibold">৳{employee.target?.toLocaleString() || "0"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-2">
                                            <div
                                                className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Area Code</p>
                                                <p className="font-semibold">{employee.areacode || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats and Info */}
                        <div className="space-y-6">
                            {/* Joining Date Card */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm opacity-90">Date Joined</p>
                                        <p className="text-2xl font-bold">
                                            {new Date(employee.date_joined).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm opacity-90">Employee ID: #{employee.id}</p>
                            </div>

                            {/* Status Card */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Status</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Account Status</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${employee.user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {employee.user?.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Attendance Today</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${employee.user?.is_present ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {employee.user?.is_present ? 'Present' : 'Absent'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Last Attendance</span>
                                        <span className="text-gray-900 font-medium">
                                            {employee.user?.last_attendance ? new Date(employee.user.last_attendance).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-4 w-4 text-blue-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                    <path fillRule="evenodd"
                                                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <span>View Attendance</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </button>

                                    <button
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-4 w-4 text-green-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <span>Performance Report</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </button>

                                    <button
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center">
                                            <div
                                                className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     className="h-4 w-4 text-purple-600" viewBox="0 0 20 20"
                                                     fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <span>Salary Slip</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400"
                                             viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal (You'll need to create this component) */}

            {/*{showEditModal && (*/}
            {/*    // <EditProfileModal*/}
            {/*    //     employee={employee}*/}
            {/*    //     onClose={() => setShowEditModal(false)}*/}
            {/*    //     onSuccess={handleUpdateSuccess}*/}
            {/*    // />*/}

            {/*    <AddEmployeeSalaryAdvanceModal*/}
            {/*        isOpen={employee}*/}
            {/*        onClose={() => setShowEditModal(false)}*/}
            {/*        onSuccess={handleUpdateSuccess}*/}
            {/*    />*/}



            {/*    // <AddEmployeeSalaryAdvanceModal*/}
            {/*    //     isOpen={isAddOpen}*/}
            {/*    //     onClose={() => setIsAddOpen(false)}*/}
            {/*    //     onSuccess={handleEmployeeAdded}*/}
            {/*    // />*/}
            {/*    */}
            {/*)}*/}




                        {/* Update Modal */}
            {showEditModal && (
                <UpdateEmployeeProfileModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleUpdateSuccess}
                    employeeData={employee}
                />
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <UpdateProfileSuccessPopup
                    message={successMessage}
                    onClose={() => setShowSuccessPopup(false)}
                />
            )}

        </div>
    );
};

export default EmployeeProfilePage;