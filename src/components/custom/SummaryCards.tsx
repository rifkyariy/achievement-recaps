// components/SummaryCards.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
  totalYear: number;
  totalMonth: number;
}

export function SummaryCards({ totalYear, totalMonth }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Achievements This Year</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalYear}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Achievements This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalMonth}</p>
        </CardContent>
      </Card>
    </div>
  );
}
