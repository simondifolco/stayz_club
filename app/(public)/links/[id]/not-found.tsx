import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground">This link does not exist</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
} 