import db from "@/drizzle";
import SettingsForm from "./form";
import { eq } from "drizzle-orm";
import { settingsTable } from "@/drizzle/schema";

export default async function SettingsPage() {
  const settingsData = await db.query.settingsTable.findFirst({
    where: eq(settingsTable.id, 1),
  });

  return (
    <div className="relative space-y-1.5 overflow-x-auto rounded-xl border border-zinc-300 bg-white px-7 py-4">
      <h1 className="py-2 text-xl font-bold">Settings</h1>
      <SettingsForm settingsData={settingsData} />
    </div>
  );
}
