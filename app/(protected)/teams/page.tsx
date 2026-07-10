import { redirect } from "next/navigation";

// "Squadre PR" retired ("via le squadre"): replaced by the Capi PR overview.
export default function TeamsRedirect() {
  redirect("/capi-pr");
}
