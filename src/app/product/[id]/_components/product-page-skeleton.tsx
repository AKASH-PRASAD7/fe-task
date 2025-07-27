import { Skeleton } from "@/components/ui/skeleton";

export function ProductPageSkeleton() {
  return (
    <div className="bg-background">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main product grid skeleton */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
              <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
              <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
              <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-4 w-1/3" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-6 w-1/2" />

            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2 pl-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-16">
          <Skeleton className="h-8 w-1/3" />
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4 rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-2/5" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-1/3" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
