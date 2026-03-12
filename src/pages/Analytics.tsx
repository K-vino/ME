import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

export const Analytics: React.FC = () => {
  const { state } = useAppContext();
  const { skills, projects, tasks, roadmap } = state;

  const skillChartData = useMemo(() => {
    const sortedSkills = [...skills].sort((a, b) => b.progress - a.progress);
    return {
      labels: sortedSkills.map(s => s.name),
      datasets: [
        {
          label: 'Skill Proficiency (%)',
          data: sortedSkills.map(s => s.progress),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderRadius: 4,
        }
      ],
    };
  }, [skills]);

  const projectChartData = useMemo(() => {
    return {
      labels: projects.map(p => p.name),
      datasets: [
        {
          label: 'Project Completion (%)',
          data: projects.map(p => p.completionPercentage),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 4,
        }
      ],
    };
  }, [projects]);

  const taskCategoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    tasks.forEach(t => {
      if (t.completed) {
        categories[t.category] = (categories[t.category] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderWidth: 0,
        }
      ],
    };
  }, [tasks]);

  const roadmapProgressData = useMemo(() => {
    const labels = roadmap.map(r => r.title);
    const data = roadmap.map(phase => {
      const completed = phase.tasks.filter(t => t.completed).length;
      return phase.tasks.length > 0 ? (completed / phase.tasks.length) * 100 : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Phase Completion (%)',
          data,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ],
    };
  }, [roadmap]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Analytics</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Detailed insights into your career progression.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Skill Proficiency">
          <div className="h-72">
            <Bar data={skillChartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Project Completion">
          <div className="h-72">
            <Bar data={projectChartData} options={chartOptions} />
          </div>
        </Card>

        <Card title="Completed Tasks by Category">
          <div className="h-72 flex items-center justify-center">
            {Object.keys(taskCategoryData.labels).length > 0 ? (
              <Doughnut data={taskCategoryData} options={doughnutOptions} />
            ) : (
              <p className="text-zinc-500 italic">No completed tasks yet.</p>
            )}
          </div>
        </Card>

        <Card title="Roadmap Phase Progress">
          <div className="h-72">
            <Line data={roadmapProgressData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};
