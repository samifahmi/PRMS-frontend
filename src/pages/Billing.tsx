import React, { useState } from 'react';
import { Plus, Search, DollarSign, FileText, Download, Send } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { Invoice } from '../types';

// Mock data
const invoicesData: Invoice[] = [
  {
    id: 'INV-001',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-20',
    dueDate: '2024-02-20',
    items: [
      { id: '1', description: 'Consultation Fee', quantity: 1, unitPrice: 150, total: 150 },
      { id: '2', description: 'Blood Test', quantity: 1, unitPrice: 75, total: 75 }
    ],
    subtotal: 225,
    tax: 22.5,
    total: 247.5,
    status: 'sent',
    createdAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'INV-002',
    patientId: '2',
    patientName: 'Michael Brown',
    date: '2024-01-18',
    dueDate: '2024-02-18',
    items: [
      { id: '1', description: 'Follow-up Consultation', quantity: 1, unitPrice: 100, total: 100 },
      { id: '2', description: 'Prescription Fee', quantity: 1, unitPrice: 25, total: 25 }
    ],
    subtotal: 125,
    tax: 12.5,
    total: 137.5,
    status: 'paid',
    createdAt: '2024-01-18T00:00:00Z'
  },
  {
    id: 'INV-003',
    patientId: '3',
    patientName: 'Emily Wilson',
    date: '2024-01-15',
    dueDate: '2024-01-30',
    items: [
      { id: '1', description: 'Physical Examination', quantity: 1, unitPrice: 200, total: 200 },
      { id: '2', description: 'X-Ray', quantity: 1, unitPrice: 125, total: 125 }
    ],
    subtotal: 325,
    tax: 32.5,
    total: 357.5,
    status: 'overdue',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'INV-004',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-22',
    dueDate: '2024-02-22',
    items: [
      { id: '1', description: 'Emergency Consultation', quantity: 1, unitPrice: 250, total: 250 }
    ],
    subtotal: 250,
    tax: 25,
    total: 275,
    status: 'draft',
    createdAt: '2024-01-22T00:00:00Z'
  }
];

export function Billing() {
  const [invoices] = useState<Invoice[]>(invoicesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="default">Draft</Badge>;
      case 'sent':
        return <Badge variant="info">Sent</Badge>;
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingRevenue = totalRevenue - paidRevenue;

  const statusCounts = {
    all: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-600 mt-1">Manage patient billing and payment tracking</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Create Invoice
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} hover className={statusFilter === status ? 'ring-2 ring-blue-500' : ''}>
            <CardContent className="text-center cursor-pointer" onClick={() => setStatusFilter(status)}>
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize">
                {status === 'all' ? 'Total' : status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
            <Badge variant="info">{filteredInvoices.length} invoices</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                      <div className="text-sm text-gray-500">Tax: {formatCurrency(invoice.tax)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon={Download}>
                          PDF
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button variant="ghost" size="sm" icon={Send}>
                            Send
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Invoice Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && (
          <div className="p-6 space-y-6">
            {/* Invoice Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedInvoice.id}</h3>
                <p className="text-gray-600">Patient: {selectedInvoice.patientName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Invoice Date</p>
                <p className="font-medium">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
              <div className="space-y-2">
                {selectedInvoice.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <p className="font-medium text-gray-900">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Status and Due Date */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button icon={Download}>Download PDF</Button>
              <Button variant="outline" icon={Send}>Send to Patient</Button>
              {selectedInvoice.status === 'sent' && (
                <Button variant="outline">Mark as Paid</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Invoice Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Invoice"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">Invoice creation form would be implemented here.</p>
          <div className="flex gap-3">
            <Button>Create Invoice</Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}