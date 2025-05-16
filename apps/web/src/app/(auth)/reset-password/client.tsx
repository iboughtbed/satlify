"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await authClient.resetPassword({
        newPassword: data.password,
        token: new URLSearchParams(window.location.search).get("token")!,
      });

      if (response.error) {
        return toast.error(response.error.message);
      }

      setIsSuccess(true);
      router.push("/signin");
    } catch {
      toast.error("Failed to reset password. Please try again.");
    }

    setIsLoading(false);
  }

  return (
    <AuthCard
      loading={isLoading}
      setLoading={setIsLoading}
      title="Reset Your Password"
      description="Enter your email and new password below."
      type="reset"
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
                      Password
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          placeholder="Enter password"
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
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
                      <FormControl>
                        <Input
                          placeholder="Confirm password"
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span className="flex flex-row flex-nowrap items-center justify-start">
              Reset Password
            </span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
