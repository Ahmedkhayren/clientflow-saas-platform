"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { makeDemoData } from "@/lib/demo-data";
import { uid } from "@/lib/utils";
import type { Activity, Client, Profile, Project, Task, TaskStatus, WorkspaceData } from "@/types/models";

type Toast = { id: string; message: string; tone?: "success" | "error" };
type CreateClient = Pick<Client, "name" | "company" | "email" | "phone" | "status" | "notes">;
type CreateProject = Pick<Project, "name" | "client_id" | "description" | "status" | "progress" | "start_date" | "due_date">;
type CreateTask = Pick<Task, "title" | "project_id" | "description" | "status" | "priority" | "assignee_id" | "due_date"> & { assignee?: string };
type WorkspaceContextValue = {
  data: WorkspaceData | null; loading: boolean; toasts: Toast[]; configured: boolean;
  enterDemo: () => Promise<{ error?: string }>; signOut: () => Promise<void>; resetDemo: () => Promise<void>;
  addClient: (input: CreateClient) => Promise<void>; updateClient: (id: string, input: Partial<CreateClient>) => Promise<void>; deleteClient: (id: string) => Promise<void>;
  addProject: (input: CreateProject) => Promise<void>; updateProject: (id: string, input: Partial<CreateProject>) => Promise<void>; deleteProject: (id: string) => Promise<void>;
  addTask: (input: CreateTask) => Promise<void>; updateTask: (id: string, input: Partial<CreateTask>) => Promise<void>; deleteTask: (id: string) => Promise<void>; moveTask: (id: string, status: TaskStatus) => Promise<void>;
  updateProfile: (input: Partial<Profile>) => Promise<void>; updateWorkspace: (name: string) => Promise<void>; notify: (message: string, tone?: "success" | "error") => void;
};
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
const storageKey = "clientflow-local-demo-v1";

