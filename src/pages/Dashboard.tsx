import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, ProgressBar } from '../components/UI';
import { CheckSquare, FolderGit2, Code2, Map as MapIcon } from 'lucide-react';
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
  const { userProfile, skills, projects, tasks, roadmap } = state;

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  const totalRoadmapTasks = roadmap.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedRoadmapTasks = roadmap.reduce((acc, phase) => acc + phase.tasks.filter(t => t.completed).length, 0);
  const roadmapProgress = totalRoadmapTasks > 0 ? (completedRoadmapTasks / totalRoadmapTasks) * 100 : 0;

  const topSkills = [...skills].sort((a, b) => b.progress - a.progress).slice(0, 5);

  // Chart Data
  const skillChartData = {
    labels: topSkills.map(s => s.name),
    datasets: [
      {
        label: 'Skill Proficiency (%)',
        data: topSkills.map(s => s.progress),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      }
    ],
  };

  const projectStatusCounts = {
    'Completed': completedProjects,
    'In Progress': activeProjects,
    'Planning': projects.filter(p => p.status === 'Planning').length,
  };

  const projectChartData = {
    labels: Object.keys(projectStatusCounts),
    datasets: [
      {
        data: Object.values(projectStatusCounts),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(99, 102, 241, 0.8)', // Indigo
          'rgba(245, 158, 11, 0.8)', // Amber
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back, {userProfile.name}. Here's your career progress.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Roadmap Progress</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <MapIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{roadmapProgress.toFixed(0)}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">%</span>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-500 dark:text-zinc-400">Tasks: {completedRoadmapTasks}/{totalRoadmapTasks}</span>
            </div>
            <ProgressBar progress={roadmapProgress} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tasks Completed</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{completedTasks}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">/ {totalTasks}</span>
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
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Projects</h3>
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
              <FolderGit2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{activeProjects}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">ongoing</span>
          </div>
          <div className="mt-auto">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{completedProjects} projects completed</p>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Top Skills</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{skills.length}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">tracked</span>
          </div>
          <div className="mt-auto">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Keep up the learning!</p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Top Skills Proficiency">
          <div className="h-64">
            <Bar data={skillChartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Project Status">
          <div className="h-64 flex items-center justify-center relative">
            <Doughnut 
              data={projectChartData} 
              options={{
                cutout: '75%',
                plugins: { legend: { position: 'bottom' } },
                maintainAspectRatio: false,
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{projects.length}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Total</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

