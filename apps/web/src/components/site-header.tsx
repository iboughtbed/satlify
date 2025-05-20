import Link from "next/link";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
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
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center justify-between gap-2 md:gap-4">
          <Link href="/" className="font-semibold">
            Satlify
          </Link>

          <div className="flex items-center gap-4">
            {items.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="hover:text-foreground/80"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/signin">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
