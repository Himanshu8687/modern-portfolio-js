import React, { useState, useEffect, useOptimistic } from "react";
import { ProjectCard } from "./ProjectCard";
import { askGemini } from "./gemini";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "edge-handler-service",
    status: "active",
    metrics: { cpu: 14, memory: 1.2 },
    branch: "main",
    commits: 142,
    region: "us-east-1",
  },
  {
    id: "2",
    name: "ingress-graphql-mesh",
    status: "active",
    metrics: { cpu: 42, memory: 4.8 },
    branch: "dev",
    commits: 89,
    region: "eu-west-2",
  },
  {
    id: "3",
    name: "distributed-cache-db",
    status: "paused",
    metrics: { cpu: 0, memory: 0.0 },
    branch: "main",
    commits: 214,
    region: "ap-south-1",
  },
];

const TECH_STACK = [
  {
    name: "React 19",
    cpu: "14%",
    mem: "1.2GB",
    color: "border-amber-500/40 text-amber-400",
    glow: "from-amber-500/20",
  },
  {
    name: "Node.js",
    cpu: "28%",
    mem: "2.4GB",
    color: "border-blue-500/40 text-blue-400",
    glow: "from-blue-500/20",
  },
  {
    name: "GraphQL",
    cpu: "42%",
    mem: "4.6GB",
    color: "border-pink-500/40 text-pink-400",
    glow: "from-pink-500/20",
  },
  {
    name: "Tailwind v4",
    cpu: "13%",
    mem: "4.8GB",
    color: "border-cyan-500/40 text-cyan-400",
    glow: "from-cyan-500/20",
  },
];

