import { dateOffset, uid } from "@/lib/utils";
import type { Priority, ProjectStatus, TaskStatus, WorkspaceData } from "@/types/models";

const now = new Date().toISOString();

export function makeDemoData(userId = "local-demo", name = "Alex Morgan"): WorkspaceData {
  const workspaceId = `demo-${userId}`;
  const clientSeeds = [
    ["Northstar Studio", "Northstar Studio", "hello@northstar.studio", "active"], ["PixelCraft", "PixelCraft Co.", "team@pixelcraft.co", "active"], ["Atlas Advisory", "Atlas Advisory", "hello@atlasadvisory.com", "active"],
    ["NovaWorks", "NovaWorks", "contact@novaworks.io", "active"], ["Summit Consulting", "Summit Consulting", "hello@summit.co", "active"], ["Oak & Co.", "Oak & Co.", "team@oakandco.com", "inactive"],
  ] as const;
  const clients = clientSeeds.map(([clientName, company, email, status], index) => ({ id: `client-${index + 1}`, workspace_id: workspaceId, name: clientName, company, email, phone: `+1 (415) 555-01${index + 10}`, status: status as "active" | "inactive", notes: index === 0 ? "Primary brand and web partner. Monthly strategy check-in on Thursdays." : null, created_at: now, updated_at: now }));
  const projectSeeds = [
    ["Website Redesign", 0, "in_progress", 68, 9], ["Brand Refresh", 1, "review", 84, 3], ["Client Portal", 2, "planning", 20, 20], ["Marketing Campaign", 3, "in_progress", 51, 14],
    ["Mobile App", 3, "in_progress", 42, 7], ["Operations Dashboard", 4, "completed", 100, -4], ["Content Strategy", 5, "planning", 15, 29], ["CRM Migration", 2, "on_hold", 32, 38],
  ] as const;
  const projects = projectSeeds.map(([projectName, clientIndex, status, progress, offset], index) => ({ id: `project-${index + 1}`, workspace_id: workspaceId, client_id: clients[clientIndex].id, name: projectName, status: status as ProjectStatus, progress, description: `${projectName} delivery plan, milestones, and client collaboration in one focused workspace.`, start_date: dateOffset(-35 + index * 3), due_date: dateOffset(offset), created_by: userId, created_at: now, updated_at: now, owner: index % 2 ? "Sara Khan" : name }));
  const taskSeeds: Array<[string, number, string, string, number, string]> = [
    ["Create wireframes", 0, "in_progress", "high", 2, "Alex Morgan"], ["Review navigation system", 0, "review", "medium", 4, "Sara Khan"], ["Build responsive homepage", 0, "todo", "high", 5, "Alex Morgan"], ["QA desktop breakpoints", 0, "todo", "medium", 7, "Mona Ali"],
    ["Prepare final logo files", 1, "done", "high", -2, "Sara Khan"], ["Collect client feedback", 1, "review", "medium", 1, "Alex Morgan"], ["Update brand guidelines", 1, "done", "low", -7, "Mona Ali"],
    ["Plan onboarding flow", 2, "todo", "urgent", 8, "Alex Morgan"], ["Map account permissions", 2, "in_progress", "high", 11, "Mona Ali"], ["Draft portal architecture", 2, "todo", "medium", 15, "Sara Khan"],
    ["Write campaign concepts", 3, "review", "high", 3, "Mona Ali"], ["Schedule launch assets", 3, "todo", "medium", 10, "Sara Khan"], ["Approve media plan", 3, "done", "medium", -5, "Alex Morgan"],
    ["Design app navigation", 4, "in_progress", "high", 5, "Alex Morgan"], ["Prototype empty states", 4, "todo", "low", 12, "Mona Ali"], ["Test authentication", 4, "review", "urgent", 1, "Sara Khan"], ["Create store screenshots", 4, "todo", "medium", 17, "Alex Morgan"],
    ["Reconcile data fields", 5, "done", "high", -12, "Sara Khan"], ["Document reporting views", 5, "done", "low", -9, "Mona Ali"], ["Validate user flows", 5, "done", "medium", -6, "Alex Morgan"],
    ["Audit content inventory", 6, "todo", "medium", 22, "Mona Ali"], ["Interview stakeholders", 6, "in_progress", "high", 17, "Alex Morgan"], ["Create migration checklist", 7, "todo", "high", 30, "Sara Khan"], ["Import test records", 7, "todo", "medium", 34, "Mona Ali"], ["Confirm cutover plan", 7, "review", "urgent", 26, "Alex Morgan"],
  ];
  const tasks = taskSeeds.map(([title, projectIndex, status, priority, offset, assignee], index) => ({ id: `task-${index + 1}`, workspace_id: workspaceId, project_id: projects[projectIndex].id, title, description: `A focused action item for the ${projects[projectIndex].name} project.`, status: status as TaskStatus, priority: priority as Priority, assignee_id: `member-${assignee.toLowerCase().replace(" ", "-")}`, assignee, due_date: dateOffset(offset), position: index, created_by: userId, created_at: now, updated_at: now }));
  const members = [
    { id: "member-alex-morgan", user_id: userId, name, email: "alex@clientflow.app", role: "owner" as const, created_at: now, avatar: "AM" }, { id: "member-sara-khan", name: "Sara Khan", email: "sara@clientflow.app", role: "admin" as const, created_at: now, avatar: "SK" },
    { id: "member-mona-ali", name: "Mona Ali", email: "mona@clientflow.app", role: "member" as const, created_at: now, avatar: "MA" }, { id: "member-fatima-noor", name: "Fatima Noor", email: "fatima@clientflow.app", role: "member" as const, created_at: now, avatar: "FN" },
  ];
  return { workspace: { id: workspaceId, name: "ClientFlow Studio", owner_id: userId, is_demo: true, created_at: now }, profile: { id: userId, full_name: name, email: "alex@clientflow.app", timezone: "Africa/Mogadishu", is_anonymous: true }, clients, projects, tasks, members, activities: [
    { id: uid(), workspace_id: workspaceId, entity_type: "task", action: "completed Prepare final logo files", created_at: new Date(Date.now() - 1000 * 60 * 38).toISOString(), user_name: "Sara Khan" }, { id: uid(), workspace_id: workspaceId, entity_type: "project", action: "updated Website Redesign", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), user_name: name }, { id: uid(), workspace_id: workspaceId, entity_type: "client", action: "created NovaWorks", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user_name: "Mona Ali" },
  ] };
}
