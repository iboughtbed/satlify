"use client";

import * as React from "react";
import { toast } from "sonner";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { authClient } from "@/lib/auth-client";

export function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });

      setIsSuccess(true);
    } catch {
      toast.error("Failed to send reset link");
    }

    setIsLoading(false);
  }

  return (
    <AuthCard
      loading={isLoading}
      setLoading={setIsLoading}
      title="Forgot Password"
      description="Enter your email address to reset your password"
      type="forgot"
    >
      <form
        onSubmit={onSubmit}
        className="flex flex-col flex-nowrap items-stretch justify-start gap-8"
      >
        <div className="flex flex-col flex-nowrap items-stretch justify-center gap-6">
          <div className="flex flex-row flex-nowrap items-stretch justify-between gap-4">
            <div className="relative flex flex-[1_1_auto] flex-col items-stretch justify-start">
              <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
                {isSuccess ? (
                  <p>Sent reset link</p>
                ) : (
                  <>
                    <div className="flex flex-row flex-nowrap items-center justify-between">
                      <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal">
                        Email address
                      </label>
                    </div>

                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      name="email"
                      disabled={isLoading}
                      required
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {!isSuccess && (
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span className="flex flex-row flex-nowrap items-center justify-start">
              Send Reset Link
            </span>
          </Button>
        )}
      </form>
    </AuthCard>
  );
}
