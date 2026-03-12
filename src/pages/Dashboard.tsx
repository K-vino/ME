import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { 
  Scale, 
  Target, 
  TrendingDown, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Clock,
  Zap,
  Utensils,
  Droplets
} from 'lucide-react';
import { motion } from 'motion/react';
import { calculatePerformanceScore, calculateHabitRate, calculateTaskCompletion, calculateSleepScore, calculateStudyConsistency } from '../utils/formulaEngine';

export const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { userProfile, dailyData, habits, education, goals, tasks, healthMetrics, nutritionData, learningSessions, careerGoals, skills, careerTasks } = state;

  const today = new Date().toISOString().split('T')[0];
  const habitRate = calculateHabitRate(habits, today);
  const taskRate = calculateTaskCompletion(tasks);
  const sleepScore = calculateSleepScore(healthMetrics.sleepHours);
  const studyScore = calculateStudyConsistency(learningSessions);
  const performanceScore = calculatePerformanceScore(habitRate, taskRate, sleepScore, studyScore);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  const careerGoalProgress = careerGoals.length > 0 
    ? Math.round(careerGoals.reduce((acc, g) => acc + g.progress, 0) / careerGoals.length) 
    : 0;
  
  const totalLearningMinutes = learningSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalLearningHours = (totalLearningMinutes / 60).toFixed(1);

  const stats = [
    { 
      label: 'Performance Score', 
      value: `${performanceScore}%`, 
      icon: Zap, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50 dark:bg-yellow-500/10' 
    },
    { 
      label: 'Career Goal Progress', 
      value: `${careerGoalProgress}%`, 
      icon: Target, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10' 
    },
    { 
      label: 'Learning Hours', 
      value: `${totalLearningHours}h`, 
      icon: Clock, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10' 
    },
    { 
      label: 'Water Progress', 
      value: `${healthMetrics.waterProgress}%`, 
      icon: Droplets, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-500/10' 
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Welcome back, {userProfile.name}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Here's what's happening with your Life OS today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Today's Habits">
            <div className="space-y-4">
              {habits.length > 0 ? (
                habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${habit.completedDates.includes(new Date().toISOString().split('T')[0]) ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-200 text-zinc-500'}`}>
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{habit.name}</p>
                        <p className="text-xs text-zinc-500">{habit.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                      <Flame size={16} fill="currentColor" />
                      <span className="text-sm">{habit.streak}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">No habits tracked yet.</p>
              )}
            </div>
          </Card>

          <Card title="Learning Progress">
            <div className="space-y-6">
              {education.length > 0 ? (
                education.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-600" />
                        <span className="font-medium text-zinc-900 dark:text-white">{course.name}</span>
                      </div>
                      <span className="text-sm font-bold text-indigo-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">No courses added yet.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Tasks Summary">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-500/5 rounded-xl">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Clock size={20} />
                  <span className="font-medium">Pending</span>
                </div>
                <span className="text-xl font-bold text-indigo-700">{pendingTasks}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl">
                <div className="flex items-center gap-3 text-emerald-600">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">Completed</span>
                </div>
                <span className="text-xl font-bold text-emerald-700">{completedTasks}</span>
              </div>
            </div>
          </Card>

          <Card title="Active Career Goals">
            <div className="space-y-4">
              {careerGoals.filter(g => g.status === 'In Progress').slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-indigo-600" />
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{goal.name}</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 text-right">{goal.progress}% Complete</p>
                </div>
              ))}
              {careerGoals.length === 0 && <p className="text-zinc-500 text-xs text-center">No active career goals.</p>}
            </div>
          </Card>

          <Card title="Top Skills">
            <div className="space-y-4">
              {skills.sort((a, b) => b.proficiency - a.proficiency).slice(0, 4).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{skill.name}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">{skill.proficiency}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
