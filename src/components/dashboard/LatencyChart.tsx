import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  p50: 80 + Math.round(Math.sin(i / 2) * 20 + Math.random() * 25),
  p95: 180 + Math.round(Math.cos(i / 3) * 40 + Math.random() * 50),
}));

export function LatencyChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="p50" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.21 285)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="oklch(0.62 0.21 285)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="p95" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.83 0.16 210)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="oklch(0.83 0.16 210)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
        <XAxis dataKey="time" stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="oklch(0.72 0.03 250)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            background: "oklch(0.21 0.045 268)",
            border: "1px solid oklch(1 0 0 / 0.1)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Area type="monotone" dataKey="p50" stroke="oklch(0.62 0.21 285)" strokeWidth={2} fill="url(#p50)" />
        <Area type="monotone" dataKey="p95" stroke="oklch(0.83 0.16 210)" strokeWidth={2} fill="url(#p95)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
