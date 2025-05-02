// components/CategoryChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryChartProps {
  data: { year: string; category: string; count: number }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  // Transform data to group by year
  const years = Array.from(new Set(data.map(item => item.year)));
  const categories = Array.from(new Set(data.map(item => item.category)));

  const chartData = years.map(year => {
    const yearData: { [key: string]: any } = { year };
    categories.forEach(category => {
      const item = data.find(d => d.year === year && d.category === category);
      yearData[category] = item ? item.count : 0;
    });
    return yearData;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        {categories.map((category, index) => (
          <Bar key={category} dataKey={category} fill={`hsl(${index * 60}, 70%, 50%)`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
