import { ClientDetailView } from "@/components/views/core-views";
export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <ClientDetailView id={id}/>; }
