import type { BackgroundTask } from "../model/session";
import { Bot, Eye, Terminal } from "../../../shared/ui/icons";

const KIND_LABEL: Record<BackgroundTask["kind"], string> = {
  agent: "Subagent",
  shell: "Command",
  other: "Task",
};

const KIND_ICON: Record<BackgroundTask["kind"], typeof Bot> = {
  agent: Bot,
  shell: Terminal,
  other: Eye,
};

export function BackgroundTasksStrip({ tasks }: { tasks: BackgroundTask[] }) {
  if (tasks.length === 0) return null;
  return (
    <section
      aria-label="Running in background"
      className="px-2 text-content/55"
      data-background-tasks
    >
      <div className="relative z-0 rounded-t-[10px] border border-b-0 border-content/10 bg-content/3 px-2 py-1">
        <div className="flex h-6 items-center gap-2 text-[11px] text-content/45">
          <span
            aria-hidden
            className="ml-1 size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] motion-safe:animate-pulse"
          />
          <span className="min-w-0 flex-1 truncate">Running in background</span>
          <span className="tabular-nums">{tasks.length}</span>
        </div>
        <ul className="max-h-28 overflow-y-auto">
          {tasks.map((task) => {
            const Icon = KIND_ICON[task.kind];
            return (
              <li
                key={task.id}
                title={task.description}
                className="flex h-7 items-center gap-2 border-t border-stroke text-[12px]"
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  {task.description}
                </span>
                <span className="shrink-0 text-[11px] text-content/40">
                  {KIND_LABEL[task.kind]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
