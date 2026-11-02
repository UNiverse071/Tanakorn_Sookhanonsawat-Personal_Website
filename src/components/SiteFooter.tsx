import { PROFILE } from "@/data/profile";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-6 text-center text-sm text-muted">
      &copy; {new Date().getFullYear()} {PROFILE.name}
    </footer>
  );
}
