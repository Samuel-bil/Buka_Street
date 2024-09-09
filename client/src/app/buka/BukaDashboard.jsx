import {
  HomeIcon,
  Settings,
  ShoppingBag,
  ShoppingCartIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function BukaDashboard() {
  const path = useLocation();
  return (
    <div className="hidden border-r bg-muted/40 md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to="/buka/dashboard"
              className={
                path == "/buka/dashboard"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/buka/shop"
              className={
                path == "/buka/shop"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Link>
            <Link
              to="/buka/orders"
              className={
                path == "/buka/orders"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Orders
            </Link>
            <Link
              to="/buka/profile"
              className={
                path == "/buka/profile"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <Settings className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4"></div>
      </div>
    </div>
  );
}

export default BukaDashboard;
