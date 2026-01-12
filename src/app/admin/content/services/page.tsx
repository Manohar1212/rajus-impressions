'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, ServiceData } from '@/lib/parse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/image-upload';
import { Plus, Pencil, Loader2, GripVertical } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage the services displayed on your homepage.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Service Image</Label>
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
                  <Label htmlFor="title">Title</Label>
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
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of the service"
                    disabled={saving}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
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

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      disabled={saving}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="active" className="cursor-pointer">
                      Active (visible on website)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || !formData.imagePath}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingService ? (
                    'Save Changes'
                  ) : (
                    'Add Service'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12 text-muted-foreground">
              <p>No services added yet.</p>
              <Button variant="link" onClick={openNewDialog}>
                Add your first service
              </Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className={!service.active ? 'opacity-60' : ''}>
              <div className="relative aspect-[4/3]">
                <Image
                  src={service.imagePath}
                  alt={service.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                {!service.active && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-gray-800 text-white rounded">
                    Hidden
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {service.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
