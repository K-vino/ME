export const calculateTargetWeight = (
  startingWeight: number,
  targetWeight: number,
  goalDurationDays: number,
  dayNumber: number
): number => {
  if (dayNumber <= 0) return startingWeight;
  if (dayNumber >= goalDurationDays) return targetWeight;

  const totalWeightLoss = startingWeight - targetWeight;
  const dailyLossRate = totalWeightLoss / goalDurationDays;
  const currentTarget = startingWeight - dailyLossRate * dayNumber;

  return Number(currentTarget.toFixed(2));
};

export const getDayNumber = (startDate: string, currentDate: string): number => {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diffTime = Math.abs(current.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 is the start date
};
