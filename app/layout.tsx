import "./globals.css";
import Link from "next/link";
export const metadata = { title: "Next Kanban", description: "Kanban board (Next.js + Prisma + dnd-kit)" };
export default function RootLayout({ children }:{ children: React.ReactNode }){return (<html lang="en"><body><header className="border-b bg-white"><div className="container py-3 flex items-center gap-3"><Link href="/" className="text-lg font-semibold">🗂️ Next Kanban</Link></div></header><main>{children}</main></body></html>);}
