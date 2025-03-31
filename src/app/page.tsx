import Image from "next/image";
import Dashboard from "./dashboard/page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthOptions } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";



export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) redirect("/dashboard")
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <Dashboard />

    </div>
  );
}
