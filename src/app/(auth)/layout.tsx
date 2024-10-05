import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  if (user) redirect("/app/dashboard");

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      {children}
    </div>
  );
}
