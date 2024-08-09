import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function Navigation() {
  const session = await auth();
  // console.log("session", session);
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/account"
            className="hover:text-accent-400 transition-colors flex gap-3 items-center"
          >
            {session?.user?.image ? (
              <img
                className="rounded-full h-8"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
            ) : (
              ""
            )}
            {/* (
              <img
                className="rounded-full h-8"
                src="/avatar.jpeg"
                alt="A cat avatar"
                referrerPolicy="no-referrer"
              />
            ) */}
            Guest area
          </Link>
        </li>
      </ul>
    </nav>
  );
}
