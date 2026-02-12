'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, GalleryImageData } from '@/lib/parse';
import { Input } from '@/components/ui/input';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImageUpload } from '@/components/admin/image-upload';
import { Plus, Pencil, Trash2, Loader2, Star, Images } from 'lucide-react';
import Image from 'next/image';

const categories = ['Framed', 'Premium', 'Special'];

export default function GalleryManagementPage() {
  const [images, setImages] = useState<GalleryImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImageData | null>(null);
  const [formData, setFormData] = useState<GalleryImageData>({
    title: '',
    category: 'Framed',
    imagePath: '',
    featured: false,
    order: 0,
  });

  const loadImages = async () => {
    try {
      const data = await parseHelpers.getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await parseHelpers.saveGalleryImage({
        ...formData,
        id: editingImage?.id,
      });

      setDialogOpen(false);
      setEditingImage(null);
      setFormData({
        title: '',
        category: 'Framed',
        imagePath: '',
        featured: false,
        order: 0,
      });
      loadImages();
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (image: GalleryImageData) => {
    setEditingImage(image);
    setFormData(image);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await parseHelpers.deleteGalleryImage(id);
      loadImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const openNewDialog = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      category: 'Framed',
      imagePath: '',
      featured: false,
      order: images.length,
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
            Gallery
          </h1>
          <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
            Add, edit, and organize your gallery images.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              onClick={openNewDialog}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[hsl(38_55%_45%)] hover:bg-[hsl(38_55%_38%)] text-white shadow-md shadow-[hsl(38_55%_45%_/_0.3)] text-sm font-medium transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Image
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-[hsl(var(--admin-text))]">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">Image</Label>
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
                  <Label htmlFor="title" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Newborn Hand & Foot"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">Order</Label>
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
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    disabled={saving}
                    className="h-4 w-4 rounded border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-surface-2))] text-[hsl(var(--admin-gold))] focus:ring-[hsl(var(--admin-gold)_/_0.3)]"
                  />
                  <Label htmlFor="featured" className="cursor-pointer text-sm text-[hsl(var(--admin-text-muted))]">
                    Featured on homepage
                  </Label>
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
                  ) : editingImage ? (
                    'Save Changes'
                  ) : (
                    'Add Image'
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[hsl(var(--admin-border-subtle))]">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--admin-gold)_/_0.1)] flex items-center justify-center">
            <Images className="h-4 w-4 text-[hsl(var(--admin-gold))]" />
          </div>
          <h2 className="text-sm font-medium text-[hsl(var(--admin-text))]">
            All Images ({images.length})
          </h2>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 rounded-xl bg-[hsl(var(--admin-surface-2))] flex items-center justify-center mx-auto mb-3">
              <Images className="h-6 w-6 text-[hsl(var(--admin-text-faint))]" />
            </div>
            <p className="text-sm text-[hsl(var(--admin-text-muted))]">No images in the gallery yet</p>
            <button onClick={openNewDialog} className="text-sm text-[hsl(var(--admin-gold))] hover:underline mt-1">
              Add your first image
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-20">Order</TableHead>
                <TableHead className="w-20">Featured</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="relative h-12 w-16 rounded-lg overflow-hidden ring-1 ring-[hsl(var(--admin-border-subtle))]">
                      <Image
                        src={image.imagePath}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm text-[hsl(var(--admin-text))]">{image.title}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[hsl(var(--admin-surface-3))] text-[hsl(var(--admin-text-muted))]">
                      {image.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--admin-text-muted))]">{image.order}</TableCell>
                  <TableCell>
                    {image.featured && (
                      <Star className="h-4 w-4 text-[hsl(var(--admin-gold))] fill-[hsl(var(--admin-gold))]" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(image)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center border border-transparent text-[hsl(var(--admin-text-muted))] hover:text-[hsl(38_55%_40%)] hover:bg-[hsl(38_55%_45%_/_0.12)] hover:border-[hsl(38_55%_45%_/_0.2)] transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="h-8 w-8 rounded-lg flex items-center justify-center border border-transparent text-[hsl(var(--admin-text-muted))] hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                        onClick={() => handleDelete(image.id!)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
