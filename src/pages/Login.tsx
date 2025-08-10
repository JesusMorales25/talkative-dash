import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  remember: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { remember: false } });

  useEffect(() => {
    document.title = "Iniciar sesión | CRM";
  }, []);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password, values.remember);
      navigate(from, { replace: true });
    } catch (e: any) {
      setError(e?.message || "No se pudo iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
            <p className="text-muted-foreground">Inicia sesión para acceder al CRM</p>
          </header>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <Input id="email" type="email" placeholder="tu@empresa.com" className="pl-10" {...register("email")} />
              </div>
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox {...register("remember")} />
                Mantener sesión iniciada
              </label>
              {/* <a className="text-sm text-primary hover:underline" href="#">¿Olvidaste tu contraseña?</a> */}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {(isSubmitting || isLoading) && <Loader2 className="animate-spin" />}
              Iniciar sesión
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Consejo: configura tu API en localStorage con la clave <code>api_url</code> (p.ej. http://localhost:8080)
          </p>
        </div>
      </div>
    </div>
  );
}
