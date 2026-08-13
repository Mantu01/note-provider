import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NoteCardSkeleton() {
  return <Card className="overflow-hidden rounded-2xl border py-0"><Skeleton className="aspect-[16/9] rounded-none" /><CardContent className="space-y-4 py-4"><div className="flex gap-2"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-20" /></div><Skeleton className="h-6 w-4/5" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/5" /><Skeleton className="h-6 w-16" /></CardContent></Card>;
}
