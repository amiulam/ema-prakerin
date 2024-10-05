import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/lucia";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();
  
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-2">
      <h1 className="text-2xl font-bold">Teruntuk yang mau Prakerin 👋</h1>
      <div className="flex gap-x-2">
        {user ? (
          <Button asChild>
            <Link href="/app/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}