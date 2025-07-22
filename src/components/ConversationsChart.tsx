import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { day: 'Lun', conversations: 24 },
  { day: 'Mar', conversations: 32 },
  { day: 'Mié', conversations: 28 },
  { day: 'Jue', conversations: 45 },
  { day: 'Vie', conversations: 52 },
  { day: 'Sáb', conversations: 18 },
  { day: 'Dom', conversations: 12 },
];

export const ConversationsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversaciones por día</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="day" 
              className="text-muted-foreground" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-muted-foreground" 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="conversations" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};