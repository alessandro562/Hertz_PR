import { redirect } from "next/navigation";

// "Squadre" retired ("via le squadre"): PRs are grouped by Capo PR now.
// This legacy route just forwards to the collaborators list.
export default function MyTeamRedirect() {
  redirect("/collaborators");
}
