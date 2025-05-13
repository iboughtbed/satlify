"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form, FormControl, FormField } from "@/components/ui/form";
import { AuthCard } from "@/components/auth/auth-card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface SignUpProps {
  callbackUrl?: string;
}

export function SignUp({ callbackUrl }: SignUpProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    await authClient.signUp.email(
      {
        email,
        password,
        name: email,
        callbackURL: callbackUrl ?? "/"
      },
      {
        onSuccess: () => {
          toast.success("Successfully signed up. Redirecting...");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  }
  return (
    <AuthCard
      loading={loading}
      setLoading={setLoading}
      title="Create an account"
      description="Welcome! Please fill in the details to get started."
      callbackUrl={callbackUrl}
      type="signup"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-nowrap items-stretch justify-start gap-8"
        >
          <div className="flex flex-col flex-nowrap items-stretch justify-center gap-6">
            <div className="flex flex-row flex-nowrap items-stretch justify-between gap-4">
              <div className="relative flex flex-[1_1_auto] flex-col items-stretch justify-start">
                <div className="flex flex-col flex-nowrap items-stretch justify-start gap-2">
                  <div className="flex flex-row flex-nowrap items-center justify-between">
                    <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal">
                      Email address or username
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        placeholder="Enter email or username"
                        type="text"
                        disabled={loading}
                        {...field}
                      />
                    )}
                  />

                  <div className="flex flex-row flex-nowrap items-center justify-between">
                    <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal">
                      Password
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <Input
                        placeholder="Enter password"
                        type="password"
                        disabled={loading}
                        {...field}
                      />
                    )}
                  />

                  <div className="flex flex-row flex-nowrap items-center justify-between">
                    <label className="flex items-center text-[0.8125rem] font-medium leading-snug tracking-normal">
                      Confirm Password
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <Input
                        placeholder="Confirm password"
                        type="password"
                        disabled={loading}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            <span className="flex flex-row flex-nowrap items-center justify-start">
              Continue
            </span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
