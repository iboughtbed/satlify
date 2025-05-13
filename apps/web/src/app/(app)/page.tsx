import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  return (
    <div className="container">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative overflow-hidden pb-10 pt-8 md:pt-16">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-center gap-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
