import Link from "next/link";
import { Brand } from "@/components/brand";
import { AuthCard } from "@/components/auth-actions";
export default function LoginPage() { return <main className="app-grid min-h-screen px-4 py-6 sm:p-8"><header className="mx-auto flex max-w-6xl justify-between"><Brand/><Link href="/" className="text-sm font-semibold text-[#697068]">← Back to home</Link></header><div className="mx-auto grid max-w-6xl place-items-center py-12 lg:min-h-[calc(100vh-100px)] lg:py-0"><AuthCard mode="login"/></div></main>; }
