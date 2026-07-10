import { redirect } from "next/navigation";

// "Squadre PR" retired ("via le squadre"): replaced by the Capi PR overview.
export default function TeamDetailRedirect() {
  redirect("/capi-pr");
}
