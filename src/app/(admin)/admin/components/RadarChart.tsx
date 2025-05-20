'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth?: number;
      pointBackgroundColor?: string;
      pointBorderColor?: string;
      pointHoverBackgroundColor?: string;
      pointHoverBorderColor?: string;
    }>;
  };
  options?: any;
}

export function RadarChart({ data, options = {} }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Default options with dark mode support
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scale: {
        ticks: { beginAtZero: true, color: '#9CA3AF' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        pointLabels: { color: '#9CA3AF' },
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: { color: '#9CA3AF', padding: 20, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          padding: 10,
          cornerRadius: 4,
          displayColors: true
        }
      },
    };

    // Create new chart instance with merged options
    chartInstance.current = new ChartJS(ctx, {
      type: 'radar',
      data,
      options: { ...defaultOptions, ...options },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={chartRef}></canvas>;
}
