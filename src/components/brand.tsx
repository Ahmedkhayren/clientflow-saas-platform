import Link from "next/link";
import { Layers3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return <Link href="/" className={cn("focus-ring inline-flex items-center gap-2 rounded-lg", className)} aria-label="ClientFlow home"><span className="grid size-8 place-items-center rounded-[9px] bg-[#355C45] text-white shadow-sm"><Layers3 size={16} strokeWidth={2.7} /></span>{!compact && <span className="text-[17px] font-bold tracking-[-.04em] text-[#172033]">ClientFlow</span>}</Link>;
}
