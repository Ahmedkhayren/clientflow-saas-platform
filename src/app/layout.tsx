import type { Metadata } from "next";
import "./globals.css";
import { WorkspaceProvider } from "@/components/workspace-provider";

export const metadata: Metadata = {
  title: "ClientFlow | Client & Project Management",
  description: "Manage clients, projects, tasks, and deadlines in one organized workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><WorkspaceProvider>{children}</WorkspaceProvider></body></html>;
}
