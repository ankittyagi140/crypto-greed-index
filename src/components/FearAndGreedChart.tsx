'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartOptions,
  TooltipItem,
  TooltipModel,
  BarController,
  LineController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { format } from 'date-fns';
import Image from 'next/image';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface FearGreedData {
  timestamp: string;
  value: number;
  value_classification: string;
}

interface BTCData {
  timestamp: string;
  price: number;
}

interface ChartData {
  fearGreed: FearGreedData[];
  btcPrice: BTCData[];
  timeRange?: {
    start: string;
    end: string;
  };
}

// interface TooltipContext {
//   datasetIndex: number;
//   raw: number;
//   label: string;
// }

// interface ChartProps {
//   data: ChartData;
//   height?: number;
// }

// interface ChartConfig {
//   chartHeight: number;
//   barSize: number;
//   fontSize: number;
//   legendPosition: 'bottom' | 'center';
//   tickGap: number;
//   yAxisWidth: number;
// }

// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: Array<{
//     value: number;
//     dataKey: string;
//     payload: {
//       timestamp: string;
//       value: number;
//       price?: number;
//     };
//   }>;
//   label?: string;
// }

// const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
//   if (!active || !payload || !payload.length) return null;

//   const data = payload[0].payload;
//   return (
//     <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
//       <p className="text-gray-500 dark:text-gray-400">
//         {new Date(label || '').toLocaleDateString()}
//       </p>
//       <p className="text-gray-900 dark:text-gray-100 font-medium">
//         Value: {data.value}
//       </p>
//       {data.price && (
//         <p className="text-gray-900 dark:text-gray-100 font-medium">
//           Price: ${data.price.toLocaleString()}
//         </p>
//       )}
//     </div>
//   );
// };

const LoadingSpinner = () => (
  <div className="w-full min-h-[300px] sm:min-h-[400px] bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 animate-pulse">
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="w-full min-h-[300px] sm:min-h-[400px] bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-4 flex items-center justify-center">
    <p className="text-red-500">Error: {message}</p>
  </div>
);

const FearAndGreedChart = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fear-and-greed');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: ChartData = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  // Sort data in ascending order by date
  const sortedFearGreed = [...data.fearGreed].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const sortedBtcPrice = [...data.btcPrice].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const chartDataForChartJS = {
    labels: sortedFearGreed.map(d => format(new Date(d.timestamp), 'MMM d, yyyy')),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Fear & Greed Index',
        data: sortedFearGreed.map(d => d.value),
        backgroundColor: sortedFearGreed.map(d => {
          const value = d.value;
          if (value <= 25) return 'rgba(239, 68, 68, 0.8)'; // Extreme Fear
          if (value <= 45) return 'rgba(245, 158, 11, 0.8)'; // Fear
          if (value <= 55) return 'rgba(234, 179, 8, 0.8)'; // Neutral
          if (value <= 75) return 'rgba(132, 204, 22, 0.8)'; // Greed
          return 'rgba(34, 197, 94, 0.8)'; // Extreme Greed
        }),
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'BTC Price',
        data: sortedBtcPrice.map(d => d.price),
        borderColor: '#F7931A',
        backgroundColor: '#F7931A',
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: window.innerWidth < 640 ? 6 : 12,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Fear & Greed Index',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'BTC Price (USD)',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          callback: function(tickValue: number | string) {
            const value = Number(tickValue);
            if (value >= 1000) {
              return `$${(value / 1000).toFixed(0)}k`;
            }
            return `$${value}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          boxWidth: window.innerWidth < 640 ? 12 : 16,
          padding: window.innerWidth < 640 ? 8 : 10,
        },
      },
      title: {
        display: true,
        text: [
          data.timeRange ? 
            `${format(new Date(data.timeRange.start), 'MMM d, yyyy')} - ${format(new Date(data.timeRange.end), 'MMM d, yyyy')}` :
            ''
        ],
        font: {
          size: window.innerWidth < 640 ? 12 : 14,
        },
        padding: window.innerWidth < 640 ? 8 : 10,
      },
      tooltip: {
        callbacks: {
          label: function(this: TooltipModel<'bar' | 'line'>, tooltipItem: TooltipItem<'bar' | 'line'>) {
            if (tooltipItem.datasetIndex === 0) {
              const value = tooltipItem.raw as number;
              let classification = '';
              if (value <= 25) classification = 'Extreme Fear';
              else if (value <= 45) classification = 'Fear';
              else if (value <= 55) classification = 'Neutral';
              else if (value <= 75) classification = 'Greed';
              else classification = 'Extreme Greed';
              return `Fear & Greed: ${value} (${classification})`;
            } else {
              return `BTC Price: $${(tooltipItem.raw as number).toLocaleString()}`;
            }
          },
        },
        titleFont: {
          size: window.innerWidth < 640 ? 10 : 12,
        },
        bodyFont: {
          size: window.innerWidth < 640 ? 10 : 12,
        },
      },
    },
  };

  return (
    <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-2 mb-2 sm:mb-4 justify-center">
        <Image src="/bitcoin.svg" alt="Bitcoin" className="w-5 h-5 sm:w-6 sm:h-6" height={24} width={24}/>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">BTC Fear & Greed Index vs Price</h2>
      </div>
      <div className="w-full h-[300px] sm:h-[400px]">
        <Chart type="bar" data={chartDataForChartJS} options={options} />
      </div>
    </div>
  );
};

export default FearAndGreedChart; 