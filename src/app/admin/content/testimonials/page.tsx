'use client';

import { useEffect, useState } from 'react';
import { parseHelpers, TestimonialData } from '@/lib/parse';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Star, MapPin, EyeOff, Quote } from 'lucide-react';

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialData | null>(null);
  const [formData, setFormData] = useState<TestimonialData>({
    name: '',
    location: '',
    message: '',
    rating: 5,
    active: true,
    order: 0,
  });

  const loadTestimonials = async () => {
    try {
      const data = await parseHelpers.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await parseHelpers.saveTestimonial({
        ...formData,
        id: editingTestimonial?.id,
      });

      setDialogOpen(false);
      setEditingTestimonial(null);
      setFormData({
        name: '',
        location: '',
        message: '',
        rating: 5,
        active: true,
        order: 0,
      });
      loadTestimonials();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial: TestimonialData) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await parseHelpers.deleteTestimonial(id);
      loadTestimonials();
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  const openNewDialog = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      location: '',
      message: '',
      rating: 5,
      active: true,
      order: testimonials.length,
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
            Testimonials
          </h1>
          <p className="text-sm text-[hsl(var(--admin-text-faint))] mt-1">
            Manage customer testimonials displayed on your website.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              onClick={openNewDialog}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[hsl(38_55%_45%)] hover:bg-[hsl(38_55%_38%)] text-white shadow-md shadow-[hsl(38_55%_45%_/_0.3)] text-sm font-medium transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Testimonial
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-[hsl(var(--admin-text))]">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Customer Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Priya & Rajesh"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Kakinada"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                  Testimonial Message
                </Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="What did the customer say about your service?"
                  required
                  disabled={saving}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--admin-surface-2))] border border-[hsl(var(--admin-border))] text-[hsl(var(--admin-text))] text-sm placeholder:text-[hsl(var(--admin-text-faint))] focus:outline-none focus:border-[hsl(var(--admin-gold-dim))] focus:ring-1 focus:ring-[hsl(var(--admin-gold)_/_0.15)] transition-all resize-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-[10px] tracking-[0.15em] uppercase text-[hsl(var(--admin-text-faint))]">
                    Rating
                  </Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        disabled={saving}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            star <= formData.rating
                              ? 'text-[hsl(var(--admin-gold))] fill-[hsl(var(--admin-gold))]'
                              : 'text-[hsl(var(--admin-border))]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

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
              </div>

              <div className="flex items-center space-x-3">
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
                  disabled={saving}
                  className="h-10 px-6 rounded-xl bg-[hsl(38_55%_45%)] hover:bg-[hsl(38_55%_38%)] text-white shadow-md shadow-[hsl(38_55%_45%_/_0.3)] text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingTestimonial ? (
                    'Save Changes'
                  ) : (
                    'Add Testimonial'
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.length === 0 ? (
          <div className="col-span-full admin-card p-16 text-center">
            <p className="text-sm text-[hsl(var(--admin-text-muted))]">No testimonials added yet</p>
            <button onClick={openNewDialog} className="text-sm text-[hsl(var(--admin-gold))] hover:underline mt-1">
              Add your first testimonial
            </button>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`admin-card overflow-hidden relative ${!testimonial.active ? 'opacity-60' : ''}`}
            >
              {/* Gold accent shimmer line */}
              <div className="admin-gold-line" />

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--admin-rose-dim))] flex items-center justify-center text-[hsl(var(--admin-gold))] font-semibold text-sm">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-[hsl(var(--admin-text))]">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-[hsl(var(--admin-text-faint))] mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center border border-transparent text-[hsl(var(--admin-text-muted))] hover:text-[hsl(38_55%_40%)] hover:bg-[hsl(38_55%_45%_/_0.12)] hover:border-[hsl(38_55%_45%_/_0.2)] transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="h-8 w-8 rounded-lg flex items-center justify-center border border-transparent text-[hsl(var(--admin-text-muted))] hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                      onClick={() => handleDelete(testimonial.id!)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 mt-4 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= testimonial.rating
                          ? 'text-[hsl(var(--admin-gold))] fill-[hsl(var(--admin-gold))]'
                          : 'text-[hsl(var(--admin-border))]'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-[hsl(var(--admin-text-muted))] italic leading-relaxed">
                  &ldquo;{testimonial.message}&rdquo;
                </p>

                {!testimonial.active && (
                  <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[hsl(var(--admin-surface-3))] text-[hsl(var(--admin-text-faint))] rounded-full">
                    <EyeOff className="h-3 w-3" />
                    Hidden
                  </span>
                )}

                {/* Decorative quote */}
                <div className="absolute top-4 right-4 text-[hsl(var(--admin-gold)_/_0.04)] pointer-events-none select-none">
                  <Quote className="h-16 w-16" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
