import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 text-center px-4 space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </section>

      {/* Services Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview Skeleton */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
