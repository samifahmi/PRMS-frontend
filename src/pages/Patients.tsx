import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { Patient } from '../types';

// Mock data
const patientsData: Patient[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: {
      name: 'John Johnson',
      phone: '+1 (555) 987-6543',
      relation: 'Spouse'
    },
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789'
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1978-07-22',
    gender: 'male',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '+1 (555) 876-5432',
      relation: 'Spouse'
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Wilson',
    email: 'emily.wilson@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    address: '789 Pine St, Chicago, IL 60601',
    emergencyContact: {
      name: 'Robert Wilson',
      phone: '+1 (555) 765-4321',
      relation: 'Father'
    },
    insuranceInfo: {
      provider: 'Aetna',
      policyNumber: 'AE987654321'
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
];

export function Patients() {
  const [patients] = useState<Patient[]>(patientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient information and records</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <Button variant="outline" icon={Filter}>
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Patients</h3>
            <Badge variant="info">{filteredPatients.length} patients</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insurance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateAge(patient.dateOfBirth)} years
                      </div>
                      <div className="text-sm text-gray-500">
                        Born {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.insuranceInfo ? (
                        <div>
                          <div className="text-sm text-gray-900">{patient.insuranceInfo.provider}</div>
                          <div className="text-sm text-gray-500">{patient.insuranceInfo.policyNumber}</div>
                        </div>
                      ) : (
                        <Badge variant="warning">No Insurance</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleViewPatient(patient)}
                        >
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon={Edit}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" icon={MoreHorizontal}>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Patient Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient && (
          <div className="p-6 space-y-6">
            {/* Patient Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-blue-600">
                  {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h3>
                <p className="text-gray-600">
                  {calculateAge(selectedPatient.dateOfBirth)} years old • {selectedPatient.gender}
                </p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {selectedPatient.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {selectedPatient.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {selectedPatient.address}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {selectedPatient.emergencyContact.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {selectedPatient.emergencyContact.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Relation:</span> {selectedPatient.emergencyContact.relation}
                  </p>
                </div>
              </div>

              {selectedPatient.insuranceInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Insurance Information</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Provider:</span> {selectedPatient.insuranceInfo.provider}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Policy Number:</span> {selectedPatient.insuranceInfo.policyNumber}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Patient ID:</span> {selectedPatient.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date of Birth:</span> {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Registered:</span> {new Date(selectedPatient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button icon={Edit}>Edit Patient</Button>
              <Button variant="outline" icon={Calendar}>Schedule Appointment</Button>
              <Button variant="outline" icon={Eye}>View Medical History</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">Patient registration form would be implemented here.</p>
          <div className="flex gap-3">
            <Button>Save Patient</Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}