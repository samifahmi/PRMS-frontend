import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, User, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { Appointment } from '../types';

// Mock data
const appointmentsData: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '1',
    doctorName: 'Dr. Smith',
    date: '2024-01-25',
    time: '09:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    notes: 'Annual checkup',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Brown',
    doctorId: '2',
    doctorName: 'Dr. Davis',
    date: '2024-01-25',
    time: '10:30',
    duration: 45,
    type: 'follow-up',
    status: 'in-progress',
    notes: 'Follow-up for blood pressure',
    createdAt: '2024-01-22T00:00:00Z'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Emily Wilson',
    doctorId: '1',
    doctorName: 'Dr. Smith',
    date: '2024-01-25',
    time: '14:00',
    duration: 60,
    type: 'routine',
    status: 'scheduled',
    notes: 'Routine physical examination',
    createdAt: '2024-01-23T00:00:00Z'
  },
  {
    id: '4',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorId: '3',
    doctorName: 'Dr. Johnson',
    date: '2024-01-26',
    time: '11:00',
    duration: 30,
    type: 'emergency',
    status: 'completed',
    notes: 'Emergency consultation for chest pain',
    createdAt: '2024-01-24T00:00:00Z'
  }
];

export function Appointments() {
  const [appointments] = useState<Appointment[]>(appointmentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDate = appointment.date === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Badge variant="info">Consultation</Badge>;
      case 'follow-up':
        return <Badge variant="warning">Follow-up</Badge>;
      case 'routine':
        return <Badge variant="default">Routine</Badge>;
      case 'emergency':
        return <Badge variant="danger">Emergency</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const statusCounts = {
    all: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    'in-progress': appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and scheduling</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} hover className={statusFilter === status ? 'ring-2 ring-blue-500' : ''}>
            <CardContent className="text-center cursor-pointer" onClick={() => setStatusFilter(status)}>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize">
                {status === 'all' ? 'Total' : status.replace('-', ' ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <Badge variant="info">{filteredAppointments.length} appointments</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found for the selected criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                        {getTypeBadge(appointment.type)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {appointment.doctorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.time)} ({appointment.duration} min)
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(appointment.status)}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {appointment.status === 'scheduled' && (
                        <Button size="sm">
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule New Appointment"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">Appointment scheduling form would be implemented here.</p>
          <div className="flex gap-3">
            <Button>Schedule Appointment</Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}