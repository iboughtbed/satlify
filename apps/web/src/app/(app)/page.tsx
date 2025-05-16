import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  return (
    <div className="container">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative overflow-hidden pb-10 pt-8 md:pt-16">
          <div className="relative flex flex-col items-center">
            <h1
              className="mt-3 animate-fade-up text-balance text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]"
              style={{ animationDelay: "0.20s", animationFillMode: "both" }}
            >
              Prepare for SAT with AI
            </h1>

            <p
              className="mt-3 max-w-xl animate-fade-up text-balance text-center text-muted-foreground sm:text-lg"
              style={{ animationDelay: "0.30s", animationFillMode: "both" }}
            >
              Get 1500+ on your SAT without hiring a tutor
            </p>

            <div
              className="mt-6 flex animate-fade-up items-center gap-2"
              style={{ animationDelay: "0.40s", animationFillMode: "both" }}
            >
              <Link
                href="/create"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Create
              </Link>
              <Link href="/signup" className={cn(buttonVariants())}>
                Practice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
