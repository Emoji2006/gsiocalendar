// import Link from "next/link";
import NavBar from "@/components/NavBar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <NavBar />
        {/* <nav className="p-4 border-b flex gap-4 bg-gray-50">
          <Link href="/calendar" className="font-bold">Calendrier</Link>
          <Link href="/settings" className="font-bold">Paramètres</Link>
        </nav> */}
        <main>{children}</main>
      </body>
    </html>
  );
}