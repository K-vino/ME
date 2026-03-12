import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, parseISO } from 'date-fns';

export const Analytics: React.FC = () => {
  const { state } = useAppContext();
  const { dailyData, habits, tasks } = state;

  const today = new Date().toISOString().split('T')[0];
  
  // Last 30 days data
  const last30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = subDays(new Date(today), 29 - i);
      return format(d, 'yyyy-MM-dd');
    });
  }, [today]);

  const weightChartData = useMemo(() => ({
    labels: last30Days.map(d => format(parseISO(d), 'MMM dd')),
    datasets: [
      {
        label: 'Actual Weight',
        data: last30Days.map(d => dailyData[d]?.actualWeight || null),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        spanGaps: true,
      },
      {
        label: 'Target Weight',
        data: last30Days.map(d => dailyData[d]?.targetWeight || null),
        borderColor: 'rgb(203, 213, 225)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      }
    ],
  }), [last30Days, dailyData]);

  const studyChartData = useMemo(() => ({
    labels: last30Days.map(d => format(parseISO(d), 'MMM dd')),
    datasets: [
      {
        label: 'Study Hours',
        data: last30Days.map(d => dailyData[d]?.studyHours || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
      }
    ],
  }), [last30Days, dailyData]);

  const habitChartData = useMemo(() => {
    const habitCompletionByDay = last30Days.map(date => {
      let completed = 0;
      habits.forEach(h => {
        if (h.completedDates.includes(date)) completed++;
      });
      return habits.length > 0 ? (completed / habits.length) * 100 : 0;
    });

    return {
      labels: last30Days.map(d => format(parseISO(d), 'MMM dd')),
      datasets: [
        {
          label: 'Habit Completion %',
          data: habitCompletionByDay,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ],
    };
  }, [last30Days, habits]);

  const taskChartData = useMemo(() => {
    const taskCompletionByDay = last30Days.map(date => {
      const dayTasks = tasks.filter(t => t.date === date);
      const completed = dayTasks.filter(t => t.completed).length;
      return dayTasks.length > 0 ? (completed / dayTasks.length) * 100 : 0;
    });

    return {
      labels: last30Days.map(d => format(parseISO(d), 'MMM dd')),
      datasets: [
        {
          label: 'Task Completion %',
          data: taskCompletionByDay,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderRadius: 4,
        }
      ],
    };
  }, [last30Days, tasks]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const weightOptions = {
    ...chartOptions,
    scales: {
      y: { 
        beginAtZero: false,
        suggestedMin: state.userProfile.targetWeight - 5,
        suggestedMax: state.userProfile.startingWeight + 5
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Detailed insights into your 30-day performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weight Progress (Last 30 Days)">
          <div className="h-72">
            <Line data={weightChartData} options={weightOptions} />
          </div>
        </Card>

        <Card title="Habit Completion Rate (%)">
          <div className="h-72">
            <Line data={habitChartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Study Hours">
          <div className="h-72">
            <Bar data={studyChartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Task Completion Rate (%)">
          <div className="h-72">
            <Bar data={taskChartData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};
