"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/auth-types";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountSettings({ session }: { session: Session }) {
  const [emailVerificationPending, setEmailVerificationPending] =
    React.useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: session.user.name || "",
    },
    mode: "onChange",
  });

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

  async function onSubmitName(data: AccountFormValues) {
    await authClient.updateUser(data);
    toast.success("Name updated successfully!");
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col space-y-8 md:py-16">
      <div className="">
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitName)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
