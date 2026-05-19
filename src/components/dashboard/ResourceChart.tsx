import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = Array.from({ length: 12 }, (_, i) => ({
  t: `${i * 5}m`,
  cpu: 35 + Math.round(Math.random() * 45),
  ram: 50 + Math.round(Math.random() * 35),
}));

export function ResourceChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
        <XAxis dataKey="t" stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
          contentStyle={{
            background: "oklch(0.21 0.045 268)",
            border: "1px solid oklch(1 0 0 / 0.1)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Bar dataKey="cpu" fill="oklch(0.62 0.21 285)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ram" fill="oklch(0.83 0.16 210)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
