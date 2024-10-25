import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { validateRequest } from "@/lib/lucia";
import Image from "next/image";

export default async function GuestHeader() {
  const { user } = await validateRequest();
  return (
    <header className="container mx-auto flex items-center justify-between py-6">
      <Image
        src="/images/logo.png"
        alt="the-logo"
        height={100}
        width={100}
        className="w-14"
      />
      <nav className="flex items-center gap-x-6">
        <Link href="/">Home</Link>
        <Link href="/profile">Profil</Link>
        {user ? (
          <Button asChild>
            <Link href="/app/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <div className="flex gap-x-4">
            <Button asChild variant="outline">
              <Link href="/signin">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Daftar</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
