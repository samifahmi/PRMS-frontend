import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  LogOut,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const todayStats = [
    {
      title: 'Today\'s Patients',
      value: '12',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed Treatments',
      value: '8',
      icon: Stethoscope,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Reviews',
      value: '3',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      title: 'Next Appointment',
      value: '2:30 PM',
      icon: Clock,
      color: 'bg-purple-500'
    }
  ];

  const todaySchedule = [
    {
      time: '09:00 AM',
      patient: 'Sarah Johnson',
      treatment: 'Dental Cleaning',
      duration: '30 min',
      status: 'completed'
    },
    {
      time: '10:00 AM',
      patient: 'Michael Brown',
      treatment: 'Root Canal Consultation',
      duration: '45 min',
      status: 'completed'
    },
    {
      time: '11:30 AM',
      patient: 'Emily Wilson',
      treatment: 'Cavity Filling',
      duration: '60 min',
      status: 'in-progress'
    },
    {
      time: '02:30 PM',
      patient: 'David Miller',
      treatment: 'Crown Placement',
      duration: '90 min',
      status: 'scheduled'
    },
    {
      time: '04:30 PM',
      patient: 'Lisa Anderson',
      treatment: 'Teeth Whitening',
      duration: '45 min',
      status: 'scheduled'
    }
  ];

  const recentPatients = [
    {
      name: 'Sarah Johnson',
      lastVisit: '2024-01-20',
      condition: 'Routine Cleaning',
      nextAppointment: '2024-04-20'
    },
    {
      name: 'Michael Brown',
      lastVisit: '2024-01-18',
      condition: 'Root Canal Treatment',
      nextAppointment: '2024-02-15'
    },
    {
      name: 'Emily Wilson',
      lastVisit: '2024-01-15',
      condition: 'Cavity Treatment',
      nextAppointment: '2024-03-15'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Dr. {user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Activity className="w-5 h-5" />
              </button>
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Medical Practice Dashboard</h2>
          <p className="text-purple-100">
            Manage your patients, review treatments, and track your medical practice efficiently.
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <p className="text-sm text-gray-600">Your appointments for today</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todaySchedule.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                        <p className="text-xs text-gray-500">{appointment.duration}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.treatment}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
              <p className="text-sm text-gray-600">Recently treated patients</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                      <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next:</p>
                      <p className="text-sm font-medium text-gray-900">{patient.nextAppointment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common medical tasks</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
              <FileText className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Add Treatment Notes</h4>
              <p className="text-sm text-gray-600">Document patient treatments</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
              <Users className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">View Patient History</h4>
              <p className="text-sm text-gray-600">Access medical records</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
              <Calendar className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-1">Schedule Follow-up</h4>
              <p className="text-sm text-gray-600">Book next appointments</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;