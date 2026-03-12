import { Habit, Task, LearningSession, NutritionData, HealthMetrics, UserProfile } from '../types';

// Food Database
export const FOOD_DB = {
  Rice: { calories: 130, carbs: 28, protein: 2.7, fat: 0.3 },
  Wheat: { calories: 340, carbs: 72, protein: 13, fat: 2.5 }
};

// MET Values
export const MET_VALUES = {
  Walking: 3.5,
  Running: 8,
  Cycling: 7
};

/**
 * Calculate nutrition values based on food weights
 */
export const calculateNutrition = (rice_g: number, wheat_g: number): Omit<NutritionData, 'rice_g' | 'wheat_g'> => {
  const riceFactor = rice_g / 100;
  const wheatFactor = wheat_g / 100;

  const totalCalories = (riceFactor * FOOD_DB.Rice.calories) + (wheatFactor * FOOD_DB.Wheat.calories);
  const totalCarbs = (riceFactor * FOOD_DB.Rice.carbs) + (wheatFactor * FOOD_DB.Wheat.carbs);
  const totalProtein = (riceFactor * FOOD_DB.Rice.protein) + (wheatFactor * FOOD_DB.Wheat.protein);
  const totalFat = (riceFactor * FOOD_DB.Rice.fat) + (wheatFactor * FOOD_DB.Wheat.fat);

  return {
    totalCalories: Number(totalCalories.toFixed(1)),
    totalCarbs: Number(totalCarbs.toFixed(1)),
    totalProtein: Number(totalProtein.toFixed(1)),
    totalFat: Number(totalFat.toFixed(1))
  };
};

/**
 * Calculate weight progress percentage
 */
export const calculateWeightProgress = (startWeight: number, currentWeight: number, targetWeight: number): number => {
  if (startWeight === targetWeight) return 100;
  const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
  return Math.max(0, Math.min(100, Number(progress.toFixed(1))));
};

/**
 * Calculate target weight for a specific day in the journey
 */
export const calculateTargetWeightForDay = (startWeight: number, targetWeight: number, totalDays: number, dayNumber: number): number => {
  const dailyWeightLoss = (startWeight - targetWeight) / totalDays;
  const targetForDay = startWeight - (dailyWeightLoss * dayNumber);
  return Number(targetForDay.toFixed(2));
};

/**
 * Calculate habit completion rate
 */
export const calculateHabitRate = (habits: Habit[], date: string): number => {
  if (habits.length === 0) return 0;
  const completed = habits.filter(h => h.completedDates.includes(date)).length;
  return Number(((completed / habits.length) * 100).toFixed(1));
};

/**
 * Calculate task completion productivity score
 */
export const calculateTaskCompletion = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Number(((completed / tasks.length) * 100).toFixed(1));
};

/**
 * Calculate water intake progress
 */
export const calculateWaterProgress = (currentMl: number, weightKg: number): number => {
  const recommendedMl = weightKg * 35;
  if (recommendedMl === 0) return 0;
  return Math.min(100, Number(((currentMl / recommendedMl) * 100).toFixed(1)));
};

/**
 * Calculate sleep score
 */
export const calculateSleepScore = (hours: number): number => {
  return Math.min(100, Number(((hours / 8) * 100).toFixed(1)));
};

/**
 * Calculate exercise calorie burn using MET formula
 */
export const calculateExerciseBurn = (type: keyof typeof MET_VALUES, weight: number, durationMinutes: number): number => {
  const met = MET_VALUES[type] || 3.5;
  const durationHours = durationMinutes / 60;
  const caloriesBurned = met * weight * durationHours;
  return Number(caloriesBurned.toFixed(1));
};

/**
 * Calculate estimated calories burned from steps
 */
export const calculateStepBurn = (steps: number): number => {
  return Number((steps * 0.04).toFixed(1));
};

/**
 * Calculate total study hours from sessions
 */
export const calculateStudyHours = (sessions: LearningSession[]): number => {
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  return Number((totalMinutes / 60).toFixed(1));
};

/**
 * Calculate study consistency score (days studied in last 7 days)
 */
export const calculateStudyConsistency = (sessions: LearningSession[]): number => {
  const uniqueDays = new Set(sessions.map(s => s.startTime.split('T')[0])).size;
  return Number(((uniqueDays / 7) * 100).toFixed(1));
};

/**
 * Calculate monthly performance score
 */
export const calculatePerformanceScore = (
  habitRate: number,
  taskRate: number,
  sleepScore: number,
  studyScore: number
): number => {
  return Number(((habitRate + taskRate + sleepScore + studyScore) / 4).toFixed(1));
};

/**
 * Dynamic Custom Formula Evaluator
 * Note: In a real app, use a safer math parser library.
 */
export const evaluateCustomFormula = (expression: string, variables: Record<string, number>): number => {
  try {
    // Basic replacement of variables
    let sanitized = expression;
    Object.entries(variables).forEach(([key, value]) => {
      sanitized = sanitized.replace(new RegExp(key, 'g'), value.toString());
    });
    
    // Simple evaluation (be careful with eval in production)
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    return Number(result.toFixed(2));
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 0;
  }
};
