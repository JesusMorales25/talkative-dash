import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldOff } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Acceso no autorizado</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
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