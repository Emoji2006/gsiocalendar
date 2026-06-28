import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="p-4 border-b flex gap-4 bg-gray-50">
      <div className="flex gap-4">
        <Link href="/calendar" className="font-bold">
          Calendrier
        </Link>
        <Link href="/settings" className="font-bold">
          Paramètres
        </Link>
      </div>
    </nav>
  );
}