import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {


    return (
        <div className="flex flex-col min-h-screen">




            <main className="p-6">{children}</main>
        </div>
    );
}
