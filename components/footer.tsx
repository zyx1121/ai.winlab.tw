import { AppLink } from "@/components/app-link";

export function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-8 w-full">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Office of AI Affairs.
      </p>
      <AppLink
        href="/privacy"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Privacy
      </AppLink>
    </footer>
  );
}
