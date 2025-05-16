import Link from "next/link";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Session } from "@/lib/auth-types";

interface SiteHeaderProps {
  user?: Session["user"] | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const t = useTranslations("navigation.header");

  const items = siteConfig.mainNav.map((item) => ({
    title: t(item.key),
    href: item.href,
  }));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container relative flex h-16 items-center justify-between">
        <div className="hidden items-center gap-2 text-sm md:flex">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Satlify
          </Link>

          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className={cn(buttonVariants())}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Sign in
              </Link>
              <Link href="/signup" className={cn(buttonVariants())}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
