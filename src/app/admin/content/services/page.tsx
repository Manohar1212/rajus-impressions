'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, ServiceData } from '@/lib/parse';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/image-upload';
import { Plus, Pencil, Loader2, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function ServicesManagementPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [formData, setFormData] = useState<ServiceData>({
    title: '',
    description: '',
    imagePath: '',
    order: 0,
    active: true,
  });

  const loadServices = async () => {
    try {
      const data = await parseHelpers.getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await parseHelpers.saveService({
        ...formData,
        id: editingService?.id,
      });

      setDialogOpen(false);
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        imagePath: '',
        order: 0,
        active: true,
      });
      loadServices();
    } catch (error) {
      console.error('Failed to save service:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: ServiceData) => {
    setEditingService(service);
    setFormData(service);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      imagePath: '',
      order: services.length,
      active: true,
    });
    setDialogOpen(true);
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
            Services
          </h1>
          <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
            Manage the services displayed on your homepage.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              onClick={openNewDialog}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[hsl(38_55%_45%)] hover:bg-[hsl(38_55%_38%)] text-white shadow-md shadow-[hsl(38_55%_45%_/_0.3)] text-sm font-medium transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-[hsl(var(--admin-text))]">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Service Image
                  </Label>
                  <div className="mt-2">
                    <ImageUpload
                      value={formData.imagePath}
                      onChange={(value) =>
                        setFormData({ ...formData, imagePath: value })
                      }
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Hand Impressions"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Description (optional)
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of the service"
                    disabled={saving}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--admin-surface-2))] border border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] text-sm placeholder:text-[hsl(var(--admin-text-faint))] focus:outline-none focus:border-[hsl(var(--admin-gold-dim))] focus:ring-1 focus:ring-[hsl(var(--admin-gold)_/_0.15)] transition-all resize-none disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                      Display Order
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value) })
                      }
                      min={0}
                      disabled={saving}
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      disabled={saving}
                      className="h-4 w-4 rounded border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-surface-2))] text-[hsl(var(--admin-gold))] focus:ring-[hsl(var(--admin-gold)_/_0.3)]"
                    />
                    <Label htmlFor="active" className="cursor-pointer text-sm text-[hsl(var(--admin-text-muted))]">
                      Active (visible on website)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(var(--admin-border-subtle))]">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                  className="h-10 px-5 rounded-xl bg-white border border-[hsl(30_8%_82%)] text-[hsl(25_20%_25%)] text-sm font-medium hover:bg-[hsl(30_10%_96%)] hover:border-[hsl(30_8%_72%)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.imagePath}
                  className="h-10 px-6 rounded-xl bg-[hsl(38_55%_45%)] hover:bg-[hsl(38_55%_38%)] text-white shadow-md shadow-[hsl(38_55%_45%_/_0.3)] text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingService ? (
                    'Save Changes'
                  ) : (
                    'Add Service'
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-full admin-card p-16 text-center">
            <p className="text-sm text-[hsl(var(--admin-text-muted))]">No services added yet</p>
            <button onClick={openNewDialog} className="text-sm text-[hsl(var(--admin-gold))] hover:underline mt-1">
              Add your first service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className={`admin-card overflow-hidden group ${!service.active ? 'opacity-60' : ''}`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={service.imagePath}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {!service.active && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-black/70 text-white/80 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                    <EyeOff className="h-3 w-3" />
                    Hidden
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-[hsl(var(--admin-text))]">
                    {service.title}
                  </h3>
                  <button
                    onClick={() => handleEdit(service)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center border border-transparent text-[hsl(var(--admin-text-muted))] hover:text-[hsl(38_55%_40%)] hover:bg-[hsl(38_55%_45%_/_0.12)] hover:border-[hsl(38_55%_45%_/_0.2)] transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
                {service.description && (
                  <p className="text-sm text-[hsl(var(--admin-text-faint))] line-clamp-2 leading-relaxed mt-2">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
