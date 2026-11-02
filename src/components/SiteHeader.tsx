import Link from "next/link";
import { PROFILE } from "@/data/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import ModeToggle from "./ModeToggle";

const LINKS = [
  { href: `mailto:${PROFILE.email}`, label: "Email", Icon: MailIcon, external: false },
  { href: PROFILE.linkedin, label: "LinkedIn", Icon: LinkedInIcon, external: true },
  { href: PROFILE.github, label: "GitHub", Icon: GitHubIcon, external: true },
];

export default function SiteHeader({ showModeToggle = false }: { showModeToggle?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="truncate text-sm font-semibold sm:text-base">
          {PROFILE.name}
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Contact" className="flex items-center gap-1">
            {LINKS.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={label}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline">{label}</span>
              </a>
            ))}
          </nav>
          {showModeToggle && <ModeToggle />}
        </div>
      </div>
    </header>
  );
}
