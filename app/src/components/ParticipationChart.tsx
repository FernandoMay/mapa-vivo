import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ParticipationChartProps {
  data: any[];
  title: string;
  stateFilter?: string;
}

export const ParticipationChart: React.FC<ParticipationChartProps> = ({ data, title, stateFilter }) => {
  // Filter data based on selected state
  const filteredData = stateFilter 
    ? data.filter(item => item.Nombre === stateFilter) 
    : data;

  const options = {
    title: { text: title, left: 'center', textStyle: { color: '#333', fontSize: 18 } },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { top: 60, left: '3%', right: '4%', bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: [...new Set(filteredData.map(item => item.year))].sort(),
      name: 'Año'
    },
    yAxis: {
      type: 'value',
      name: 'Porcentaje',
      axisLabel: { formatter: '{value}%' },
      min: 0,
      max: 100
    },
    series: [
      {
        name: 'Participación',
        type: 'line',
        data: filteredData.map(item => (item.pct_Participación || 0) * 100), 
        smooth: true,
        itemStyle: { color: '#2563eb' },
        lineStyle: { width: 4 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0)' }
            ]
          }
        }
      }
    ]
  };

  return <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />;
};
