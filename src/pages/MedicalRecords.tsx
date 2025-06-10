import React, { useState } from 'react';
import { Plus, Search, FileText, User, Calendar, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { MedicalRecord } from '../types';

// Mock data
const medicalRecordsData: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. Smith',
    date: '2024-01-20',
    diagnosis: 'Hypertension',
    symptoms: 'High blood pressure, headaches, dizziness',
    treatment: 'Prescribed medication and lifestyle changes',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Once daily', duration: '30 days' }
    ],
    notes: 'Patient responding well to treatment. Follow-up in 4 weeks.',
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    doctorName: 'Dr. Davis',
    date: '2024-01-18',
    diagnosis: 'Type 2 Diabetes',
    symptoms: 'Increased thirst, frequent urination, fatigue',
    treatment: 'Metformin therapy and dietary counseling',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' }
    ],
    notes: 'Patient education provided on blood glucose monitoring.',
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '1',
    doctorName: 'Dr. Smith',
    date: '2024-01-15',
    diagnosis: 'Seasonal Allergies',
    symptoms: 'Sneezing, watery eyes, nasal congestion',
    treatment: 'Antihistamine therapy',
    medications: [
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '14 days' }
    ],
    notes: 'Symptoms should improve with treatment. Avoid known allergens.',
  }
];

export function MedicalRecords() {
  const [records] = useState<MedicalRecord[]>(medicalRecordsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredRecords = records.filter(record =>
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">Patient medical history and treatment records</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Record
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by diagnosis, doctor, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medical Records */}
      <div className="grid gap-6">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No medical records found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id} hover className="cursor-pointer" onClick={() => handleViewRecord(record)}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{record.diagnosis}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {record.doctorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                        <p className="text-sm text-gray-600">{record.symptoms}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
                        <p className="text-sm text-gray-600">{record.treatment}</p>
                      </div>
                      
                      {record.medications.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                          <div className="flex flex-wrap gap-2">
                            {record.medications.map((medication, index) => (
                              <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
                                <Pill className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-800">
                                  {medication.name} {medication.dosage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Record Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Medical Record Details"
        size="lg"
      >
        {selectedRecord && (
          <div className="p-6 space-y-6">
            {/* Record Header */}
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedRecord.diagnosis}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedRecord.doctorName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedRecord.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Record Details */}
            <div className="grid gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                <p className="text-gray-600">{selectedRecord.symptoms}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Treatment</h4>
                <p className="text-gray-600">{selectedRecord.treatment}</p>
              </div>

              {selectedRecord.medications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Medications</h4>
                  <div className="space-y-3">
                    {selectedRecord.medications.map((medication, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{medication.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Dosage:</span> {medication.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {medication.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {medication.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600">{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button>Edit Record</Button>
              <Button variant="outline">Print</Button>
              <Button variant="outline">Share</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Record Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Medical Record"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">Medical record form would be implemented here.</p>
          <div className="flex gap-3">
            <Button>Save Record</Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}