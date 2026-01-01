import { cn } from "../libs/utils";

type GlowCardWrapperProps = {
  children: React.ReactNode;
  // all the tailwind colors
  color:
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose"
    | "neutral";
};

export const GlowCardWrapper = ({ color, children }: GlowCardWrapperProps) => {
  return (
    <div
      className={cn(
        "border-2 w-fit shadow-md space-y-4 rounded p-2",
        color === "red" && "border-red-500 shadow-red-500",
        color === "orange" && "border-orange-500 shadow-orange-500",
        color === "amber" && "border-amber-500 shadow-amber-500",
        color === "yellow" && "border-yellow-500 shadow-yellow-500",
        color === "lime" && "border-lime-500 shadow-lime-500",
        color === "green" && "border-green-500 shadow-green-500",
        color === "emerald" && "border-emerald-500 shadow-emerald-500",
        color === "teal" && "border-teal-500 shadow-teal-500",
        color === "cyan" && "border-cyan-500 shadow-cyan-500",
        color === "sky" && "border-sky-500 shadow-sky-500",
        color === "blue" && "border-blue-500 shadow-blue-500",
        color === "indigo" && "border-indigo-500 shadow-indigo-500",
        color === "violet" && "border-violet-500 shadow-violet-500",
        color === "purple" && "border-purple-500 shadow-purple-500",
        color === "fuchsia" && "border-fuchsia-500 shadow-fuchsia-500",
        color === "pink" && "border-pink-500 shadow-pink-500",
        color === "rose" && "border-rose-500 shadow-rose-500",
        color === "neutral" && "border-neutral-500 shadow-neutral-500",
      )}
    >
      {children}
    </div>
  );
};
