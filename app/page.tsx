import { redirect } from "next/navigation";

// The proxy sends unauthenticated visitors to /login; authenticated ones land
// on the dashboard.
export default function RootPage() {
  redirect("/dashboard");
}
