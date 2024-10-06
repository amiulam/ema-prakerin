import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { SessionContextProvider } from "@/context/session-context-provider";
import { validateRequest } from "@/lib/lucia";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionData = await validateRequest();
  if (!sessionData.user) redirect("/");

  return (
    <SessionContextProvider value={sessionData}>
      <div className="grid min-h-screen grid-cols-[15rem_1fr]">
        <Sidebar />
        <div className="grid grid-rows-[2.7rem_1fr] border-l border-l-zinc-300 p-5">
          <Header />
          <main className="relative mt-4 min-h-[calc(100vh-6.5rem)] overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </SessionContextProvider>
  );
}
