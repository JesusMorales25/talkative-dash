import { Users, MessageCircle, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ConversationsChart } from "@/components/ConversationsChart";
import { LeadsChart } from "@/components/LeadsChart";

export const Dashboard = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de actividad de tu plataforma WhatsApp CRM</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Leads nuevos"
          value={23}
          description="Desde ayer"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Conversaciones de hoy"
          value={47}
          description="En tiempo real"
          icon={MessageCircle}
          trend={{ value: 8.2, isPositive: true }}
          variant="info"
        />
        <StatCard
          title="Contactos registrados"
          value={234}
          description="Total acumulado"
          icon={TrendingUp}
          trend={{ value: 15.3, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Tiempo promedio de respuesta del bot"
          value="2.3 min"
          description="Últimas 24h"
          icon={Clock}
          trend={{ value: -15.2, isPositive: false }}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 lg:gap-6">
        <ConversationsChart />
        <LeadsChart />
      </div>
    </div>
  );
};