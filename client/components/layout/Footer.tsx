export function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()} Aissaoui School Robotics. All rights reserved.
        </p>
        <p className="text-xs">Built for fair, transparent project scoring.</p>
      </div>
    </footer>
  );
}
