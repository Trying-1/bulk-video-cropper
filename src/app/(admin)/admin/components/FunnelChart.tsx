'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface FunnelChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }>;
    title?: string;
  };
}

export function FunnelChart({ data }: FunnelChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // We'll use a bar chart to simulate a funnel
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].backgroundColor,
          borderColor: data.datasets[0].borderColor || 'rgba(0, 0, 0, 0)',
          borderWidth: data.datasets[0].borderWidth || 1,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: !!data.title,
            text: data.title || '',
            color: '#9CA3AF',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                const total = data.datasets[0].data[0];
                const percentage = Math.round((value / total) * 100);
                return `${value.toLocaleString()} (${percentage}% of total)`;
              }
            },
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            padding: 10,
            cornerRadius: 4,
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#9CA3AF',
              callback: function(value) {
                if (typeof value === 'number' && value >= 1000) {
                  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                return value;
              }
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#9CA3AF',
            }
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
}
