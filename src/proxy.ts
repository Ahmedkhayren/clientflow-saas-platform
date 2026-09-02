import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/clients", "/projects", "/tasks", "/kanban", "/calendar", "/team", "/reports", "/settings"];
export async function proxy(request: NextRequest) {
  const result = updateSession(request);
  if (result instanceof NextResponse) return result;
  const { supabase, response } = result;
  const path = request.nextUrl.pathname;
  if (protectedPrefixes.some((prefix) => path.startsWith(prefix))) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { const next = request.nextUrl.clone(); next.pathname = "/login"; next.searchParams.set("next", path); return NextResponse.redirect(next); }
  }
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
