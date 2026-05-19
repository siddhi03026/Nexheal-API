import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function HealthRing({ value = 98.6 }: { value?: number }) {
  const data = [
    { name: "ok", v: value },
    { name: "rest", v: 100 - value },
  ];
  return (
    <div className="relative h-[180px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.21 285)" />
              <stop offset="100%" stopColor="oklch(0.83 0.16 210)" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            innerRadius={62}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="v"
            stroke="none"
          >
            <Cell fill="url(#ring)" />
            <Cell fill="oklch(1 0 0 / 0.06)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-semibold tracking-tight">{value}%</div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
            Healthy
          </div>
        </div>
      </div>
    </div>
  );
}
