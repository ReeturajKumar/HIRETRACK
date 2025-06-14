'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';

export default function OverviewBarChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const { theme } = useTheme();

  // Define light/dark theme styles
  const isDark = theme === 'dark';

  return (
     <div style={{ width: '100%', height: 290 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#444' : '#ccc'} />
          <XAxis
            dataKey="name"
            stroke={isDark ? '#aaa' : '#333'}
            tick={{ fill: isDark ? '#aaa' : '#333' }}
          />
          <YAxis
            stroke={isDark ? '#aaa' : '#333'}
            tick={{ fill: isDark ? '#aaa' : '#333' }}
          />
          <Tooltip
          cursor={{ fill: 'transparent' }} 
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              borderColor: isDark ? '#374151' : '#ddd',
              color: isDark ? '#f9fafb' : '#111',
            }}
            labelStyle={{
              color: isDark ? '#e5e7eb' : '#111',
            }}
            itemStyle={{
              color: isDark ? '#e5e7eb' : '#111',
            }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
