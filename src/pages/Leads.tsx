import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Phone } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: "nuevo" | "contactado" | "cerrado";
  createdAt: string;
  assignedAgent: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "María García",
    phone: "+52 55 1234 5678",
    status: "nuevo",
    createdAt: "2024-01-15",
    assignedAgent: "Juan Pérez"
  },
  {
    id: "2",
    name: "Carlos López",
    phone: "+52 55 9876 5432",
    status: "contactado",
    createdAt: "2024-01-14",
    assignedAgent: "Ana Ruiz"
  },
  {
    id: "3",
    name: "Laura Martínez",
    phone: "+52 55 5555 1234",
    status: "cerrado",
    createdAt: "2024-01-13",
    assignedAgent: "Pedro Sánchez"
  },
  {
    id: "4",
    name: "Roberto Silva",
    phone: "+52 55 7777 8888",
    status: "nuevo",
    createdAt: "2024-01-12",
    assignedAgent: "Juan Pérez"
  },
  {
    id: "5",
    name: "Andrea Torres",
    phone: "+52 55 3333 9999",
    status: "contactado",
    createdAt: "2024-01-11",
    assignedAgent: "Ana Ruiz"
  }
];

const statusColors = {
  nuevo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  contactado: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  cerrado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
};

const statusLabels = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cerrado: "Cerrado"
};

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [leads] = useState<Lead[]>(mockLeads);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestión de Leads</h1>
            <p className="text-muted-foreground">Administra y da seguimiento a tus leads de WhatsApp</p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="nuevo">Nuevo</SelectItem>
              <SelectItem value="contactado">Contactado</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-primary">
              {leads.filter(lead => lead.status === "nuevo").length}
            </div>
            <div className="text-sm text-muted-foreground">Leads Nuevos</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-warning">
              {leads.filter(lead => lead.status === "contactado").length}
            </div>
            <div className="text-sm text-muted-foreground">En Proceso</div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="text-2xl font-bold text-success">
              {leads.filter(lead => lead.status === "cerrado").length}
            </div>
            <div className="text-sm text-muted-foreground">Cerrados</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="hidden lg:table-cell">Agente</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div>{lead.name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {lead.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>
                        {statusLabels[lead.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {lead.assignedAgent}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron leads que coincidan con los filtros.
            </div>
          )}
        </div>
    </div>
  );
}