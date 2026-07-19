import { ChefHat, GitBranch, Heart } from "lucide-react";
import { siteConfig, navLinks } from "@/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
              <ChefHat className="h-5 w-5 text-orange-500" />
              {siteConfig.name}
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-orange-500 dark:text-zinc-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">More</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-zinc-500 transition-colors hover:text-orange-500 dark:text-zinc-400"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-sm text-zinc-500 transition-colors hover:text-orange-500 dark:text-zinc-400"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/health"
                  className="text-sm text-zinc-500 transition-colors hover:text-orange-500 dark:text-zinc-400"
                >
                  Health
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">Connect</h4>
            <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
              Built with <Heart className="inline h-3.5 w-3.5 text-red-500" /> using Next.js
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-orange-500 dark:text-zinc-400"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-400 dark:border-zinc-800">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
