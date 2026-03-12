import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, ProgressBar } from '../components/UI';
import { 
  Calculator, 
  Activity, 
  Utensils, 
  Droplets, 
  Moon, 
  Zap, 
  Scale, 
  Plus, 
  Trash2, 
  TrendingDown,
  Info,
  Save,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { FOOD_DB, MET_VALUES, evaluateCustomFormula } from '../utils/formulaEngine';

export const SmartTracker: React.FC = () => {
  const { state, updateNutrition, updateHealthMetrics, addCustomFormula, deleteCustomFormula } = useAppContext();
  const { nutritionData, healthMetrics, userProfile, formulaConfig } = state;

  const [newFormula, setNewFormula] = useState({ name: '', expression: '', description: '' });

  const handleNutritionChange = (field: 'rice_g' | 'wheat_g', value: string) => {
    const numValue = parseFloat(value) || 0;
    updateNutrition({ [field]: numValue });
  };

  const handleMetricChange = (field: string, value: string | number) => {
    updateHealthMetrics({ [field]: value });
  };

  const handleAddFormula = () => {
    if (!newFormula.name || !newFormula.expression) return;
    addCustomFormula({
      id: Date.now().toString(),
      ...newFormula
    });
    setNewFormula({ name: '', expression: '', description: '' });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Smart Formula Engine</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real-time calculations for your health and productivity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutrition Calculator */}
        <Card title="Smart Nutrition Calculator" icon={<Utensils size={20} className="text-emerald-500" />}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Rice (grams)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                  value={nutritionData.rice_g || ''}
                  onChange={(e) => handleNutritionChange('rice_g', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Wheat (grams)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                  value={nutritionData.wheat_g || ''}
                  onChange={(e) => handleNutritionChange('wheat_g', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Calories</p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{nutritionData.totalCalories}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Carbs</p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{nutritionData.totalCarbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Protein</p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{nutritionData.totalProtein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Fat</p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{nutritionData.totalFat}g</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-xs text-zinc-500">
              <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
              <p>Values are calculated using standard nutritional data: Rice (130 kcal/100g), Wheat (340 kcal/100g).</p>
            </div>
          </div>
        </Card>

        {/* Health Metrics Engine */}
        <Card title="Health Metrics Engine" icon={<Activity size={20} className="text-indigo-500" />}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Current Weight (kg)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                  value={healthMetrics.currentWeight || ''}
                  onChange={(e) => handleMetricChange('currentWeight', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Daily Steps</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                  value={healthMetrics.steps || ''}
                  onChange={(e) => handleMetricChange('steps', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Water Intake (ml)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                  value={healthMetrics.waterIntake || ''}
                  onChange={(e) => handleMetricChange('waterIntake', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Sleep Hours</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                  value={healthMetrics.sleepHours || ''}
                  onChange={(e) => handleMetricChange('sleepHours', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Weight Progress</span>
                  <span className="text-sm font-black text-indigo-600">{healthMetrics.weightProgress}%</span>
                </div>
                <ProgressBar progress={healthMetrics.weightProgress} color="bg-indigo-600" />
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Water Progress</span>
                  <span className="text-sm font-black text-blue-500">{healthMetrics.waterProgress}%</span>
                </div>
                <ProgressBar progress={healthMetrics.waterProgress} color="bg-blue-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Real-time Dashboard Preview */}
        <Card title="Real-time Calculated Insights" icon={<Zap size={20} className="text-yellow-500" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Calorie Balance</p>
              <p className={`text-3xl font-black ${healthMetrics.calorieBalance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {healthMetrics.calorieBalance > 0 ? '+' : ''}{healthMetrics.calorieBalance}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Consumed - Burned</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Calories Burned</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white">{healthMetrics.caloriesBurned}</p>
              <p className="text-xs text-zinc-500 mt-1">Exercise + Steps</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Sleep Score</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white">{healthMetrics.sleepScore}%</p>
              <p className="text-xs text-zinc-500 mt-1">Based on 8hr target</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Daily Target Weight</p>
              <p className="text-3xl font-black text-indigo-600">72.4 <span className="text-sm font-normal text-zinc-400">kg</span></p>
              <p className="text-xs text-zinc-500 mt-1">Linear progression goal</p>
            </div>
          </div>
        </Card>

        {/* Custom Formula Engine */}
        <Card title="Custom Formula Engine" icon={<Calculator size={20} className="text-purple-500" />}>
          <div className="space-y-6">
            <div className="space-y-4">
              {formulaConfig.customFormulas.map(formula => {
                const result = evaluateCustomFormula(formula.expression, { weight: healthMetrics.currentWeight });
                return (
                  <div key={formula.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{formula.name}</h4>
                      <p className="text-xs text-zinc-500">{formula.expression} = <span className="font-bold text-purple-600">{result}</span></p>
                    </div>
                    <button onClick={() => deleteCustomFormula(formula.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Add Custom Formula</h4>
              <div className="space-y-3">
                <input 
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  placeholder="Formula Name (e.g. Protein Goal)"
                  value={newFormula.name}
                  onChange={e => setNewFormula({...newFormula, name: e.target.value})}
                />
                <input 
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  placeholder="Expression (e.g. weight * 1.6)"
                  value={newFormula.expression}
                  onChange={e => setNewFormula({...newFormula, expression: e.target.value})}
                />
                <button 
                  onClick={handleAddFormula}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Save Formula
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
