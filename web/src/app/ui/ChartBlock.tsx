'use client';

import React from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

export default function ChartBlock({ code }: { code: string }) {
  try {
    const config = JSON.parse(code);
    const { type, data, options } = config;

    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} height="300px"/>;
      case 'line':
        return <Line data={data} options={options} height="300px"/>;
      case 'pie':
        return <Pie data={data} options={options} height="300px"/>;
      case 'scatter':
        return <Scatter data={data} options={options} height="300px"/>;
      default:
        return <pre>Unsupported chart type: {type}</pre>;
    }
  } catch (err) {
    return <pre>Error rendering chart: {(err as Error).message}</pre>;
  }
}
