import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, UTCTimestamp, AreaSeries } from 'lightweight-charts';

interface ChartProps {
  data: { time: string; value: number }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const StockChart = ({ data, colors = {} }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  const {
    backgroundColor = '#151518',
    lineColor = '#3B82F6',
    textColor = '#A1A1AA',
    areaTopColor = 'rgba(59, 130, 246, 0.4)',
    areaBottomColor = 'rgba(59, 130, 246, 0.0)',
  } = colors;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor === 'transparent' ? '#050505' : backgroundColor },
        textColor,
        fontFamily: 'JetBrains Mono',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
    });

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: '#2563EB',
      topColor: 'rgba(37, 99, 235, 0.2)',
      bottomColor: 'rgba(37, 99, 235, 0)',
      lineWidth: 2,
    });

    const formattedData = data
      .map(item => ({
        time: (new Date(item.time).getTime() / 1000) as UTCTimestamp,
        value: item.value,
      }))
      .filter(item => !isNaN(item.value) && item.value !== null && item.time > 0);

    if (formattedData.length > 0) {
      newSeries.setData(formattedData);
      chart.timeScale().fitContent();
    }

    chartRef.current = chart;
    seriesRef.current = newSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full" id="stock-chart" />;
};
