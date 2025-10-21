const { useState, useEffect, useMemo } = React;

// ---------- Utils ----------
const DEFAULT_FOLDERS = ["01_Assets", "02_Mixes", "03_Masters", "04_Deliverables", "05_Invoices"];
const uid = () => Math.random().toString(36).slice(2, 9);

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

// ---------- Demo Data ----------
const seedClient = {
  id: uid(),
  name: "Queen Destiny",
  email: "queen@example.com",
  projectType: "Mix & Master",
  budget: 1500,
  notes: "3-song EP; live drums + BGVs",
  status: "active",
};

const seedTasks = [
  { id: uid(), title: "Review brief & references", status: "In Progress" },
  { id: uid(), title: "Collect stems & session files", status: "Waiting for Files" },
  { id: uid(), title: "Send invoice #1001", status: "Pending Payment" },
];

const TASK_TEMPLATES = {
  "Mix Only": ["Collect stems", "Create session", "First pass mix", "Client notes round"],
  "Master Only": ["Prep mix for mastering", "Loudness pass", "Final WAV/MP3 deliverables"],
  "Mix & Master": ["Collect stems", "Session setup", "Mix pass 1", "Revisions", "Mastering", "Final delivery"],
};

// ---------- Small UI bits ----------
const Pill = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-white/20 text-white/90 border border-white/30">{children}</span>
);

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="px-4 py-3 border-b">
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ---------- Sections ----------
function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/15 grid place-items-center">
          <span className="font-bold">🏀</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Alioop.ai</h1>
        <span className="ml-1 text-xs bg-white text-indigo-700 rounded-full px-2 py-1 font-semibold">MVP Demo</span>
      </div>
      <p className="mt-3 text-sm md:text-base max-w-3xl text-white/90">
        The AI-powered productivity platform for creatives. Like an alley-oop, <b>Ali</b> is the perfect assist—
        handling clients, projects, payments, and tasks so you can stay in your creative flow.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill>Client CRM</Pill>
        <Pill>Auto Folders</Pill>
        <Pill>Invoices</Pill>
        <Pill>Kanban</Pill>
        <Pill>AI Assistant (later)</Pill>
      </div>
    </div>
  );
}

function ProblemSolution() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <SectionCard title="Problem" subtitle="Scattered tools. Missed payments. Lost files.">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Clients & leads tracked across email and DMs</li>
          <li>Session scheduling and file delivery are manual</li>
          <li>Invoicing and payment follow-ups slip through</li>
          <li>Notes, revisions, and folder chaos</li>
        </ul>
      </SectionCard>
      <SectionCard title="Solution" subtitle="Ali automates the uncreative work.">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Unified CRM for clients, leads, and projects</li>
          <li>Auto-created folder structures in Drive/Dropbox</li>
          <li>Invoice templates, tracking, & reminders</li>
          <li>Kanban view of progress and status</li>
        </ul>
      </SectionCard>
    </div>
  );
}

