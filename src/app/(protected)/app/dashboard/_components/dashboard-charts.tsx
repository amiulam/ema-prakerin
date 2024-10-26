"use client";

import React from "react";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { ChartData } from "@/lib/constant";

type DashboardChartsProps = {
  data: ChartData[];
};

export function DashboardCharts({ data }: DashboardChartsProps) {
  const chartConfig = {
    pendaftaran: {
      label: "Pendaftaran",
      color: "hsl(var(--chart-1))",
    },
    peserta: {
      label: "Peserta",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Pendaftaran</CardTitle>
        <CardDescription>Oktober - Desember 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bulan"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="peserta"
              name="peserta"
              fill={chartConfig.peserta.color}
              radius={4}
            />
            <Bar
              dataKey="pendaftaran"
              name="pendaftaran"
              fill={chartConfig.pendaftaran.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month{" "}
          <ArrowTrendingUpIcon className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total pendaftaran for the last 3 months
        </div>
      </CardFooter>
    </Card>
  );
}
