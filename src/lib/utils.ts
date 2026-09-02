export function cn(...values: Array<string | false | null | undefined>) { return values.filter(Boolean).join(" "); }
export const humanize = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export const initials = (name = "ClientFlow") => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
export const uid = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
export const formatDate = (date?: string | null, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) => { if (!date) return "—"; const value = new Date(date.length === 10 ? `${date}T12:00:00` : date); return Number.isNaN(value.getTime()) ? "—" : new Intl.DateTimeFormat("en-US", options).format(value); };
export const dateOffset = (offset: number) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
