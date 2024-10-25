import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { format, parseISO } from 'date-fns';

// 스케일 및 플러그인 등록
ChartJS.register(...registerables);

const Chart = ({ labels, data, data2, label, label2 }) => {
  const formattedLabels = labels.map((date) => format(parseISO(date), 'MM-dd'));

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label,
        data,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      },
      ...(data2
        ? [
            {
              label: label2,
              data: data2,
              fill: false,
              borderColor: 'rgba(255,99,132,1)',
              tension: 0.1,
              borderWidth: 2,
              pointBackgroundColor: 'rgba(255,99,132,1)',
            },
          ]
        : []),
    ],
  };

  const options = {
    maintainAspectRatio: false, // 부모 컨테이너에 맞게 조정
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          font: { size: 16 },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: '측정값',
          font: { size: 16 },
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;
