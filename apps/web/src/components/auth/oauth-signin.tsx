"use client";

import * as React from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { OAuthStrategy } from "@/lib/auth-types";

type ProviderProps = {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
};

interface OAuthSignInProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  callbackUrl?: string;
}

export function OAuthSignIn({
  loading,
  setLoading,
  callbackUrl,
}: OAuthSignInProps) {
  const providers: ProviderProps[] = [
    { name: "GitHub", icon: "gitHub", strategy: "github" },
    // { name: "Google", icon: "google", strategy: "google" },
  ];

  async function oauthSignin(provider: OAuthStrategy) {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl ?? "/",
      });
    } catch {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  }

  return (
    <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
      <div className="grid grid-cols-1 items-stretch justify-center gap-2">
        {providers.map((provider, idx) => {
          const Icon = Icons[provider.icon];

          return (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => void oauthSignin(provider.strategy)}
              disabled={loading}
            >
              <span className="flex w-full flex-row flex-nowrap items-center justify-center gap-3 overflow-hidden">
                <span className="flex flex-shrink-0 flex-grow-0 basis-4 flex-row flex-nowrap items-center justify-center">
                  <Icon className="h-auto w-4 max-w-full" />
                </span>
                <span className="m-0 overflow-hidden truncate whitespace-nowrap text-[0.8125rem] font-medium leading-snug tracking-normal text-inherit">
                  {provider.name}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
