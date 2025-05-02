// components/LevelChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LevelChartProps {
  data: { year: string; level: string; count: number }[];
}

export function LevelChart({ data }: LevelChartProps) {
  // Transform data to group by year
  const years = Array.from(new Set(data.map(item => item.year)));
  const levels = Array.from(new Set(data.map(item => item.level)));

  const chartData = years.map(year => {
    const yearData: { [key: string]: any } = { year };
    levels.forEach(level => {
      const item = data.find(d => d.year === year && d.level === level);
      yearData[level] = item ? item.count : 0;
    });
    return yearData;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        {levels.map((level, index) => (
          <Bar key={level} dataKey={level} fill={`hsl(${index * 60}, 70%, 50%)`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
