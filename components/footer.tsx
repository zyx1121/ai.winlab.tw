export function Footer() {
  return (
    <footer className="flex items-center justify-center py-8 w-full">
      <p className="text-sm font-bold text-muted-foreground">
        Copyright &copy; {new Date().getFullYear()} Winlab. All rights reserved.
      </p>
    </footer>
  );
}
