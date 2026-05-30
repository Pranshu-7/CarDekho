// components/Navbar.tsx
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex items-center gap-2 px-4 py-3 border-b">
      <Image
        src="/nextdrive-logo.png"
        alt="NextDrive logo"
        width={32}
        height={32}
      />
      <span className="font-semibold text-lg tracking-tight">
        NextDrive
      </span>
    </nav>
  );
}