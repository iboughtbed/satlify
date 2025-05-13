import Link from "next/link";

import { OAuthSignIn } from "@/components/auth/oauth-signin";

interface AuthCardProps {
  title: string;
  description: string;
  type: "signin" | "signup";
  children: React.ReactNode;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  callbackUrl?: string;
}

export function AuthCard({
  title,
  description,
  type,
  children,
  loading,
  setLoading,
  callbackUrl,
}: AuthCardProps) {
  return (
    <div className="mt-6">
      <div className="relative isolate flex w-[25rem] max-w-[calc(-2.5rem+100vw)] flex-col flex-nowrap items-stretch justify-start overflow-hidden rounded-[0.75rem] bg-card">
        <div className="relative z-10 flex flex-col flex-nowrap items-stretch gap-8 rounded-[0.5rem] border-solid px-10 py-8 text-center transition-all duration-200">
          <div className="flex flex-col flex-nowrap items-stretch justify-start gap-6">
            <div className="flex flex-col flex-nowrap items-stretch justify-start gap-1">
              <h1 className="m-0 text-[1.0625rem] font-bold leading-normal tracking-[normal]">
                {title}
              </h1>
              <p className="m-0 break-words text-[0.8125rem] font-normal leading-snug tracking-[normal]">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-nowrap items-stretch justify-start gap-6">
            <OAuthSignIn
              loading={loading}
              setLoading={setLoading}
              callbackUrl={callbackUrl}
            />

            <div className="flex flex-row flex-nowrap items-center justify-center">
              <div className="flex h-px flex-1 flex-row items-stretch justify-start"></div>
              <p className="mx-4 my-0 text-[0.8125rem] font-normal leading-snug tracking-normal">
                or
              </p>
              <div className="flex h-px flex-1 flex-row items-stretch justify-start"></div>
            </div>

            {children}
          </div>
        </div>

        <div className="-mt-2 flex flex-col flex-nowrap items-center justify-center pb-2 pt-2">
          <div className="m-auto flex flex-row flex-nowrap items-stretch justify-start gap-1 px-8 py-4">
            <span className="m-0 text-[0.8125rem] font-normal leading-snug tracking-normal">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <Link
              href={type === "signin" ? "/signup" : "/signin"}
              className="font-inherit m-0 inline-flex cursor-pointer items-center text-[0.8125rem] font-medium leading-snug tracking-normal no-underline"
            >
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