function FeatureGrid() {
  const features = [
    { title: "Client Intake", desc: "Branded form that auto-creates CRM + projects" },
    { title: "Auto Folders", desc: "Scaffold: Assets / Mixes / Masters / Deliverables" },
    { title: "Invoices", desc: "Prefilled docs + reminders + status tracking" },
    { title: "Kanban Board", desc: "Stages: In Progress, Waiting for Files, Paid" },
    { title: "Follow-ups (Later)", desc: "Ali drafts emails, summarizes briefs, suggests next steps" },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {features.map(({ title, desc }) => (
        <div key={title} className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-4">
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-gray-500">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function IntakeAndFolders({ clients, setClients, setFolders }) {
  const [form, setForm] = useState({ name: "", email: "", projectType: "Mix & Master", budget: "", notes: "" });
  const [autoTasks, setAutoTasks] = useState(true);

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newClient = {
      id: uid(),
      name: form.name.trim(),
      email: form.email.trim(),
      projectType: form.projectType,
      budget: Number(form.budget || 0),
      notes: form.notes.trim(),
      status: "new",
    };
    setClients((prev) => [newClient, ...prev]);
    setFolders((prev) => ({ ...prev, [newClient.id]: DEFAULT_FOLDERS }));
    setForm({ name: "", email: "", projectType: form.projectType, budget: "", notes: "" });
  }

  return (
    <SectionCard title="Client Intake" subtitle="Capture a lead and auto-create project scaffolding.">
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Client Name</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Artist" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@artist.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Project Type</label>
          <select className="mt-1 w-full border rounded-lg px-3 py-2" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}>
            <option>Mix Only</option>
            <option>Master Only</option>
            <option>Mix & Master</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Budget (USD)</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="1000" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="EP details, references, deadlines…" />
        </div>
        <div className="flex items-center gap-2">
          <input id="autoTasks" type="checkbox" className="h-4 w-4" checked={autoTasks} onChange={(e) => setAutoTasks(e.target.checked)} />
          <label htmlFor="autoTasks" className="text-sm">Prepare task template (enable in Kanban)</label>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow">➕ Add Client</button>
        </div>
      </form>
    </SectionCard>
  );
}

function FoldersView({ clients, folders }) {
  return (
    <SectionCard title="Auto Folder Creation" subtitle="Preview of scaffolded project folders per client.">
      <div className="space-y-4">
        {clients.length === 0 && <p className="text-sm text-gray-500">No clients yet. Add one above to see folders.</p>}
        {clients.map((c) => (
          <div key={c.id} className="rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{c.name} <span className="text-gray-500 text-xs">({c.projectType})</span></div>
              <span className="text-xs border rounded-full px-2 py-1">{c.status}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
              {(folders[c.id] || DEFAULT_FOLDERS).map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📁</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function Invoices({ clients, invoices, setInvoices }) {
  const [selected, setSelected] = useState("");
  const [lineItem, setLineItem] = useState({ description: "Mix & Master – per song", qty: 1, rate: 500 });

  const client = useMemo(() => clients.find((c) => c.id === selected), [clients, selected]);

  function addInvoice() {
    if (!client) return;
    const id = uid();
    const amount = Number(lineItem.qty) * Number(lineItem.rate);
    const inv = {
      id,
      clientId: client.id,
      clientName: client.name,
      status: "Pending",
      items: [lineItem],
      subtotal: amount,
      createdAt: new Date().toISOString(),
    };
    setInvoices((prev) => [inv, ...prev]);
  }

  function markPaid(id) {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: "Paid" } : i)));
  }

  return (
    <SectionCard title="Invoicing & Payments" subtitle="Prefilled invoice templates with status tracking.">
      <div className="space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm font-medium">Client</label>
            <select className="mt-1 w-full border rounded-lg px-3 py-2" value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" value={lineItem.description} onChange={(e) => setLineItem({ ...lineItem, description: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Qty</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" type="number" value={lineItem.qty} onChange={(e) => setLineItem({ ...lineItem, qty: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm font-medium">Rate</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" type="number" value={lineItem.rate} onChange={(e) => setLineItem({ ...lineItem, rate: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={addInvoice} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow">💳 Create Invoice</button>
        </div>
        <hr className="my-2" />
        <div className="grid md:grid-cols-2 gap-3">
          {invoices.length === 0 && <p className="text-sm text-gray-500">No invoices yet.</p>}
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">Invoice #{inv.id.slice(0, 6)}</div>
                <span className={"text-xs rounded-full px-2 py-1 border " + (inv.status === "Paid" ? "bg-green-50 border-green-200 text-green-700" : "bg-yellow-50 border-yellow-200 text-yellow-700")}>
                  {inv.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">Client: {inv.clientName}</div>
              <div className="mt-2 text-sm">
                {inv.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span>{it.description}</span>
                    <span className="tabular-nums">{it.qty} × ${it.rate}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">${inv.subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {inv.status !== "Paid" && (
                  <button className="inline-flex items-center gap-2 border px-3 py-1.5 rounded-lg hover:bg-gray-50" onClick={() => markPaid(inv.id)}>
                    ✅ Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function Kanban({ tasks, setTasks, clients }) {
  const statuses = ["Backlog", "Waiting for Files", "In Progress", "Pending Payment", "Paid", "Completed"];

  function addTemplateTasks(clientId) {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const template = TASK_TEMPLATES[client.projectType] || TASK_TEMPLATES["Mix & Master"];
    const newOnes = template.map((t) => ({ id: uid(), title: `${client.name}: ${t}`, status: "Backlog" }));
    setTasks((prev) => [...newOnes, ...prev]);
  }

  function moveTask(id, newStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <SectionCard title="Task + Progress Board" subtitle="Lightweight Kanban with stage changes.">
      <div className="mb-3">
        <label className="text-sm font-medium">Seed tasks from client</label>
        <select className="mt-1 ml-2 border rounded-lg px-3 py-2" onChange={(e) => addTemplateTasks(e.target.value)} defaultValue="">
          <option value="" disabled>Select client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statuses.map((col) => (
          <div key={col} className="rounded-xl border bg-white">
            <div className="px-3 py-2 border-b font-medium flex items-center justify-between">
              <span>{col}</span>
              <span className="text-xs border rounded-full px-2 py-0.5">
                {tasks.filter((t) => t.status === col).length}
              </span>
            </div>
            <div className="p-2 space-y-2 min-h-[120px]">
              {tasks.filter((t) => t.status === col).map((t) => (
                <div key={t.id} className="rounded-lg border p-2 text-sm bg-white">
                  <div className="font-medium mb-2">{t.title}</div>
                  <div className="flex items-center gap-2">
                    <select className="border rounded-lg px-2 py-1" value={t.status} onChange={(e) => moveTask(t.id, e.target.value)}>
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button className="border rounded-lg px-2 py-1 hover:bg-gray-50" onClick={() => removeTask(t.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-4">
      <Hero />
      <ProblemSolution />
      <FeatureGrid />
      <SectionCard title="Why Now" subtitle="Decentralized creative work needs centralized ops.">
        <p className="text-sm text-gray-600">
          Freelancers and boutique studios deserve startup-grade workflows. Alioop merges automation with creative empathy so your admin
          stays invisible and your art stays front-and-center.
        </p>
      </SectionCard>
    </div>
  );
}

function DemoTab() {
  const [clients, setClients] = useLocalStorage("ali_clients", [seedClient]);
  const [folders, setFolders] = useLocalStorage("ali_folders", { [seedClient.id]: DEFAULT_FOLDERS });
  const [invoices, setInvoices] = useLocalStorage("ali_invoices", []);
  const [tasks, setTasks] = useLocalStorage("ali_tasks", seedTasks);

  function resetAll() {
    setClients([]);
    setFolders({});
    setInvoices([]);
    setTasks([]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs border rounded-full px-2 py-1">Local-only demo</span>
        <span className="text-xs text-gray-500">Data persists in your browser (localStorage).</span>
        <button className="text-xs border rounded-lg px-2 py-1 hover:bg-gray-50" onClick={resetAll}>🗑️ Reset</button>
      </div>
      <IntakeAndFolders clients={clients} setClients={setClients} setFolders={setFolders} />
      <FoldersView clients={clients} folders={folders} />
      <Invoices clients={clients} invoices={invoices} setInvoices={setInvoices} />
      <Kanban tasks={tasks} setTasks={setTasks} clients={clients} />
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("overview");
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 grid place-items-center text-white font-bold">🏀</div>
          <div>
            <div className="font-extrabold text-xl">Alioop.ai</div>
            <div className="text-xs text-gray-500">The perfect assist for creative ops</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab("overview")} className={"px-3 py-1.5 rounded-lg border text-sm " + (tab === "overview" ? "bg-gray-100" : "bg-white")}>Overview</button>
          <button onClick={() => setTab("demo")} className={"px-3 py-1.5 rounded-lg border text-sm " + (tab === "demo" ? "bg-gray-100" : "bg-white")}>Live Demo →</button>
        </div>
      </div>
      {tab === "overview" ? <OverviewTab /> : <DemoTab />}
      <div className="text-xs text-gray-500 text-center py-6">
        Built as an interactive concept for the Alioop.ai MVP. No external services are called.
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
