import { redirect } from "next/navigation";

// "Squadre PR" retired ("via le squadre"): no more team creation.
export default function NewTeamRedirect() {
  redirect("/capi-pr");
}
