'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, InquiryData } from '@/lib/parse';
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
import { Loader2, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';

const statusOptions = [
  { value: 'new', label: 'New', color: '210 80% 55%', bgTint: '210 80% 96%' },
  { value: 'contacted', label: 'Contacted', color: '38 85% 55%', bgTint: '38 80% 95%' },
  { value: 'booked', label: 'Booked', color: '150 65% 45%', bgTint: '150 50% 95%' },
  { value: 'completed', label: 'Completed', color: '260 30% 58%', bgTint: '260 30% 96%' },
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
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--admin-gold))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--admin-gold-dim))]">
            Manage
          </p>
          <h1 className="font-serif text-2xl text-[hsl(var(--admin-text))] mt-1">
            Enquiries
          </h1>
          <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
            Manage customer enquiries and booking requests.
          </p>
        </div>
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

      {/* Status Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {statusOptions.map((option) => {
          const count = inquiries.filter((i) => i.status === option.value).length;
          const isSelected = statusFilter === option.value;
          return (
            <div
              key={option.value}
              className={`admin-card p-5 cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                isSelected ? 'ring-1 ring-[hsl(var(--admin-gold))]' : ''
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === option.value ? 'all' : option.value)
              }
            >
              {/* Accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `hsl(${option.color})` }}
              />
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))] font-medium">
                  {option.label}
                </p>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: `hsl(${option.color})`,
                    boxShadow: `0 0 8px hsl(${option.color} / 0.4)`,
                  }}
                />
              </div>
              <p className="text-3xl font-bold text-[hsl(var(--admin-text))]">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Enquiries Table */}
      <div className="admin-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[hsl(var(--admin-border-subtle))]">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--admin-gold)_/_0.1)] flex items-center justify-center">
            <Mail className="h-4 w-4 text-[hsl(var(--admin-gold))]" />
          </div>
          <h2 className="text-sm font-medium text-[hsl(var(--admin-text))]">
            {statusFilter === 'all'
              ? 'All Enquiries'
              : `${statusOptions.find((s) => s.value === statusFilter)?.label} Enquiries`}{' '}
            ({filteredInquiries.length})
          </h2>
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 rounded-xl bg-[hsl(var(--admin-surface-2))] flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-[hsl(var(--admin-text-faint))]" />
            </div>
            <p className="text-sm text-[hsl(var(--admin-text-muted))]">No enquiries found</p>
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
                  <TableCell className="font-medium text-sm text-[hsl(var(--admin-text))]">
                    {inquiry.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--admin-text-muted))]">
                        <Phone className="h-3 w-3 text-[hsl(var(--admin-text-faint))]" />
                        {inquiry.phone}
                      </div>
                      {inquiry.email && (
                        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--admin-text-faint))]">
                          <Mail className="h-3 w-3" />
                          {inquiry.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--admin-text-muted))]">
                    {inquiry.service || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`admin-status-pill admin-status-${inquiry.status}`}>
                      {inquiry.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-[hsl(var(--admin-text-faint))]">
                    {formatDate(inquiry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewInquiry(inquiry)}
                      className="h-8 px-4 rounded-lg text-xs font-medium bg-[hsl(var(--admin-gold)_/_0.1)] border border-[hsl(var(--admin-gold)_/_0.25)] text-[hsl(38_55%_35%)] hover:bg-[hsl(var(--admin-gold)_/_0.2)] hover:border-[hsl(var(--admin-gold)_/_0.4)] transition-all"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-[hsl(var(--admin-text))]">
              Enquiry Details
            </DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Name
                  </Label>
                  <p className="font-medium text-sm mt-1 text-[hsl(var(--admin-text))]">
                    {selectedInquiry.name}
                  </p>
                </div>
                <div>
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Date
                  </Label>
                  <p className="font-medium text-sm mt-1 flex items-center gap-1.5 text-[hsl(var(--admin-text))]">
                    <Calendar className="h-3.5 w-3.5 text-[hsl(var(--admin-text-faint))]" />
                    {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Phone
                  </Label>
                  <p className="font-medium text-sm mt-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[hsl(var(--admin-text-faint))]" />
                    <a href={`tel:${selectedInquiry.phone}`} className="text-[hsl(var(--admin-gold))] hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </p>
                </div>
                {selectedInquiry.email && (
                  <div>
                    <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                      Email
                    </Label>
                    <p className="font-medium text-sm mt-1 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[hsl(var(--admin-text-faint))]" />
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-[hsl(var(--admin-gold))] hover:underline"
                      >
                        {selectedInquiry.email}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {selectedInquiry.service && (
                <div>
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Service Interest
                  </Label>
                  <p className="font-medium text-sm mt-1 text-[hsl(var(--admin-text))]">
                    {selectedInquiry.service}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                  Message
                </Label>
                <p className="p-4 bg-[hsl(var(--admin-surface-2))] rounded-xl text-sm mt-2 leading-relaxed border border-[hsl(var(--admin-border-subtle))] text-[hsl(var(--admin-text-muted))]">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="border-t border-[hsl(var(--admin-border-subtle))] pt-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Update Status
                  </Label>
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
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Notes (internal)
                  </Label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this enquiry..."
                    rows={3}
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--admin-surface-2))] border border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] text-sm placeholder:text-[hsl(var(--admin-text-faint))] focus:outline-none focus:border-[hsl(var(--admin-gold-dim))] focus:ring-1 focus:ring-[hsl(var(--admin-gold)_/_0.15)] transition-all resize-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                  className="h-10 px-5 rounded-xl bg-white border border-[hsl(30_8%_82%)] text-[hsl(25_20%_25%)] text-sm font-medium hover:bg-[hsl(30_10%_96%)] hover:border-[hsl(30_8%_72%)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateInquiry}
                  disabled={saving}
                  className="h-10 px-6 rounded-xl bg-[hsl(38_55%_45%)] hover:bg-[hsl(38_55%_38%)] text-white text-sm font-semibold shadow-md shadow-[hsl(38_55%_45%_/_0.3)] transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
