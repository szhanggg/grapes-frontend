import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function ClassCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-16 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </CardContent>
    </Card>
  );
}
