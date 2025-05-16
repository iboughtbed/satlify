"use client";

import * as React from "react";
import { toast } from "sonner";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/auth-types";

export function AccountSettings({ session }: { session: Session }) {
  const [emailVerificationPending, setEmailVerificationPending] =
    React.useState(false);

  async function handleEmailVerification() {
    setEmailVerificationPending(true);

    try {
      await authClient.sendVerificationEmail(
        {
          email: session.user.email,
        },
        {
          onRequest: () => {
            setEmailVerificationPending(true);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
            setEmailVerificationPending(false);
          },
          onSuccess: () => {
            toast.success("Verification email sent successfully");
            setEmailVerificationPending(false);
          },
        },
      );
    } catch {
      //
    }

    setEmailVerificationPending(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="relative py-16">
        <Alert className="space-y-2">
          <AlertTitle>Verify Your Email Address</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Please verify your email address. Check your inbox for the
            verification email. If you haven't received the email, click the
            button below to resend.
          </AlertDescription>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleEmailVerification}
          >
            {emailVerificationPending
              ? "Sending..."
              : "Resend Verification Email"}
          </Button>
        </Alert>
      </div>
    </div>
  );
}
