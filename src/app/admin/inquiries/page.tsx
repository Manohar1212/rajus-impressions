'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, InquiryData } from '@/lib/parse';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'booked', label: 'Booked', color: 'bg-green-100 text-green-700' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-700' },
];

export default function InquiriesManagementPage() {
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const loadInquiries = async () => {
    try {
      const data = await parseHelpers.getInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleViewInquiry = (inquiry: InquiryData) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
    setNewStatus(inquiry.status);
    setDialogOpen(true);
  };

  const handleUpdateInquiry = async () => {
    if (!selectedInquiry?.id) return;
    setSaving(true);

    try {
      await parseHelpers.updateInquiryStatus(selectedInquiry.id, newStatus, notes);
      setDialogOpen(false);
      loadInquiries();
    } catch (error) {
      console.error('Failed to update inquiry:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredInquiries =
    statusFilter === 'all'
      ? inquiries
      : inquiries.filter((i) => i.status === statusFilter);

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status);
    return option ? (
      <span className={`px-2 py-1 text-xs rounded-full ${option.color}`}>
        {option.label}
      </span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
        {status}
      </span>
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inquiries</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and booking requests.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {statusOptions.map((option) => {
          const count = inquiries.filter((i) => i.status === option.value).length;
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-colors ${
                statusFilter === option.value ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === option.value ? 'all' : option.value)
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {option.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === 'all' ? 'All Inquiries' : `${statusFilter} Inquiries`} (
            {filteredInquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No inquiries found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {inquiry.phone}
                        </div>
                        {inquiry.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {inquiry.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{inquiry.service || '-'}</TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(inquiry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInquiry(inquiry)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary">
                      {selectedInquiry.phone}
                    </a>
                  </p>
                </div>
                {selectedInquiry.email && (
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-primary"
                      >
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {selectedInquiry.service && (
                <div>
                  <Label className="text-muted-foreground">Service Interest</Label>
                  <p className="font-medium">{selectedInquiry.service}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="p-3 bg-muted rounded-lg text-sm">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (internal)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this inquiry..."
                    rows={3}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateInquiry} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
