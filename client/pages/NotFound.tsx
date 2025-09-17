import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.16),transparent_55%)]">
      <Header />
      <main className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
          <p className="mt-2 text-muted-foreground">This page does not exist.</p>
          <Link to="/" className="inline-block mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
            Go back home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
