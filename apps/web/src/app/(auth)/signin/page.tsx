import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { SignIn } from "@/components/auth/sign-in";
import { cn } from "@/lib/utils";
import { loadSearchParams } from "../search-params";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { callbackUrl } = await loadSearchParams(searchParams);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8",
        )}
      >
        <>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <SignIn callbackUrl={callbackUrl ?? undefined} />
      </div>
    </div>
  );
}
