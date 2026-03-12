import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, ProgressBar } from '../components/UI';
import { Activity, CheckSquare, GraduationCap, Scale, Target, TrendingDown } from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
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
import { format, subDays } from 'date-fns';

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

export const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { userProfile, dailyData, tasks, habits } = state;

  const today = new Date().toISOString().split('T')[0];
  const todayData = dailyData[today] || dailyData[Object.keys(dailyData)[0]]; // Fallback to day 1 if today not found

  // Calculate metrics
  const currentWeight = todayData?.actualWeight || userProfile.startingWeight;
  const targetWeight = userProfile.targetWeight;
  const weightProgress = ((userProfile.startingWeight - currentWeight) / (userProfile.startingWeight - targetWeight)) * 100;
  
  const todayTasks = tasks.filter(t => t.date === today);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const taskProgress = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;

  const todayHabitsCompleted = habits.filter(h => h.completedDates.includes(today)).length;
  const habitProgress = habits.length > 0 ? (todayHabitsCompleted / habits.length) * 100 : 0;

  const studyHoursToday = todayData?.studyHours || 0;

  // Chart Data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(today), 6 - i);
    return format(d, 'yyyy-MM-dd');
  });

  const weightChartData = {
    labels: last7Days.map(d => format(new Date(d), 'MMM dd')),
    datasets: [
      {
        label: 'Actual Weight',
        data: last7Days.map(d => dailyData[d]?.actualWeight || null),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target Weight',
        data: last7Days.map(d => dailyData[d]?.targetWeight || null),
        borderColor: 'rgb(203, 213, 225)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      }
    ],
  };

  const activityChartData = {
    labels: last7Days.map(d => format(new Date(d), 'MMM dd')),
    datasets: [
      {
        label: 'Study Hours',
        data: last7Days.map(d => dailyData[d]?.studyHours || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Exercise (hrs)',
        data: last7Days.map(d => (dailyData[d]?.exerciseDuration || 0) / 60),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      }
    ],
  };

  const habitChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [todayHabitsCompleted, habits.length - todayHabitsCompleted],
        backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(226, 232, 240, 0.8)'],
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back, {userProfile.name}. Here's your progress.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Day {todayData?.dayNumber || 1} of {userProfile.goalDurationDays}</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">{format(new Date(today), 'EEEE, MMMM do, yyyy')}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Weight Progress</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{currentWeight}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">kg</span>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-500 dark:text-zinc-400">Target: {targetWeight} kg</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{Math.max(0, weightProgress).toFixed(1)}%</span>
            </div>
            <ProgressBar progress={weightProgress} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Today's Tasks</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{completedTasks}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">/ {todayTasks.length}</span>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-500 dark:text-zinc-400">Completion</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{taskProgress.toFixed(0)}%</span>
            </div>
            <ProgressBar progress={taskProgress} colorClass="bg-emerald-500" />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Habits</h3>
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{todayHabitsCompleted}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">/ {habits.length}</span>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-500 dark:text-zinc-400">Success Rate</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">{habitProgress.toFixed(0)}%</span>
            </div>
            <ProgressBar progress={habitProgress} colorClass="bg-amber-500" />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Study Hours</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{studyHoursToday}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">hrs</span>
          </div>
          <div className="mt-auto">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Keep up the good work!</p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Weight Trend (Last 7 Days)">
          <div className="h-64">
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Habit Completion Today">
          <div className="h-64 flex items-center justify-center relative">
            <Doughnut 
              data={habitChartData} 
              options={{
                cutout: '75%',
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{habitProgress.toFixed(0)}%</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Completed</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3" title="Weekly Activity (Study & Exercise)">
          <div className="h-64">
            <Bar data={activityChartData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};

