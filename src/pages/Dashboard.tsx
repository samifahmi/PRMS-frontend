import React from 'react';
import { Users, Calendar, CreditCard, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data
const statsData = {
  totalPatients: 1247,
  todayAppointments: 23,
  pendingBills: 156,
  monthlyRevenue: 94500,
  patientGrowth: 12,
  appointmentGrowth: 8,
  revenueGrowth: 15
};

const recentAppointments = [
  { id: '1', patient: 'Sarah Johnson', time: '09:00 AM', doctor: 'Dr. Smith', type: 'consultation', status: 'confirmed' },
  { id: '2', patient: 'Michael Brown', time: '10:30 AM', doctor: 'Dr. Davis', type: 'follow-up', status: 'in-progress' },
  { id: '3', patient: 'Emily Wilson', time: '02:00 PM', doctor: 'Dr. Johnson', type: 'routine', status: 'scheduled' },
  { id: '4', patient: 'David Miller', time: '03:30 PM', doctor: 'Dr. Smith', type: 'emergency', status: 'urgent' },
];

const monthlyData = [
  { month: 'Jan', patients: 65, revenue: 85000 },
  { month: 'Feb', patients: 72, revenue: 89000 },
  { month: 'Mar', patients: 68, revenue: 92000 },
  { month: 'Apr', patients: 85, revenue: 94500 },
  { month: 'May', patients: 92, revenue: 98000 },
  { month: 'Jun', patients: 105, revenue: 102000 },
];

export function Dashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAppointmentBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'in-progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="default">Scheduled</Badge>;
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.totalPatients.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{statsData.patientGrowth}% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.todayAppointments}</p>
              <p className="text-sm text-green-600">+{statsData.appointmentGrowth}% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Bills</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.pendingBills}</p>
              <p className="text-sm text-yellow-600">Requires attention</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(statsData.monthlyRevenue)}</p>
              <p className="text-sm text-green-600">+{statsData.revenueGrowth}% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Growth Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Patient Growth</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          <Badge variant="info">{recentAppointments.length} scheduled</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor} • {appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                  {getAppointmentBadge(appointment.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}