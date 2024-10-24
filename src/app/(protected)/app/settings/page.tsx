import db from "@/drizzle";
import SettingsForm from "./form";

export default async function SettingsPage() {
  const settingsData = await db.query.settingsTable.findFirst({});

  return (
    <div className="relative space-y-1.5 overflow-x-auto rounded-xl border border-zinc-300 bg-white px-7 py-4">
      <h1 className="py-2 text-xl font-bold">Settings</h1>
      <SettingsForm settingsData={settingsData} />
    </div>
  );
}
