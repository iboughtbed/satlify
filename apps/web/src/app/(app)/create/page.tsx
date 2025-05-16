import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="container">
      <div className="flex flex-col">
        <div className="relative py-16"></div>
      </div>
    </div>
  );
}
