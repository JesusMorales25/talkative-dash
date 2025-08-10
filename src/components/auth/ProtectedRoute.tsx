import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldOff } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <ShieldOff className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos suficientes para acceder a esta sección.
            Se requiere uno de los siguientes roles: {requiredRoles.join(', ')}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}