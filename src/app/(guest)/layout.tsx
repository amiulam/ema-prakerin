import GuestHeader from "@/components/guest-header";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/lucia";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <GuestHeader />
      {children}
      <footer className="pb-12 pt-20 text-muted-foreground">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Platform Prakerin. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