export const DeveloperPortfolio = () => {
  const [message, setMessage] = useState("");
  const [projectsState, setProjectsState] = useState(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(
    MOCK_PROJECTS[0].id,
  );
  const [networkSpeed, setNetworkSpeed] = useState(42);
  const [userLocation, setUserLocation] = useState("FETCHING CLIENT LOC...");
  const [rateLimitCounter, setRateLimitCounter] = useState(0);
  const [terminalError, setTerminalError] = useState(false);

  const [logs, setLogs] = useState([
    "[SYSTEM] Core cluster runtime diagnostics active...",
    "[AUTH] Signature verified: HIMANSHU_DWIVEDI_NODE_1",
  ]);
  const [aiResponse, setAiResponse] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    projectsState,
    (state, { id, nextStatus }) =>
      state.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)),
  );

  const selectedProject =
    optimisticProjects.find((p) => p.id === selectedProjectId) ||
    optimisticProjects[0];

  // लाइव लोकेशन ट्रैकर
  useEffect(() => {
    setUserLocation("LOC: IN-UP-KANPUR");
  }, []);

  // लाइव लॉग्स और नेटवर्क स्पीड फ्लक्चुएशन
  useEffect(() => {
    const logPool = [
      "Cache cluster hit ratio optimized at 98.4%",
      "Garbage collection executed on client environment",
      "Handshake token authorized via edge gateway Router",
      "TLS 1.3 cryptographic key rotation executed",
      "Kubernetes cluster scaled: pod-replica-3 deployed",
    ];
    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      setLogs((prev) => [
        ...prev.slice(-3),
        `[${new Date().toLocaleTimeString()}] ${randomLog}`,
      ]);
      setNetworkSpeed(Math.floor(Math.random() * (58 - 38 + 1)) + 38);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // कनेक्ट/डिस्कनेक्ट के लिए ऑप्टिमिस्टिक UI म्यूटेशन फंक्शन
  const toggleProjectStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";

    // UI तुरंत बदल जाएगा (बिना सर्वर रिस्पॉन्स का वेट किए)
    setOptimisticProjects({ id, nextStatus });

    // नकली एपीआई डिले (2 सेकंड का ड्रामा)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // बैकएंड स्टेट अपडेट
    setProjectsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)),
    );
    setLogs((prev) => [
      ...prev,
      `[STATE_MUTATION] Cluster node ${id} shifted to ${nextStatus.toUpperCase()}`,
    ]);
  };

  // टर्मिनल रेट लिमिटर सबमिट हैंडलर
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (rateLimitCounter >= 2) {
      setTerminalError(true);
      setLogs((prev) => [
        ...prev,
        `[SECURITY ERROR] Rate Limit Exceeded: Request blocked via Himanshu OS Firewall.`,
      ]);
      setMessage("429 TOO MANY REQUESTS // BLOCKED");
      setTimeout(() => {
        setTerminalError(false);
        setRateLimitCounter(0);
        setMessage("");
      }, 4000);
      return;
    }

    setRateLimitCounter((prev) => prev + 1);
    alert(`Transmission sent to Himanshu: ${message}`);
    setLogs((prev) => [
      ...prev,
      `[DISPATCH] Message sent securely from node ${userLocation}`,
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased relative pb-12 font-sans">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-black text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            HIMANSHU.DEV
          </h1>

          <div className="font-mono text-cyan-400"></div>
        </div>
      </nav>
      {/* TOP BAR */}
      <div className="w-full border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md px-6 py-2.5 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-bold tracking-wider">
            SYS_ADMIN // h_dwivedi
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-blue-400 font-bold animate-pulse">
            {userLocation}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">VITE_BUILD: v8.0.16</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* HERO HEADER */}
      <header className="relative overflow-hidden px-4 pt-16 pb-8 text-center">
        <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.15),transparent)] blur-3xl" />
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          Himanshu Dwivedi
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">
          web developer & video editor
        </p>
      </header>

      {/* WORKSPACE */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* लेफ्ट साइडबार */}
          <div className="space-y-3">
            <p className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
              Project Cluster Grid
            </p>
            {optimisticProjects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full text-left p-4 rounded-xl border font-mono text-xs transition-all duration-200 flex flex-col gap-1 ${
                  selectedProjectId === proj.id
                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    : "border-slate-900 bg-slate-950/40 text-slate-400 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">
                    {proj.name}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${proj.status === "active" ? "bg-emerald-400" : "bg-amber-500"}`}
                  />
                </div>
                <div className="text-slate-500 mt-1 break-all">
                  Branch: {proj.branch} // Region: {proj.region}
                </div>
              </button>
            ))}
          </div>

          {/* राइट साइडबार */}
          <div className="lg:col-span-2 rounded-xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-6 flex flex-col justify-between min-h-[340px] overflow-hidden">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 font-mono text-xs">
                <span className="text-blue-400 font-bold uppercase tracking-wider">
                  // SYSTEM DIAGNOSTICS CONTROL
                </span>
                <span className="text-slate-500 break-all">
                  SIGNATURE: HD_ROOT
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-[#020617] border border-slate-900 p-3 rounded-lg">
                  <p className="text-slate-500">Core Engine CPU</p>
                  <p className="text-xl font-bold text-slate-200 mt-1">
                    {selectedProject.metrics.cpu}%
                  </p>
                </div>
                <div className="bg-[#020617] border border-slate-900 p-3 rounded-lg">
                  <p className="text-slate-500">Allocated RAM</p>
                  <p className="text-xl font-bold text-slate-200 mt-1">
                    {selectedProject.metrics.memory} GB
                  </p>
                </div>
                <div className="bg-[#020617] border border-slate-900 p-3 rounded-lg col-span-2 sm:col-span-1 flex flex-col justify-between">
                  <p className="text-slate-500">Node Status</p>
                  <button
                    className="w-full max-w-full mt-1 text-xs font-bold rounded px-2 py-1 text-center border uppercase overflow-hidden break-words"
                    onClick={() =>
                      toggleProjectStatus(
                        selectedProject.id,
                        selectedProject.status,
                      )
                    }
                    className={`mt-1 text-xs font-bold rounded px-2 py-1 text-center border uppercase transition-all duration-150 ${
                      selectedProject.status === "active"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
                    }`}
                  >
                    {selectedProject.status === "active"
                      ? "● Disconnect"
                      : "○ Connect Node"}
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>React 19 Optimistic State Matrix</span>
                    <span>Mutation OK</span>
                  </div>
                  <div className="w-full bg-[#020617] rounded-full h-1 border border-slate-900">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full shadow-[0_0_10px_#3b82f6]"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-900 pt-4 font-mono text-[11px] text-emerald-400/90 space-y-1 bg-[#020617] p-3 rounded-lg border shadow-inner">
              {logs.map((log, index) => (
                <div key={index} className="opacity-80 truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KUBERNETES & METRICS */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
        <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-xl backdrop-blur-md font-mono text-xs">
          <h3 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-[11px] text-blue-400">
            // Kubernetes Cluster Nodes
          </h3>
          <div className="grid grid-cols-4 gap-3 pt-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-[#020617] border border-slate-900 p-2 rounded-lg"
              >
                <span
                  className={`h-2 w-2 rounded-full shadow-[0_0_8px] ${i === 5 ? "bg-red-500 shadow-red-500" : "bg-emerald-400 shadow-emerald-400"}`}
                />
                <span className="text-[9px] text-slate-600 mt-1">
                  pod-0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-xl backdrop-blur-md font-mono text-xs flex flex-col justify-between">
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[11px] text-purple-400">
            // Microservice Latency Gauge
          </h3>
          <div className="text-center py-2">
            <span className="text-3xl font-black text-slate-100 tracking-tight">
              {networkSpeed}
            </span>
            <span className="text-purple-400 text-xs font-bold ml-1">ms</span>
            <p className="text-[10px] text-slate-600 mt-1">
              API Response Gateway Latency
            </p>
          </div>
          <div className="w-full bg-[#020617] rounded-full h-1 border border-slate-900">
            <div
              className="bg-purple-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${networkSpeed}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-xl backdrop-blur-md font-mono text-xs flex flex-col justify-between">
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[11px] text-amber-400">
            // AWS Cloud Billing Efficiency
          </h3>
          <div className="pt-2">
            <div className="text-xl font-bold text-amber-400">
              $3.4K / Year Saved
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Optimized via serverless edge routing configurations.
            </p>
          </div>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit mt-3">
            EFFICIENCY RATIO: +42%
          </span>
        </div>
      </section>

      {/* TECH MATRIX */}
      <section className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-200 sm:text-3xl">
          Architectural Superstructure
        </h2>
        <p className="mt-1 font-mono text-xs text-slate-500 uppercase tracking-widest">
          Engineering Tech Matrix
        </p>
        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className={`relative group overflow-hidden rounded-xl border ${tech.color} bg-slate-950/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_-3px_rgba(255,255,255,0.05)]`}
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${tech.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white">
                {tech.name}
              </h3>
              <div className="mt-1 font-mono text-[9px] text-slate-500">
                SYS_METRIC: OK // ENGINE: 4.0V
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PREMIUM PROJECT ECOSYSTEM */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className="text-5xl font-black">Project Ecosystem</h2>

            <p className="text-slate-500 mt-2">
              Production-grade applications and systems
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              ● 3 ACTIVE SYSTEMS
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              title: "Portfolio Dashboard",
              tech: "React • Tailwind • Vite",
              users: "12.4K",
              uptime: "99.98%",
              status: "ONLINE",
              link: "https://portfoliohima8687.netlify.app/",
            },
            {
              title: "WEB TECH",
              tech: "JavaScript • API",
              users: "4.2K",
              uptime: "99.91%",
              status: "ONLINE",
              link: "https://himanshu8687.github.io/web-tech-site/",
            },
            {
              title: "melodify-music-players",
              tech: "React • Marketing",
              users: "8.9K",
              uptime: "99.95%",
              status: "DEPLOYED",
              link: "https://melodify-music-players.netlify.app",
            },
          ].map((project) => (
            <div
              key={project.title}
              className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/40
        backdrop-blur-xl
        p-7
        hover:border-cyan-500
        hover:-translate-y-2
        transition-all
        duration-300
        "
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 bg-cyan-500 text-white rounded-lg hover:scale-105 transition-all"
              >
                🚀 Live Demo
              </a>
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[100px]" />

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{project.title}</h3>

                  <p className="text-slate-400 mt-2">{project.tech}</p>
                </div>

                <span
                  className="
            px-3
            py-1
            rounded-full
            bg-emerald-500/10
            border
            border-emerald-500/20
            text-emerald-400
            text-xs
          "
                >
                  {project.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-8">
                <div>
                  <p className="text-slate-500 text-xs">USERS</p>

                  <h4 className="text-3xl font-black text-cyan-400">
                    {project.users}
                  </h4>
                </div>

                <div>
                  <p className="text-slate-500 text-xs">UPTIME</p>

                  <h4 className="text-3xl font-black text-emerald-400">
                    {project.uptime}
                  </h4>
                </div>
              </div>

              <div className="mt-8 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENGINEERING MATRIX */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-5xl font-black">Engineering Matrix</h2>

            <p className="text-slate-500 mt-2">
              Technical capabilities and expertise
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            ["React", "95%"],
            ["JavaScript", "90%"],
            ["Tailwind CSS", "92%"],
            ["Angular", "75%"],
            ["HTML5", "98%"],
            ["CSS3", "95%"],
            ["Bootstrap", "90%"],
            ["Video Editing", "88%"],
          ].map(([skill, value]) => (
            <div
              key={skill}
              className="
        bg-slate-900/40
        backdrop-blur-xl
        border
        border-slate-800
        rounded-2xl
        p-5
        hover:border-blue-500
        transition-all
        "
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{skill}</span>

                <span className="text-cyan-400 font-bold">{value}</span>
              </div>

              <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: value }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-5xl font-black mb-10">Career Timeline</h2>

        <div className="space-y-8">
          {[
            "Completed BCA Degree",
            "Frontend Development Internship",
            "React Application Development",
            "Freelance Video Editing Projects",
            "Portfolio Dashboard Deployment",
          ].map((item) => (
            <div
              key={item}
              className="
        border-l-2
        border-cyan-500
        pl-8
        relative
        "
            >
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-cyan-400" />

              <h3 className="text-xl font-bold">{item}</h3>

              <p className="text-slate-500 mt-2">
                Successfully completed milestone and delivered results.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HARDENED TERMINAL CONTROLLER INPUT */}
      <section className="mx-auto max-w-5xl px-4 pt-6 mb-16">
        <div
          className={`relative rounded-xl border p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${terminalError ? "border-red-500/50 bg-red-950/20" : "border-slate-800 bg-slate-950/90"}`}
        >
          <form
            onSubmit={handleTerminalSubmit}
            className="flex items-center gap-3 font-mono text-xs sm:text-sm text-emerald-400"
          >
            <span
              className={`${terminalError ? "text-red-500" : "text-slate-500"} shrink-0 select-none`}
            >
              &gt; {terminalError ? "CRITICAL" : "Connect"}
            </span>
            <input
              type="text"
              value={message}
              disabled={terminalError}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="type encrypt message or email..."
              className={`flex-1 bg-transparent text-slate-100 focus:outline-none caret-emerald-400 ${terminalError ? "text-red-400 font-bold" : ""}`}
            />
            <button
              type="submit"
              disabled={terminalError}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold text-white shadow-lg active:scale-95 transition-all ${terminalError ? "bg-red-600" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"}`}
            >
              {terminalError ? "BLOCKED" : "Execute"}
            </button>
          </form>
        </div>
      </section>
      {/* INFRASTRUCTURE MONITOR */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-5xl font-black">Infrastructure Monitor</h2>

            <p className="text-slate-500 mt-2">
              Real-time service health monitoring
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {["API Gateway", "Database", "Cloud Storage", "Authentication"].map(
            (service) => (
              <div
                key={service}
                className="
              bg-slate-900/40
              backdrop-blur-xl
              border
              border-slate-800
              rounded-2xl
              p-6
              hover:border-emerald-500
              hover:scale-105
              transition-all
              duration-300
              "
              >
                <div className="flex justify-between">
                  <span>{service}</span>

                  <span
                    className="
                  h-3
                  w-3
                  rounded-full
                  bg-emerald-400
                  animate-pulse
                "
                  />
                </div>

                <h3 className="text-2xl font-black text-emerald-400 mt-5">
                  ONLINE
                </h3>

                <p className="text-slate-500 text-sm mt-2">
                  All systems operational
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* LIVE ACTIVITY FEED */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-5xl font-black mb-10">Live Activity Feed</h2>

        <div
          className="
          bg-slate-900/40
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-8
          font-mono
        "
        >
          {[
            "Portfolio deployment successful",
            "Git repository synchronized",
            "Security scan completed",
            "Performance audit passed",
            "New visitor session detected",
          ].map((log) => (
            <div
              key={log}
              className="
              py-3
              border-b
              border-slate-800
              text-emerald-400
              last:border-none
              "
            >
              [{new Date().toLocaleTimeString()}] {log}
            </div>
          ))}
        </div>
      </section>

      {/* COMMAND CENTER */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-5xl font-black mb-10">Command Center</h2>

        <div
          className="
          bg-black
          border
          border-slate-800
          rounded-3xl
          p-8
          font-mono
          shadow-[0_0_40px_rgba(0,0,0,0.5)]
        "
        >
          <div className="text-emerald-400">&gt; system status</div>

          <div className="text-slate-500 mt-2">Runtime Operational</div>

          <div className="text-cyan-400 mt-6">Available Commands</div>

          <div className="text-slate-500 mt-2">
            help • projects • analytics • contact • resume
          </div>

          <div className="mt-6 h-px bg-slate-800" />

          <div className="text-emerald-400 mt-6">&gt; security scan</div>

          <div className="text-slate-500 mt-2">
            No vulnerabilities detected.
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div
          className="
          bg-slate-900/40
          backdrop-blur-xl
          border
          border-slate-800
          rounded-3xl
          p-10
          text-center
        "
        >
          <h2 className="text-5xl font-black">Contact Me</h2>

          <p className="mt-8 text-slate-300 text-lg">
            himanshuankit23@gmail.com
          </p>

          <p className="text-slate-300 text-lg mt-2">+91 8858018331</p>

          <p className="text-slate-500 mt-4">Kanpur, Uttar Pradesh</p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() =>
                (window.location.href = "mailto:himanshuankit23@gmail.com")
              }
              className="
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-400
              transition
            "
            >
              Email Me
            </button>

            <button
              className="
              px-6
              py-3
              rounded-xl
              border
              border-slate-700
              hover:border-cyan-500
              transition
            "
            >
              coming soon
            </button>
          </div>
        </div>
      </section>
      {aiOpen && (
        <div className="fixed bottom-28 right-8 w-96 max-h-[500px] bg-slate-950 border border-cyan-500 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] z-50 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-800">
            <h3 className="text-cyan-400 font-bold">AI Assistant</h3>

            <button onClick={() => setAiOpen(false)} className="text-red-400">
              ✕
            </button>
          </div>

          <div className="p-4 text-slate-300 text-sm overflow-y-auto max-h-[400px] whitespace-pre-wrap">
            {aiResponse}
          </div>
          <div className="p-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ask AI anything..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
              />

              <button
                onClick={async () => {
                  if (!userPrompt.trim()) return;

                  try {
                    setAiResponse("Thinking...");

                    const reply = await askGemini(userPrompt);

                    setAiResponse(reply);
                    setUserPrompt("");
                  } catch (error) {
                    console.error(error);
                    setAiResponse("Error: " + error.message);
                  }
                }}
                className="bg-cyan-500 px-4 rounded-lg text-black font-bold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING AI BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={async () => {
            try {
              const reply = await askGemini("Hello Himanshu");
              setAiResponse(reply);
              setAiOpen(true);
            } catch (error) {
              console.error(error);
              alert("Error: " + error.message);
            }
          }}
          className="
    h-16
    w-16
    rounded-full
    bg-gradient-to-r
    from-cyan-500
    to-blue-600
    shadow-[0_0_40px_rgba(59,130,246,0.8)]
    hover:scale-110
    transition-all
    animate-pulse
    text-white
    font-bold
    "
        >
          AI
        </button>
      </div>

      {/* PREMIUM FOOTER */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3
            className="
            text-3xl
            font-black
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-purple-500
            bg-clip-text
            text-transparent
          "
          >
            HIMANSHU DWIVEDI
          </h3>

          <p className="text-slate-500 mt-4">
            React • Tailwind CSS • JavaScript • Modern UI Engineering
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-purple-400 animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <p className="text-slate-600 mt-6">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};