function localData() { try { const value = localStorage.getItem(storageKey); return value ? JSON.parse(value) as WorkspaceData : null; } catch { return null; } }

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notify = useCallback((message: string, tone: Toast["tone"] = "success") => { const toast = { id: uid(), message, tone }; setToasts((current) => [...current, toast]); window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== toast.id)), 3800); }, []);
  const persist = useCallback((next: WorkspaceData) => { setData(next); if (!isSupabaseConfigured) localStorage.setItem(storageKey, JSON.stringify(next)); }, []);
  const log = useCallback((next: WorkspaceData, action: string, entityType: string, entityId?: string): WorkspaceData => ({ ...next, activities: [{ id: uid(), workspace_id: next.workspace.id, user_id: next.profile.id, user_name: next.profile.full_name, entity_type: entityType, entity_id: entityId, action, created_at: new Date().toISOString() }, ...next.activities].slice(0, 40) }), []);

  const loadRemote = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: userInfo, error: userError } = await supabase.auth.getUser();
      if (userError) { notify("Your workspace could not be loaded.", "error"); return; }
      if (!userInfo.user) return;

      const { data: membership, error: membershipError } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", userInfo.user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (membershipError) { notify("Your workspace could not be loaded.", "error"); return; }

      let workspaceId = membership?.workspace_id;
      if (!workspaceId) {
        const { data: initialized, error: initError } = await supabase.rpc("initialize_workspace");
        if (initError) { notify("We could not prepare your workspace. Please try again.", "error"); return; }
        workspaceId = typeof initialized === "string" ? initialized : initialized?.id;
        if (!workspaceId) { notify("We could not prepare your workspace. Please try again.", "error"); return; }
      }

      const [profileResult, workspaceResult, clientsResult, projectsResult, tasksResult, activityResult, membersResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userInfo.user.id).single(), supabase.from("workspaces").select("*").eq("id", workspaceId).single(), supabase.from("clients").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }), supabase.from("projects").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }), supabase.from("tasks").select("*").eq("workspace_id", workspaceId).order("position"), supabase.from("activity_logs").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(30), supabase.from("workspace_member_details").select("*").eq("workspace_id", workspaceId),
      ]);
      if (profileResult.error || workspaceResult.error || clientsResult.error || projectsResult.error || tasksResult.error || activityResult.error || membersResult.error) { notify("Your workspace could not be loaded.", "error"); return; }

      const profile = { ...(profileResult.data || { id: userInfo.user.id, full_name: userInfo.user.user_metadata?.full_name || "ClientFlow member" }), email: userInfo.user.email, is_anonymous: userInfo.user.is_anonymous } as Profile;
      const memberRows = (membersResult.data || []) as Array<{ id: string; user_id?: string; role: "owner" | "admin" | "member"; workspace_id: string; created_at: string; full_name?: string; avatar_url?: string | null }>;
      const members = memberRows.map((member) => ({ id: member.user_id || member.id, user_id: member.user_id, role: member.role, created_at: member.created_at, email: "team@clientflow.app", name: member.full_name || "Workspace member", avatar: member.full_name?.split(" ").map((n) => n[0]).join("") }));
      const remoteTasks = ((tasksResult.data || []) as Task[]).map((task) => ({ ...task, assignee: members.find((member) => member.id === task.assignee_id)?.name }));
      setData({ workspace: workspaceResult.data as WorkspaceData["workspace"], profile, clients: (clientsResult.data || []) as Client[], projects: (projectsResult.data || []) as Project[], tasks: remoteTasks, activities: (activityResult.data || []) as Activity[], members });
    } catch {
      notify("Your workspace could not be loaded.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void (async () => {
      try {
        if (isSupabaseConfigured) await loadRemote();
        else setData(localData());
      } finally {
        setLoading(false);
      }
    })();
  }, [loadRemote]);

  const enterDemo = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) { const { error } = await createClient().auth.signInAnonymously(); if (error) return { error: "Demo access is unavailable. Enable Anonymous sign-ins in Supabase Auth." }; await loadRemote(); }
      else { const restored = localData(); persist(restored || makeDemoData()); }
      return {};
    } finally { setLoading(false); }
  }, [loadRemote, persist]);
  const signOut = useCallback(async () => { if (isSupabaseConfigured) await createClient().auth.signOut(); localStorage.removeItem(storageKey); setData(null); }, []);
  const resetDemo = useCallback(async () => { if (!data?.workspace.is_demo) return; if (isSupabaseConfigured) { const { error } = await createClient().rpc("reset_demo_workspace"); if (error) { notify("Demo reset failed. Please try again.", "error"); return; } await loadRemote(); } else persist(makeDemoData(data.profile.id, data.profile.full_name)); notify("Demo workspace restored."); }, [data, loadRemote, notify, persist]);
  const saveRemote = useCallback(async <T = never>(table: string, mode: "insert" | "update" | "delete", payload: Record<string, unknown>, id?: string) => {
    if (!isSupabaseConfigured) return;
    const tableApi = createClient().from(table as never) as unknown as { insert: (row: Record<string, unknown>) => { select: () => { single: () => Promise<{ data: unknown; error: unknown }> } }; update: (row: Record<string, unknown>) => { eq: (column: string, value?: string) => { select: () => { single: () => Promise<{ data: unknown; error: unknown }> } } }; delete: () => { eq: (column: string, value?: string) => Promise<{ data: unknown; error: unknown }> } };
    if (table === "profiles" && typeof payload.email === "string" && payload.email) { const { error } = await createClient().auth.updateUser({ email: payload.email }); if (error) throw error; }
    const cleanPayload = table === "tasks" ? Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "assignee")) : table === "profiles" ? Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "email")) : payload;
    const result = mode === "insert" ? await tableApi.insert(cleanPayload).select().single() : mode === "update" ? await tableApi.update(cleanPayload).eq("id", id).select().single() : await tableApi.delete().eq("id", id);
    if (result.error) throw result.error;
    return (table === "profiles" && result.data && typeof result.data === "object" ? { ...(result.data as Record<string, unknown>), email: payload.email } : result.data) as T | undefined;
  }, []);
  const perform = useCallback(async (operation: () => Promise<void>, success: string) => { try { await operation(); notify(success); } catch { notify("That change could not be saved. Please try again.", "error"); } }, [notify]);
  const addClient = (input: CreateClient) => perform(async () => { if (!data) return; const row = { ...input, workspace_id: data.workspace.id }; const saved = await saveRemote("clients", "insert", row); const client = (saved || { ...row, id: uid(), created_at: new Date().toISOString() }) as Client; persist(log({ ...data, clients: [client, ...data.clients] }, `created ${client.name}`, "client", client.id)); }, "Client added to your workspace.");
  const updateClient = (id: string, input: Partial<CreateClient>) => perform(async () => { if (!data) return; const saved = await saveRemote("clients", "update", input, id); const current = data.clients.find((item) => item.id === id); const client = (saved || { ...current, ...input }) as Client; persist(log({ ...data, clients: data.clients.map((item) => item.id === id ? client : item) }, `updated ${client.name}`, "client", id)); }, "Client updated.");
  const deleteClient = (id: string) => perform(async () => { if (!data) return; await saveRemote("clients", "delete", {}, id); persist(log({ ...data, clients: data.clients.filter((item) => item.id !== id) }, "deleted a client", "client", id)); }, "Client deleted.");
  const addProject = (input: CreateProject) => perform(async () => { if (!data) return; const row = { ...input, workspace_id: data.workspace.id, created_by: data.profile.id }; const saved = await saveRemote("projects", "insert", row); const project = (saved || { ...row, id: uid(), created_at: new Date().toISOString() }) as Project; persist(log({ ...data, projects: [project, ...data.projects] }, `created ${project.name}`, "project", project.id)); }, "Project created.");
  const updateProject = (id: string, input: Partial<CreateProject>) => perform(async () => { if (!data) return; const saved = await saveRemote("projects", "update", input, id); const current = data.projects.find((item) => item.id === id); const project = (saved || { ...current, ...input }) as Project; persist(log({ ...data, projects: data.projects.map((item) => item.id === id ? project : item) }, `updated ${project.name}`, "project", id)); }, "Project updated.");
  const deleteProject = (id: string) => perform(async () => { if (!data) return; await saveRemote("projects", "delete", {}, id); persist(log({ ...data, projects: data.projects.filter((item) => item.id !== id), tasks: data.tasks.filter((item) => item.project_id !== id) }, "deleted a project", "project", id)); }, "Project deleted.");
  const addTask = (input: CreateTask) => perform(async () => { if (!data) return; const row = { ...input, workspace_id: data.workspace.id, created_by: data.profile.id, position: data.tasks.length }; const saved = await saveRemote("tasks", "insert", row); const task = (saved || { ...row, id: uid(), created_at: new Date().toISOString() }) as Task; persist(log({ ...data, tasks: [task, ...data.tasks] }, `created ${task.title}`, "task", task.id)); }, "Task created.");
  const updateTask = (id: string, input: Partial<CreateTask>) => perform(async () => { if (!data) return; const saved = await saveRemote("tasks", "update", input, id); const current = data.tasks.find((item) => item.id === id); const task = (saved || { ...current, ...input }) as Task; persist(log({ ...data, tasks: data.tasks.map((item) => item.id === id ? task : item) }, `updated ${task.title}`, "task", id)); }, "Task updated.");
  const deleteTask = (id: string) => perform(async () => { if (!data) return; await saveRemote("tasks", "delete", {}, id); persist(log({ ...data, tasks: data.tasks.filter((item) => item.id !== id) }, "deleted a task", "task", id)); }, "Task deleted.");
  const moveTask = (id: string, status: TaskStatus) => perform(async () => { if (!data) return; const current = data.tasks.find((item) => item.id === id); if (!current || current.status === status) return; const saved = await saveRemote("tasks", "update", { status }, id); const task = (saved || { ...current, status }) as Task; persist(log({ ...data, tasks: data.tasks.map((item) => item.id === id ? task : item) }, `${status === "done" ? "completed" : "moved"} ${task.title}`, "task", id)); }, "Task status updated.");
  const updateProfile = (input: Partial<Profile>) => perform(async () => { if (!data) return; const saved = await saveRemote("profiles", "update", input, data.profile.id); persist({ ...data, profile: (saved || { ...data.profile, ...input }) as Profile }); }, "Profile saved.");
  const updateWorkspace = (name: string) => perform(async () => { if (!data) return; const saved = await saveRemote("workspaces", "update", { name }, data.workspace.id); persist({ ...data, workspace: saved || { ...data.workspace, name } }); }, "Workspace updated.");
  const value = { data, loading, toasts, configured: isSupabaseConfigured, enterDemo, signOut, resetDemo, addClient, updateClient, deleteClient, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask, moveTask, updateProfile, updateWorkspace, notify };
  return <WorkspaceContext.Provider value={value}>{children}<div className="fixed right-4 top-4 z-[100] space-y-2" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className={`rounded-xl border px-4 py-3 text-sm shadow-panel ${toast.tone === "error" ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-white text-[#172033]"}`}>{toast.message}</div>)}</div></WorkspaceContext.Provider>;
}
export function useWorkspace() { const context = useContext(WorkspaceContext); if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider"); return context; }
