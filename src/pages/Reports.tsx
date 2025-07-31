import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Download, FileSpreadsheet, TrendingUp, Users, MessageSquare, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data para el gráfico de líneas
const messageData = [
  { date: "2024-01-15", messages: 145 },
  { date: "2024-01-16", messages: 168 },
  { date: "2024-01-17", messages: 132 },
  { date: "2024-01-18", messages: 189 },
  { date: "2024-01-19", messages: 201 },
  { date: "2024-01-20", messages: 156 },
  { date: "2024-01-21", messages: 98 },
  { date: "2024-01-22", messages: 178 },
  { date: "2024-01-23", messages: 195 },
  { date: "2024-01-24", messages: 223 },
];

// Mock data para métricas por agente
const agentMetrics = [
  {
    id: 1,
    name: "Ana García",
    avatar: "AG",
    totalConversations: 156,
    responseRate: 98.5,
    avgResponseTime: "2m 15s",
    status: "active",
    satisfaction: 4.8
  },
  {
    id: 2,
    name: "Carlos López",
    avatar: "CL",
    totalConversations: 142,
    responseRate: 96.2,
    avgResponseTime: "3m 42s",
    status: "active",
    satisfaction: 4.6
  },
  {
    id: 3,
    name: "María Rodríguez",
    avatar: "MR",
    totalConversations: 189,
    responseRate: 99.1,
    avgResponseTime: "1m 58s",
    status: "active",
    satisfaction: 4.9
  },
  {
    id: 4,
    name: "Luis Hernández",
    avatar: "LH",
    totalConversations: 98,
    responseRate: 94.8,
    avgResponseTime: "4m 12s",
    status: "inactive",
    satisfaction: 4.3
  },
  {
    id: 5,
    name: "Sofia Martínez",
    avatar: "SM",
    totalConversations: 167,
    responseRate: 97.8,
    avgResponseTime: "2m 45s",
    status: "active",
    satisfaction: 4.7
  }
];

const Reports = () => {
  const [dateFrom, setDateFrom] = useState("2024-01-15");
  const [dateTo, setDateTo] = useState("2024-01-24");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [conversationStatus, setConversationStatus] = useState("all");

  const handleExportPDF = () => {
    console.log("Exportando a PDF...");
    // Aquí iría la lógica para exportar a PDF
  };

  const handleExportExcel = () => {
    console.log("Exportando a Excel...");
    // Aquí iría la lógica para exportar a Excel
  };

  // Cálculo de métricas totales
  const totalConversations = agentMetrics.reduce((sum, agent) => sum + agent.totalConversations, 0);
  const avgResponseRate = agentMetrics.reduce((sum, agent) => sum + agent.responseRate, 0) / agentMetrics.length;
  const totalMessages = messageData.reduce((sum, day) => sum + day.messages, 0);
  const activeAgents = agentMetrics.filter(agent => agent.status === "active").length;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reportes y Métricas</h1>
            <p className="text-muted-foreground">
              Análisis de rendimiento del equipo de soporte
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de inicio</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de fin</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agente</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar agente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los agentes</SelectItem>
                    {agentMetrics.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={conversationStatus} onValueChange={setConversationStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado de conversación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="resolved">Resueltas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalConversations}</p>
                  <p className="text-sm text-muted-foreground">Total Conversaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{avgResponseRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Tasa de Respuesta Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalMessages}</p>
                  <p className="text-sm text-muted-foreground">Mensajes Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{activeAgents}</p>
                  <p className="text-sm text-muted-foreground">Agentes Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de mensajes por día */}
        <Card>
          <CardHeader>
            <CardTitle>Mensajes Enviados por Día</CardTitle>
            <CardDescription>
              Volumen de mensajes durante el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('es-ES')}
                    formatter={(value) => [value, 'Mensajes']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="messages" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de métricas por agente */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas por Agente</CardTitle>
            <CardDescription>
              Rendimiento detallado de cada miembro del equipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total Conversaciones</TableHead>
                    <TableHead>Tasa de Respuesta</TableHead>
                    <TableHead>Tiempo Promedio</TableHead>
                    <TableHead>Satisfacción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentMetrics.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                            {agent.avatar}
                          </div>
                          <span className="font-medium">{agent.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={agent.status === "active" ? "default" : "secondary"}
                          className={agent.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {agent.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {agent.totalConversations}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{agent.responseRate}%</span>
                          {agent.responseRate >= 97 && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{agent.avgResponseTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{agent.satisfaction}/5</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-xs ${i < Math.floor(agent.satisfaction) ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Reports;