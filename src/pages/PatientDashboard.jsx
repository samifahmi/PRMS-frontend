import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Clock, 
  LogOut,
  Heart,
  User,
  Phone,
  MapPin,
  CheckCircle
} from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const upcomingAppointments = [
    {
      date: '2024-02-15',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      treatment: 'Routine Cleaning',
      status: 'confirmed'
    },
    {
      date: '2024-03-20',
      time: '2:30 PM',
      doctor: 'Dr. Johnson',
      treatment: 'Follow-up Consultation',
      status: 'scheduled'
    }
  ];

  const recentTreatments = [
    {
      date: '2024-01-20',
      treatment: 'Dental Cleaning',
      doctor: 'Dr. Smith',
      status: 'completed'
    },
    {
      date: '2024-01-05',
      treatment: 'Cavity Filling',
      doctor: 'Dr. Davis',
      status: 'completed'
    },
    {
      date: '2023-12-15',
      treatment: 'Routine Checkup',
      doctor: 'Dr. Smith',
      status: 'completed'
    }
  ];

  const quickActions = [
    { title: 'Book Appointment', icon: Calendar, description: 'Schedule your next visit' },
    { title: 'View Medical Records', icon: FileText, description: 'Access your treatment history' },
    { title: 'Pay Bills', icon: CreditCard, description: 'View and pay outstanding bills' },
    { title: 'Contact Clinic', icon: Phone, description: 'Get in touch with our staff' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Your Health Dashboard</h2>
          <p className="text-teal-100">
            Manage your appointments, view treatment history, and stay connected with your dental care.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 text-left"
              >
                <Icon className="w-8 h-8 text-teal-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <p className="text-sm text-gray-600">Your scheduled visits</p>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg">
                          <Calendar className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appointment.treatment}</p>
                          <p className="text-sm text-gray-600">{appointment.doctor}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <button className="mt-2 text-teal-600 hover:text-teal-700">
                    Schedule an appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Treatments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Treatments</h3>
              <p className="text-sm text-gray-600">Your treatment history</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTreatments.map((treatment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{treatment.treatment}</p>
                      <p className="text-sm text-gray-600">{treatment.doctor}</p>
                      <p className="text-sm text-gray-500">{new Date(treatment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
            <p className="text-sm text-gray-600">Personal and contact details</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{user.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Patient ID</p>
                    <p className="font-medium text-gray-900">PAT-{user.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Clinic Location</p>
                    <p className="font-medium text-gray-900">Dr. Seidnur Dental Clinic</p>
                    <p className="text-sm text-gray-500">123 Dental Street, City, State</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Update Information
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;