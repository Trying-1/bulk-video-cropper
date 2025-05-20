'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-chart-matrix';

interface HeatmapChartProps {
  data: {
    datasets: Array<{
      label: string;
      data: Array<{
        x: number;
        y: number;
        v: number; // value determining color intensity
      }>;
      backgroundColor: (ctx: any) => string;
      borderColor?: string;
      borderWidth?: number;
      width?: number;
      height?: number;
    }>;
  };
  options?: any;
}

export function HeatmapChart({ data, options = {} }: HeatmapChartProps) {
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

    // Default options with dark mode support
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function() {
              return '';
            },
            label: function(context: any) {
              const data = context.dataset.data[context.dataIndex];
              const v = data.v;
              const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const hourLabels = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 
                               '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
              
              return [`Day: ${dayLabels[data.y]}`, 
                      `Hour: ${hourLabels[data.x]}`, 
                      `Value: ${v}`];
            }
          },
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          padding: 10,
          cornerRadius: 4,
          displayColors: false
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 23,
          ticks: {
            stepSize: 1,
            color: '#9CA3AF',
            callback: (value: number) => {
              const hourLabels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', 
                               '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
              return hourLabels[value];
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear',
          min: 0,
          max: 6,
          ticks: {
            stepSize: 1,
            color: '#9CA3AF',
            callback: (value: number) => {
              const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              return dayLabels[value];
            }
          },
          grid: {
            display: false
          }
        }
      }
    };

    // Create new chart instance with merged options
    chartInstance.current = new Chart(ctx, {
      type: 'matrix',
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
