import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Layers3,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { DemoAccessButton } from "@/components/auth-actions";

const benefits: Array<[LucideIcon, string, string]> = [
  [UsersRound, "Client visibility", "Keep client details, projects, and conversations connected."],
  [FolderKanban, "Project control", "Track progress, responsibilities, and deadlines in one place."],
  [CircleCheck, "Clear ownership", "Make it obvious who is responsible for what."],
  [CalendarDays, "Better follow-through", "Keep upcoming work visible before deadlines become urgent."],
];

const steps = [
  ["01", "Add a client", "Capture the contacts and context behind the work."],
  ["02", "Create a project", "Set a clear scope, timeline, and delivery status."],
  ["03", "Assign tasks", "Turn the work into small, owned next actions."],
  ["04", "Track progress", "See priorities and deadlines before they slip."],
] as const;

const navItems = [
  ["Product", "#product"],
  ["Solutions", "#solutions"],
  ["How it works", "#workflow"],
  ["Pricing", "#pricing"],
  ["About", "#about"],
] as const;

export default function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#FAF9F6] text-[#172033]">
      <header className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <span className="sm:hidden"><Brand compact /></span>
        <span className="hidden sm:inline"><Brand /></span>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#697068] md:flex" aria-label="Marketing navigation">
          {navItems.map(([label, href]) => <a key={href} href={href} className="focus-ring rounded hover:text-[#355C45]">{label}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="focus-ring hidden rounded text-sm font-semibold text-[#475467] hover:text-[#355C45] sm:inline">Sign in</Link>
          <DemoAccessButton className="shrink-0 whitespace-nowrap px-3 py-2 text-[11px] sm:px-4 sm:text-sm" />
        </div>
      </header>

      <section className="app-grid relative border-y border-[#E3E5DF] px-5 py-12 sm:py-16 lg:py-20">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.86fr_1.14fr] lg:gap-10 lg:px-8">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#DDE5D8] bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#355C45]">
              <span className="size-1.5 rounded-full bg-[#3F7A53]" />
              All-in-one workspace
            </span>
            <h1 className="mt-6 max-w-lg text-[42px] font-bold leading-[.99] tracking-[-.065em] text-[#172033] sm:text-6xl lg:text-[68px]">
              Work flows. <span className="text-[#355C45]">Clients thrive.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#697068] sm:text-[17px]">
              Manage clients, projects, tasks, and deadlines in one beautiful, easy-to-use platform—built to keep your business moving forward.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoAccessButton className="w-full sm:w-auto" />
              <a href="#workflow" className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E3E5DF] bg-white px-5 text-sm font-semibold text-[#172033] transition hover:bg-[#EEF2EA] sm:w-auto">
                See How It Works <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section id="solutions" className="border-b border-[#E3E5DF] bg-white px-5 py-10 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {benefits.map(([Icon, title, copy], index) => (
            <article key={title} className="border-[#E3E5DF] lg:border-l lg:pl-6 first:border-l-0 first:pl-0">
              <span className="grid size-9 place-items-center rounded-lg bg-[#EEF2EA] text-[#355C45]"><Icon size={18} /></span>
              <h2 className="mt-4 font-bold tracking-[-.02em]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#697068]">{copy}</p>
              {index === 3 ? null : null}
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#355C45]">A better rhythm</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-.05em] sm:text-4xl">From new client to finished project.</h2>
          <p className="mt-4 text-base leading-7 text-[#697068]">A simple connected workflow makes it easy to see what matters now without losing the context behind the work.</p>
        </div>
        <div className="relative mt-12 grid gap-7 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#DDE5D8] md:block" />
          {steps.map(([number, title, copy]) => (
            <article className="relative" key={number}>
              <span className="relative grid size-14 place-items-center rounded-2xl border border-[#DDE5D8] bg-white text-sm font-bold text-[#355C45] shadow-soft">{number}</span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#697068]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="product" className="border-y border-[#E3E5DF] bg-white px-5 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-20 lg:space-y-28">
          <FeatureClients />
          <FeatureProjects />
          <FeatureKanban />
          <FeatureCalendar />
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#355C45]">Simple pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-.05em] sm:text-4xl">Plans that grow with your work.</h2>
          <p className="mt-3 text-sm text-[#697068]">Choose a plan when you’re ready. No billing is required to explore the demo.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <PricingCard title="Starter" price="$12" copy="For independent freelancers" items={["Up to 3 members", "Client & project tracking", "Task management"]} />
          <PricingCard featured title="Professional" price="$29" copy="For growing service teams" items={["Up to 10 members", "Calendar & reports", "Priority support"]} />
          <PricingCard title="Team" price="$59" copy="For agencies with momentum" items={["Unlimited members", "Advanced permissions", "Dedicated workspace support"]} />
        </div>
      </section>

      <section className="mx-5 mb-16 rounded-3xl bg-[#294737] px-6 py-14 text-center text-white sm:px-12 lg:mx-auto lg:max-w-7xl lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#DDE5D8]">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-[-.05em] sm:text-5xl">See ClientFlow in action.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#DDE5D8]">Open a ready-to-use workspace with sample clients, projects, and tasks.</p>
        <DemoAccessButton className="mt-7 !bg-white !text-[#294737] hover:!bg-[#DDE5D8] hover:!text-[#172033]" />
      </section>

      <footer id="about" className="border-t border-[#E3E5DF] bg-white px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div><Brand /><p className="mt-4 max-w-xs text-sm leading-6 text-[#697068]">A focused workspace for service teams doing their best client work.</p></div>
          <FooterColumn title="Product" links={["Features", "Demo", "Pricing"]} />
          <FooterColumn title="Solutions" links={["Freelancers", "Agencies", "Consultants", "Service teams"]} />
          <FooterColumn title="Company" links={["About", "Contact"]} />
          <div><h3 className="text-sm font-bold">Account</h3><div className="mt-4 space-y-2.5"><Link href="/login" className="focus-ring block rounded text-sm text-[#697068] hover:text-[#355C45]">Sign in</Link><Link href="/signup" className="focus-ring block rounded text-sm text-[#697068] hover:text-[#355C45]">Create account</Link></div></div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-[#E3E5DF] pt-6 text-xs text-[#98a2b3]">© 2026 ClientFlow. All rights reserved.</div>
      </footer>
    </main>
  );
}

function ProductPreview() {
  const nav = [[LayoutDashboard, "Dashboard", true], [UsersRound, "Clients", false], [FolderKanban, "Projects", false], [ClipboardList, "Tasks", false], [CalendarDays, "Calendar", false]] as const;
  return (
    <div className="relative mx-auto w-full max-w-[720px] lg:ml-auto">
      <div aria-hidden className="absolute -right-8 -top-12 size-[min(38vw,380px)] rounded-tl-[10rem] rounded-tr-[10rem] rounded-bl-[10rem] bg-[#DDE5D8]/80 sm:-right-12 sm:-top-16" />
      <div aria-hidden className="absolute right-2 top-2 size-[min(29vw,290px)] rounded-full bg-[#EEF2EA]" />
      <div className="relative rounded-2xl border-[5px] border-[#172033] bg-[#172033] p-1.5 shadow-[0_28px_65px_rgba(23,32,51,.2)] sm:rounded-[22px]">
        <div className="overflow-hidden rounded-xl bg-[#F7F8F5]">
          <div className="flex h-9 items-center border-b border-[#E3E5DF] bg-white px-3">
            <div className="flex gap-1"><i className="size-2 rounded-full bg-[#C95454]/65" /><i className="size-2 rounded-full bg-[#D69035]/65" /><i className="size-2 rounded-full bg-[#3F7A53]/65" /></div>
            <div className="mx-auto flex w-1/2 justify-center rounded bg-[#F7F8F5] py-1 text-[7px] text-[#98a2b3]">app.clientflow.work/dashboard</div>
          </div>
          <div className="flex min-h-[330px] sm:min-h-[410px]">
            <aside className="hidden w-32 shrink-0 border-r border-[#E3E5DF] bg-white p-3 sm:block">
              <div className="flex items-center gap-1.5 text-[9px] font-bold"><span className="grid size-4 place-items-center rounded bg-[#355C45] text-white"><Layers3 size={9} /></span>ClientFlow</div>
              <div className="mt-6 space-y-1.5">{nav.map(([Icon, label, active]) => <div key={label} className={`flex items-center gap-2 rounded px-2 py-1.5 text-[8px] ${active ? "bg-[#EEF2EA] font-bold text-[#294737]" : "text-[#7d8491]"}`}><Icon size={10} />{label}</div>)}</div>
            </aside>
            <div className="min-w-0 flex-1 p-3 sm:p-5">
              <div className="flex items-center justify-between"><div><p className="text-[8px] text-[#697068]">Wednesday, May 28</p><h3 className="mt-1 text-sm font-bold sm:text-lg">Welcome back, Alex</h3></div><span className="grid size-7 place-items-center rounded-full bg-[#355C45] text-[8px] font-bold text-white">AM</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[["6", "Clients"], ["5", "Active projects"], ["12", "In progress"], ["18", "Completed"]].map(([number, label]) => <div key={label} className="rounded-lg border border-[#E3E5DF] bg-white p-2 sm:p-2.5"><span className="grid size-4 place-items-center rounded bg-[#EEF2EA]"><span className="size-1.5 rounded-full bg-[#355C45]" /></span><p className="mt-1.5 text-sm font-bold sm:text-lg">{number}</p><p className="text-[7px] text-[#697068]">{label}</p></div>)}</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-lg border border-[#E3E5DF] bg-white p-3"><div className="flex items-center justify-between"><p className="text-[9px] font-bold">Project progress</p><span className="text-[7px] font-semibold text-[#355C45]">View all</span></div><div className="mt-4 flex h-20 items-end gap-1.5">{[35, 50, 43, 67, 58, 79, 93].map((height, index) => <span key={index} className="flex-1 rounded-t-sm bg-[#EEF2EA]" style={{ height: `${height}%` }}><i className="mx-auto block h-full max-w-[6px] rounded-t-sm bg-[#355C45]" /></span>)}</div></div>
                <div className="rounded-lg border border-[#E3E5DF] bg-white p-3"><p className="text-[9px] font-bold">Upcoming deadlines</p><div className="mt-3 space-y-2">{[["Brand review", "May 29"], ["Mobile screens", "Jun 02"], ["Portal scope", "Jun 05"]].map(([name, date]) => <div key={name} className="flex items-center justify-between text-[7px]"><span className="font-medium">{name}</span><span className="text-[#697068]">{date}</span></div>)}</div></div>
              </div>
              <div className="mt-2 rounded-lg border border-[#E3E5DF] bg-white p-2.5"><div className="flex items-center justify-between"><p className="text-[9px] font-bold">My tasks</p><span className="text-[7px] text-[#355C45]">View all</span></div><div className="mt-2 grid gap-1 sm:grid-cols-3">{["Create wireframes", "Review app flow", "Prepare launch plan"].map((task, index) => <div className="flex items-center gap-1.5 rounded bg-[#FAF9F6] p-1.5 text-[7px]" key={task}><span className={`size-1.5 rounded-full ${index === 0 ? "border border-[#355C45]" : "bg-[#3F7A53]"}`} />{task}</div>)}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 hidden w-[115px] rounded-[20px] border-[4px] border-[#172033] bg-white p-2 shadow-panel sm:block lg:-right-7"><div className="flex items-center justify-between"><span className="grid size-4 place-items-center rounded bg-[#355C45] text-white"><Layers3 size={8} /></span><span className="size-3 rounded-full bg-[#EEF2EA]" /></div><p className="mt-3 text-[8px] font-bold">Today&apos;s work</p><div className="mt-2 space-y-1.5">{["Wireframes", "App review", "Launch plan"].map((task) => <div key={task} className="rounded bg-[#F7F8F5] p-1.5 text-[6px]"><span className="mr-1 inline-block size-1.5 rounded-full bg-[#3F7A53]" />{task}</div>)}</div></div>
    </div>
  );
}

function FeatureClients() {
  return <FeatureBlock eyebrow="Clients" title="Keep every client relationship organized." copy="Bring contacts, context, related projects, and current work into one clear client record." href="/clients" link="Explore clients" preview={<ClientListPreview />} />;
}

function FeatureProjects() {
  return <FeatureBlock reverse eyebrow="Projects" title="See project status without chasing updates." copy="Progress, responsibilities, project health, and client context stay visible in a single calm view." href="/projects" link="Explore projects" preview={<ProjectPreview />} />;
}

function FeatureKanban() {
  return <FeatureBlock eyebrow="Kanban" title="Move work from idea to done." copy="A flexible board gives every task a home — and makes bottlenecks obvious at a glance." href="/kanban" link="Explore Kanban" preview={<KanbanPreview />} />;
}

function FeatureCalendar() {
  return <FeatureBlock reverse eyebrow="Calendar" title="Know what’s coming next." copy="See task and project deadlines in one visual timeline so nothing urgent gets lost in the daily shuffle." href="/calendar" link="Explore calendar" preview={<CalendarPreview />} />;
}

function FeatureBlock({ eyebrow, title, copy, href, link, preview, reverse = false }: { eyebrow: string; title: string; copy: string; href: string; link: string; preview: ReactNode; reverse?: boolean }) {
  return <div className="grid items-center gap-10 lg:grid-cols-2"><div className={reverse ? "order-2 lg:order-1" : ""}>{preview}</div><div className={reverse ? "order-1 lg:order-2" : ""}><p className="text-xs font-bold uppercase tracking-[.15em] text-[#355C45]">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold tracking-[-.05em] sm:text-4xl">{title}</h2><p className="mt-4 max-w-lg text-base leading-7 text-[#697068]">{copy}</p><Link href={href} className="focus-ring mt-6 inline-flex items-center gap-1 rounded text-sm font-bold text-[#355C45]">{link} <ChevronRight size={16} /></Link></div></div>;
}

function ClientListPreview() { return <PreviewFrame title="Clients" subtitle="People and companies you work with"><div className="divide-y divide-[#EEF2EA]">{[["Northstar Studio", "3 projects"], ["PixelCraft", "2 projects"], ["Atlas Advisory", "4 projects"], ["NovaWorks", "2 projects"]].map(([name, projects]) => <div className="flex items-center gap-3 py-3" key={name}><span className="grid size-7 place-items-center rounded-full bg-[#EEF2EA] text-[8px] font-bold text-[#355C45]">{name.slice(0, 2).toUpperCase()}</span><div className="flex-1"><p className="text-[11px] font-semibold">{name}</p><p className="text-[9px] text-[#697068]">hello@{name.toLowerCase().replaceAll(" ", "")}.co</p></div><span className="text-[9px] text-[#697068]">{projects}</span><span className="rounded bg-[#eaf4ec] px-1.5 py-1 text-[8px] font-bold text-[#3F7A53]">Active</span></div>)}</div></PreviewFrame>; }
function ProjectPreview() { return <PreviewFrame title="Projects" subtitle="Delivery at a glance"><div className="mt-5 space-y-4">{[["Website Redesign", 68, "In progress"], ["Brand Refresh", 84, "Review"], ["Mobile App", 42, "In progress"], ["Operations Dashboard", 100, "Complete"]].map(([name, progress, status]) => <div key={name as string}><div className="flex items-center justify-between text-[10px]"><span className="font-semibold">{name}</span><span className="text-[#697068]">{status}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF2EA]"><div className="h-full rounded-full bg-[#355C45]" style={{ width: `${progress}%` }} /></div></div>)}</div></PreviewFrame>; }
function KanbanPreview() { return <div className="overflow-hidden rounded-2xl border border-[#E3E5DF] bg-[#FAF9F6] p-4 shadow-soft"><div className="grid min-w-[480px] grid-cols-4 gap-2">{[["To do", ["Build homepage", "QA breakpoints"]], ["In progress", ["Create wireframes", "Design navigation"]], ["Review", ["Brand review", "Test auth"]], ["Done", ["Final logo files"]]].map(([title, cards], column) => <div key={title as string} className="rounded-lg bg-[#EEF2EA]/70 p-2"><p className="mb-2 text-[9px] font-bold">{title}</p>{(cards as string[]).map((card, index) => <div key={card} className="mb-2 rounded-md border border-[#E3E5DF] bg-white p-2 shadow-sm"><p className="text-[9px] font-semibold">{card}</p><div className="mt-3 flex justify-between"><span className={`rounded px-1 py-0.5 text-[7px] ${index === 0 ? "bg-[#fff4e5] text-[#b76c16]" : "bg-[#EEF2EA] text-[#294737]"}`}>{index === 0 ? "High" : "Medium"}</span><span className="text-[7px] text-[#98a2b3]">May {22 + column}</span></div></div>)}</div>)}</div></div>; }
function CalendarPreview() { return <PreviewFrame title="May 2026" subtitle=""><div className="mt-4 grid grid-cols-7 gap-1 text-center text-[8px]">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`} className="py-1 text-[#98a2b3]">{day}</span>)}{Array.from({ length: 35 }, (_, index) => <div className={`h-8 rounded p-1 text-left ${[12, 18, 25, 29].includes(index) ? "bg-[#EEF2EA] text-[#294737]" : ""}`} key={index}><span>{index > 2 ? index - 2 : ""}</span>{[12, 18, 25, 29].includes(index) && <i className="mt-1 block h-1 rounded bg-[#355C45]" />}</div>)}</div></PreviewFrame>; }

function PreviewFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <div className="rounded-2xl border border-[#E3E5DF] bg-[#FAF9F6] p-4 shadow-soft"><div className="rounded-xl border border-[#E3E5DF] bg-white p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-bold">{title}</p>{subtitle && <p className="mt-1 text-[10px] text-[#697068]">{subtitle}</p>}</div><span className="rounded bg-[#355C45] px-2 py-1.5 text-[9px] font-bold text-white">View all</span></div>{children}</div></div>; }

function PricingCard({ title, price, copy, items, featured = false }: { title: string; price: string; copy: string; items: string[]; featured?: boolean }) { return <article className={`rounded-2xl border p-6 ${featured ? "border-[#355C45] bg-[#FAF9F6] shadow-panel" : "border-[#E3E5DF] bg-white"}`}><p className="font-bold">{title}</p><p className="mt-4 text-4xl font-bold tracking-[-.06em]">{price}<span className="text-sm font-medium text-[#697068]"> / month</span></p><p className="mt-3 text-sm text-[#697068]">{copy}</p><ul className="mt-6 space-y-3 text-sm text-[#475467]">{items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="shrink-0 text-[#3F7A53]" />{item}</li>)}</ul><button className={`mt-7 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${featured ? "bg-[#355C45] text-white" : "border border-[#E3E5DF] bg-white text-[#172033]"}`}>Coming soon</button></article>; }
function FooterColumn({ title, links }: { title: string; links: string[] }) { return <div><h3 className="text-sm font-bold">{title}</h3><div className="mt-4 space-y-2.5">{links.map((item) => <a key={item} href="#product" className="focus-ring block rounded text-sm text-[#697068] hover:text-[#355C45]">{item}</a>)}</div></div>; }
