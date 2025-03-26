"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-[1400px] flex justify-between items-center p-3 px-4 sm:px-6 lg:px-8 text-sm">
        <div className="flex gap-5 items-center font-semibold text-2xl">
          <Link 
            href="/" 
            className="text-3xl font-geist bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary transition-colors"
          >
            mHotel
          </Link>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </div>
  );
}
