import { createLucideIcon } from "lucide-react";

const CalendarIcon = createLucideIcon("calendar", [
  ["path", { d: "M12 6v6l4 2" }],
  ["circle", { cx: "12", cy: "12", r: "10" }],
]);
export function Calendar() {
  return <CalendarIcon />;
}
