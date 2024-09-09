import { BadgeDollarSign, ChefHat, HomeIcon, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AdminDashboard() {
  const path = useLocation();
  return (
    <div className="hidden border-r bg-muted/40 md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to="/admin/dashboard"
              className={
                path == "/admin/dashboard"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={
                path == "/admin/users"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <User className="h-4 w-4" />
              Users
            </Link>
            <Link
              to="/admin/bukas"
              className={
                path == "/admin/bukas"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <ChefHat className="h-4 w-4" />
              Bukas
            </Link>
            <Link
              to="/admin/transaction"
              className={
                path == "/admin/transaction"
                  ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              }
            >
              <BadgeDollarSign className="h-4 w-4" />
              Transactions
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4"></div>
      </div>
    </div>
  );
}

export default AdminDashboard;
