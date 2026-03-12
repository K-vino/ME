import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, ProgressBar } from '../components/UI';
import { 
  User, 
  Briefcase, 
  Award, 
  Code, 
  Map as RoadmapIcon, 
  CheckSquare, 
  Clock, 
  Plus, 
  Trash2, 
  ExternalLink,
  Edit2,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  Star,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill, Certification, Project, Experience, CareerRoadmap, CareerTask, LearningSession, CareerProfile, CareerGoal } from '../types';

import { useNavigate } from 'react-router-dom';

export const CareerCenter: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateCareerProfile, addSkill, updateSkill, deleteSkill, addCertification, deleteCertification, addProject, deleteProject, addExperience, deleteExperience, addCareerTask, updateCareerTask, deleteCareerTask, addCareerGoal, updateCareerGoal, deleteCareerGoal, addLearningSession, deleteLearningSession } = useAppContext();
  const { careerProfile, skills, certifications, projects, experience, careerRoadmaps, careerTasks, careerGoals, learningSessions } = state;

  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'roadmap' | 'portfolio' | 'tasks' | 'goals' | 'sessions'>('profile');

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Career Center</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your professional growth and resume.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/ai')}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2"
          >
            <Star size={16} className="fill-indigo-600" /> Ask AI Coach
          </button>
          {['profile', 'skills', 'roadmap', 'portfolio', 'tasks', 'goals', 'sessions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && <ProfileSection profile={careerProfile} experience={experience} certifications={certifications} onUpdate={updateCareerProfile} onAddExp={addExperience} onDeleteExp={deleteExperience} onAddCert={addCertification} onDeleteCert={deleteCertification} />}
          {activeTab === 'skills' && <SkillsSection skills={skills} onAdd={addSkill} onUpdate={updateSkill} onDelete={deleteSkill} />}
          {activeTab === 'roadmap' && <RoadmapSection roadmaps={careerRoadmaps} />}
          {activeTab === 'portfolio' && <PortfolioSection projects={projects} onAdd={addProject} onDelete={deleteProject} />}
          {activeTab === 'tasks' && <TasksSection tasks={careerTasks} onAdd={addCareerTask} onUpdate={updateCareerTask} onDelete={deleteCareerTask} />}
          {activeTab === 'goals' && <GoalsSection goals={careerGoals} onAdd={addCareerGoal} onUpdate={updateCareerGoal} onDelete={deleteCareerGoal} />}
          {activeTab === 'sessions' && <SessionsSection sessions={learningSessions} onAdd={addLearningSession} onDelete={deleteLearningSession} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const GoalsSection: React.FC<{
  goals: CareerGoal[];
  onAdd: (g: CareerGoal) => void;
  onUpdate: (g: CareerGoal) => void;
  onDelete: (id: string) => void;
}> = ({ goals, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', category: 'Career', targetDate: '' });

  const handleAdd = () => {
    if (!newGoal.name) return;
    onAdd({
      id: Date.now().toString(),
      name: newGoal.name,
      category: newGoal.category,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: newGoal.targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      progress: 0,
      status: 'In Progress',
      milestones: []
    });
    setNewGoal({ name: '', category: 'Career', targetDate: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Career Goals</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> New Goal
        </button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <input 
              className="flex-1 min-w-[200px] px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Goal Name (e.g. Become Oracle Consultant)"
              value={newGoal.name}
              onChange={e => setNewGoal({...newGoal, name: e.target.value})}
            />
            <input 
              type="date"
              className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              value={newGoal.targetDate}
              onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Add Goal</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-500">Cancel</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <Card key={goal.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{goal.category}</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{goal.name}</h3>
              </div>
              <button onClick={() => onDelete(goal.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Progress</span>
                  <span className="font-bold text-indigo-600">{goal.progress}%</span>
                </div>
                <ProgressBar progress={goal.progress} />
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Target: {goal.targetDate}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onUpdate({...goal, progress: Math.min(100, goal.progress + 10)})}
                    className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    +10%
                  </button>
                  {goal.progress === 100 && goal.status !== 'Completed' && (
                    <button 
                      onClick={() => onUpdate({...goal, status: 'Completed'})}
                      className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md font-bold"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>

              {goal.milestones.length > 0 && (
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Milestones</p>
                  <ul className="space-y-1">
                    {goal.milestones.map(m => (
                      <li key={m} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <div className="w-1 h-1 rounded-full bg-indigo-600" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Sub-components ---

const AddExperienceForm: React.FC<{ onAdd: (e: Experience) => void }> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ company: '', role: '', startDate: '', endDate: '', description: '', skills: '' });

  const handleAdd = () => {
    if (!formData.company || !formData.role) return;
    onAdd({
      id: Date.now().toString(),
      company: formData.company,
      role: formData.role,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      skillsGained: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    });
    setFormData({ company: '', role: '', startDate: '', endDate: '', description: '', skills: '' });
    setIsAdding(false);
  };

  if (!isAdding) return (
    <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-zinc-400 hover:text-indigo-600 hover:border-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm font-medium">
      <Plus size={18} /> Add Experience
    </button>
  );

  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
      <input className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
      <input className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" placeholder="Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <input type="date" className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
        <input type="date" className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
      </div>
      <textarea className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm h-20" placeholder="Responsibilities" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      <input className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" placeholder="Skills (comma separated)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
      <div className="flex gap-2">
        <button onClick={handleAdd} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Add</button>
        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-500 text-xs">Cancel</button>
      </div>
    </div>
  );
};

const AddCertificationForm: React.FC<{ onAdd: (c: Certification) => void }> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', provider: '', date: '', link: '' });

  const handleAdd = () => {
    if (!formData.name || !formData.provider) return;
    onAdd({
      id: Date.now().toString(),
      name: formData.name,
      provider: formData.provider,
      date: formData.date,
      credentialLink: formData.link
    });
    setFormData({ name: '', provider: '', date: '', link: '' });
    setIsAdding(false);
  };

  if (!isAdding) return (
    <button onClick={() => setIsAdding(true)} className="w-full py-2 text-sm text-indigo-600 font-medium hover:underline flex items-center justify-center gap-1">
      <Plus size={16} /> Add Certification
    </button>
  );

  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
      <input className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" placeholder="Cert Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      <input className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" placeholder="Provider" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} />
      <input type="date" className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
      <input className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" placeholder="Link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
      <div className="flex gap-2">
        <button onClick={handleAdd} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Add</button>
        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-500 text-xs">Cancel</button>
      </div>
    </div>
  );
};
const ProfileSection: React.FC<{ 
  profile: CareerProfile; 
  experience: Experience[]; 
  certifications: Certification[];
  onUpdate: (p: CareerProfile) => void;
  onAddExp: (e: Experience) => void;
  onDeleteExp: (id: string) => void;
  onAddCert: (c: Certification) => void;
  onDeleteCert: (id: string) => void;
}> = ({ profile, experience, certifications, onUpdate, onAddExp, onDeleteExp, onAddCert, onDeleteCert }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{profile.name}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </p>
              </div>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-indigo-600"
            >
              {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                />
                <input 
                  className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone"
                />
              </div>
              <textarea 
                className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white h-32"
                value={formData.summary} 
                onChange={e => setFormData({...formData, summary: e.target.value})}
                placeholder="Professional Summary"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1 hover:text-indigo-600"><Mail size={14} /> {profile.email}</a>
                <span className="flex items-center gap-1"><Phone size={14} /> {profile.phone}</span>
                <a href={`https://${profile.linkedin}`} className="flex items-center gap-1 hover:text-indigo-600"><Linkedin size={14} /> LinkedIn</a>
                <a href={`https://${profile.github}`} className="flex items-center gap-1 hover:text-indigo-600"><Github size={14} /> GitHub</a>
                <a href={`https://${profile.portfolio}`} className="flex items-center gap-1 hover:text-indigo-600"><Globe size={14} /> Portfolio</a>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  "{profile.summary}"
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card title="Experience">
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 pb-6 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-zinc-900" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white">{exp.role}</h4>
                    <p className="text-sm text-indigo-600 font-medium">{exp.company}</p>
                    <p className="text-xs text-zinc-500 mt-1">{exp.startDate} — {exp.endDate || 'Present'}</p>
                  </div>
                  <button onClick={() => onDeleteExp(exp.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">{exp.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {exp.skillsGained.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded-md uppercase tracking-wider font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <AddExperienceForm onAdd={onAddExp} />
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <Card title="Certifications">
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg text-orange-500">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{cert.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{cert.provider} • {cert.date}</p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteCert(cert.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                {cert.credentialLink && (
                  <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">
                    Verify Credential <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
            <AddCertificationForm onAdd={onAddCert} />
          </div>
        </Card>

        <Card title="Education">
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">B.Tech Information Technology</h4>
              <p className="text-xs text-indigo-600 font-medium mt-1">2022 — 2026</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">CGPA</span>
                <span className="text-sm font-bold text-indigo-600">7.5 / 10.0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SkillsSection: React.FC<{
  skills: Skill[];
  onAdd: (s: Skill) => void;
  onUpdate: (s: Skill) => void;
  onDelete: (id: string) => void;
}> = ({ skills, onAdd, onUpdate, onDelete }) => {
  const categories = Array.from(new Set(skills.map(s => s.category)));
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Programming', proficiency: 50 });

  const handleAdd = () => {
    if (!newSkill.name) return;
    onAdd({
      id: Date.now().toString(),
      name: newSkill.name,
      category: newSkill.category,
      proficiency: newSkill.proficiency
    });
    setNewSkill({ name: '', category: 'Programming', proficiency: 50 });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Technical Skills</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancel' : 'Add Skill'}
        </button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <input 
              className="flex-1 min-w-[200px] px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Skill Name (e.g. React)"
              value={newSkill.name}
              onChange={e => setNewSkill({...newSkill, name: e.target.value})}
            />
            <select 
              className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              value={newSkill.category}
              onChange={e => setNewSkill({...newSkill, category: e.target.value})}
            >
              <option>Programming</option>
              <option>AI/Data Science</option>
              <option>Libraries</option>
              <option>Cloud</option>
              <option>Oracle Technologies</option>
              <option>Tools</option>
            </select>
            <div className="flex items-center gap-2 flex-1 min-w-[150px]">
              <span className="text-xs font-bold text-zinc-400">Proficiency: {newSkill.proficiency}%</span>
              <input 
                type="range" 
                className="flex-1"
                value={newSkill.proficiency}
                onChange={e => setNewSkill({...newSkill, proficiency: parseInt(e.target.value)})}
              />
            </div>
            <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Add</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <Card key={cat} title={cat}>
            <div className="space-y-4">
              {skills.filter(s => s.category === cat).map(skill => (
                <div key={skill.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600">{skill.proficiency}%</span>
                      <button onClick={() => onDelete(skill.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <ProgressBar progress={skill.proficiency} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PortfolioSection: React.FC<{
  projects: Project[];
  onAdd: (p: Project) => void;
  onDelete: (id: string) => void;
}> = ({ projects, onDelete }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Project Portfolio</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  project.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {project.status}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-2">{project.name}</h3>
              </div>
              <button onClick={() => onDelete(project.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map(tech => (
                <span key={tech} className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-md text-[10px] text-zinc-500 font-medium">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-400">{project.completionDate}</span>
              {project.githubLink && (
                <a href={`https://${project.githubLink}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline">
                  <Github size={16} /> View Code
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RoadmapSection: React.FC<{ roadmaps: CareerRoadmap[] }> = ({ roadmaps }) => {
  return (
    <div className="space-y-8">
      {roadmaps.map(roadmap => (
        <div key={roadmap.id} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
              <RoadmapIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{roadmap.title}</h2>
              <p className="text-sm text-zinc-500">{roadmap.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmap.phases.map((phase, idx) => (
              <Card key={phase.id} className={`relative overflow-hidden ${phase.status === 'Locked' ? 'opacity-60 grayscale' : ''}`}>
                {phase.status === 'Completed' && (
                  <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-white rounded-bl-xl">
                    <CheckSquare size={16} />
                  </div>
                )}
                <div className="mb-4">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Phase {idx + 1}</span>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{phase.title}</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Skills to Master</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.skills.map(s => <span key={s} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded-md">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Key Milestones</p>
                    <ul className="space-y-1">
                      {phase.milestones.map(m => (
                        <li key={m} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <div className="w-1 h-1 rounded-full bg-indigo-600" /> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    phase.status === 'Active' ? 'bg-blue-100 text-blue-600' : 
                    phase.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {phase.status}
                  </span>
                  <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                    Details <ChevronRight size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const TasksSection: React.FC<{
  tasks: CareerTask[];
  onAdd: (t: CareerTask) => void;
  onUpdate: (t: CareerTask) => void;
  onDelete: (id: string) => void;
}> = ({ tasks, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'General', priority: 'Medium' as any });

  const handleAdd = () => {
    if (!newTask.title) return;
    onAdd({
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      deadline: new Date().toISOString().split('T')[0],
      completed: false
    });
    setNewTask({ title: '', category: 'General', priority: 'Medium' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Career Tasks</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <div className="flex gap-4">
            <input 
              className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="What needs to be done?"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
            />
            <select 
              className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              value={newTask.priority}
              onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Add</button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-500">Cancel</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl group">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onUpdate({...task, completed: !task.completed})}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {task.completed && <CheckSquare size={14} />}
              </button>
              <div>
                <p className={`font-medium ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-white'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{task.category}</span>
                  <span className={`text-[10px] font-bold uppercase ${
                    task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-500' : 'text-blue-500'
                  }`}>{task.priority}</span>
                </div>
              </div>
            </div>
            <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SessionsSection: React.FC<{
  sessions: LearningSession[];
  onAdd: (s: LearningSession) => void;
  onDelete: (id: string) => void;
}> = ({ sessions, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', topic: '', duration: 60 });
  const totalHours = (sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1);

  const handleAdd = () => {
    if (!newSession.title) return;
    onAdd({
      id: Date.now().toString(),
      title: newSession.title,
      topic: newSession.topic || 'General',
      durationMinutes: newSession.duration,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      notes: ''
    });
    setNewSession({ title: '', topic: '', duration: 60 });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-600 text-white border-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock size={24} />
            </div>
            <span className="font-bold">Total Learning</span>
          </div>
          <p className="text-4xl font-black">{totalHours} <span className="text-lg font-normal opacity-70">hrs</span></p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-zinc-500 uppercase mb-1">Weekly Average</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">4.2 hrs</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-zinc-500 uppercase mb-1">Total Sessions</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{sessions.length}</p>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Learning Sessions</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancel' : 'Log Session'}
        </button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <input 
              className="flex-1 min-w-[200px] px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Session Title"
              value={newSession.title}
              onChange={e => setNewSession({...newSession, title: e.target.value})}
            />
            <input 
              className="flex-1 min-w-[150px] px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Topic"
              value={newSession.topic}
              onChange={e => setNewSession({...newSession, topic: e.target.value})}
            />
            <input 
              type="number"
              className="w-24 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Min"
              value={newSession.duration}
              onChange={e => setNewSession({...newSession, duration: parseInt(e.target.value)})}
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Log</button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex justify-between items-center group">
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex flex-col items-center justify-center text-zinc-400">
                <span className="text-[10px] font-bold uppercase">MIN</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-white leading-none">{session.durationMinutes}</span>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white">{session.title}</h4>
                <p className="text-sm text-zinc-500">{session.topic} • {session.startTime.split('T')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-zinc-400 uppercase">Notes</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{session.notes || 'No notes'}</p>
              </div>
              <button onClick={() => onDelete(session.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
