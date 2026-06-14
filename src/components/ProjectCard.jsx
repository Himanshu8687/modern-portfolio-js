import React, { useOptimistic } from "react";

export const ProjectCard = ({ project }) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    project.status,
    (currentStatus, nextStatus) => nextStatus,
  );

  const isActive = optimisticStatus === "active";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            {isActive && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${isActive ? "bg-emerald-400" : "bg-amber-500"}`}
            />
          </span>
          <p className="text-xs font-mono font-medium tracking-wider uppercase text-slate-400">
            {optimisticStatus}
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono text-slate-500">
          <span className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800">
            CPU: {project.metrics.cpu}%
          </span>
          <span className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800">
            MEM: {project.metrics.memory}GB
          </span>
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-100 group-hover:text-white">
        {project.name}
      </h3>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-blue-400">
          Launch Console &rarr;
        </span>
        <button
          onClick={() => alert("Status Toggled")}
          className={`rounded-lg px-3 py-1.5 font-mono text-xs font-medium border ${isActive ? "border-slate-800 bg-slate-900 text-slate-300" : "border-blue-500/30 bg-blue-500/10 text-blue-400"}`}
        >
          {isActive ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
};
