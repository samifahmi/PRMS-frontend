import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data
const monthlyData = [
  { month: 'Jan', patients: 65, revenue: 85000, appointments: 120 },
  { month: 'Feb', patients: 72, revenue: 89000, appointments: 135 },
  { month: 'Mar', patients: 68, revenue: 92000, appointments: 128 },
  { month: 'Apr', patients: 85, revenue: 94500, appointments: 156 },
  { month: 'May', patients: 92, revenue: 98000, appointments: 168 },
  { month: 'Jun', patients: 105, revenue: 102000, appointments: 182 },
];

const appointmentTypeData = [
  { name: 'Consultation', value: 45, color: '#3B82F6' },
  { name: 'Follow-up', value: 30, color: '#10B981' },
  { name: 'Routine', value: 20, color: '#F59E0B' },
  { name: 'Emergency', value: 5, color: '#EF4444' },
];

const ageGroupData = [
  { ageGroup: '0-18', male: 15, female: 18 },
  { ageGroup: '19-35', male: 45, female: 52 },
  { ageGroup: '36-50', male: 38, female: 35 },
  { ageGroup: '51-65', male: 28, female: 31 },
  { ageGroup: '65+', male: 22, female: 25 },
];

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalPatients = monthlyData.reduce((sum, month) => sum + month.patients, 0);
  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalAppointments = monthlyData.reduce((sum, month) => sum + month.appointments, 0);
  const avgRevenuePerPatient = totalRevenue / totalPatients;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button icon={Download} variant="outline">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
              <p className="text-sm text-green-600">+12% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600">+8% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
              <p className="text-sm text-green-600">+15% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Revenue/Patient</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgRevenuePerPatient)}</p>
              <p className="text-sm text-green-600">+5% from last period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
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

        {/* Appointment Types */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Types Distribution</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Group Demographics */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Patient Demographics by Age Group</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="male" fill="#3B82F6" name="Male" />
                <Bar dataKey="female" fill="#EC4899" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Timeline */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Monthly Appointments vs Revenue</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : value,
                  name === 'appointments' ? 'Appointments' : 'Revenue'
                ]}
              />
              <Line yAxisId="left" type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={3} name="appointments" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} name="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Metrics</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Patient Retention Rate</span>
                <span className="text-sm font-semibold text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Appointment Show Rate</span>
                <span className="text-sm font-semibold text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Wait Time</span>
                <span className="text-sm font-semibold text-blue-600">12 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Patient Satisfaction</span>
                <span className="text-sm font-semibold text-green-600">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outstanding Invoices</span>
                <span className="text-sm font-semibold text-yellow-600">{formatCurrency(15750)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Collection Rate</span>
                <span className="text-sm font-semibold text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Bill Amount</span>
                <span className="text-sm font-semibold text-blue-600">{formatCurrency(287)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Growth</span>
                <span className="text-sm font-semibold text-green-600">+8.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Operational Insights</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Hours</span>
                <span className="text-sm font-semibold text-blue-600">2-4 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Busiest Day</span>
                <span className="text-sm font-semibold text-blue-600">Wednesday</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Consultation Time</span>
                <span className="text-sm font-semibold text-blue-600">28 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Staff Utilization</span>
                <span className="text-sm font-semibold text-green-600">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}