import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Analytics: React.FC = () => {
  const { state } = useAppContext();
  const { dailyData, userProfile, habits } = state;

  const sortedData = [...dailyData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const weightData = {
    labels: sortedData.map(d => d.date),
    datasets: [
      {
        label: 'Actual Weight',
        data: sortedData.map(d => d.actualWeight),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target Weight',
        data: sortedData.map(d => d.targetWeight),
        borderColor: 'rgba(244, 63, 94, 0.5)',
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      }
    ],
  };

  const activityData = {
    labels: sortedData.map(d => d.date),
    datasets: [
      {
        label: 'Steps',
        data: sortedData.map(d => d.steps),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderRadius: 4,
      }
    ],
  };

  const habitCompletionData = {
    labels: habits.map(h => h.name),
    datasets: [
      {
        label: 'Streak',
        data: habits.map(h => h.streak),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      }
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Weight Progress (kg)">
          <div className="h-80">
            <Line data={weightData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Daily Steps">
          <div className="h-80">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Habit Streaks">
          <div className="h-80 flex items-center justify-center">
            <Doughnut 
              data={habitCompletionData} 
              options={{
                ...chartOptions,
                cutout: '60%',
              }} 
            />
          </div>
        </Card>

        <Card title="Sleep vs Study (Last 7 Days)">
          <div className="h-80">
            <Line 
              data={{
                labels: sortedData.slice(-7).map(d => d.date),
                datasets: [
                  {
                    label: 'Sleep Hours',
                    data: sortedData.slice(-7).map(d => d.sleepHours),
                    borderColor: 'rgb(14, 165, 233)',
                    tension: 0.4,
                  },
                  {
                    label: 'Study Hours',
                    data: sortedData.slice(-7).map(d => d.studyHours),
                    borderColor: 'rgb(168, 85, 247)',
                    tension: 0.4,
                  }
                ]
              }} 
              options={chartOptions} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
