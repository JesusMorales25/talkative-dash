import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: 'Nuevos', value: 35, color: 'hsl(var(--info))' },
  { name: 'En seguimiento', value: 42, color: 'hsl(var(--warning))' },
  { name: 'Calificados', value: 28, color: 'hsl(var(--success))' },
  { name: 'Cerrados', value: 15, color: 'hsl(var(--muted-foreground))' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value} leads ({((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export const LeadsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estados de los leads</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};