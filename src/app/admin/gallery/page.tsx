'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, GalleryImageData } from '@/lib/parse';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/image-upload';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and organize your gallery images.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Image</Label>
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
                    placeholder="e.g., Newborn Hand & Foot"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
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
                  <Label htmlFor="order">Order</Label>
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
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    disabled={saving}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured on homepage
                  </Label>
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
                  ) : editingImage ? (
                    'Save Changes'
                  ) : (
                    'Add Image'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No images in the gallery yet.</p>
              <Button variant="link" onClick={openNewDialog}>
                Add your first image
              </Button>
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
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image
                          src={image.imagePath}
                          alt={image.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{image.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full bg-muted">
                        {image.category}
                      </span>
                    </TableCell>
                    <TableCell>{image.order}</TableCell>
                    <TableCell>
                      {image.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(image)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(image.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
