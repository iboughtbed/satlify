import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { AccountSettings } from "./client";

export default async function Page() {
  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return <AccountSettings session={session} />;
}
