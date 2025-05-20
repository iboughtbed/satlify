import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { HydrateClient, trpc } from "@/trpc/server";
import { getSession } from "@/lib/auth";
import { Dashboard } from "./client";

export default async function Page() {
  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  void trpc.practiceTest.get.prefetch();
  void trpc.testAttempts.get.prefetch();

  return (
    <HydrateClient>
      <Dashboard session={session} />
    </HydrateClient>
  );
}
