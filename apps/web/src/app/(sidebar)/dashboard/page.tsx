import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }
}
