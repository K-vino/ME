import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Briefcase, GraduationCap, Award, Link as LinkIcon, Code2, Plus, X, Trash2 } from 'lucide-react';
import { ResumeItem } from '../types';

export const Resume: React.FC = () => {
  const { state, updateResumeData, deleteResumeItem } = useAppContext();
  const { userProfile, resumeData, skills } = state;

  const [addingType, setAddingType] = useState<'education' | 'internships' | 'certifications' | 'achievements' | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSubtitle, setNewItemSubtitle] = useState('');
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingType || !newItemTitle.trim()) return;

    const newItem: ResumeItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      subtitle: newItemSubtitle,
      date: newItemDate,
      description: newItemDesc,
    };

    updateResumeData({
      [addingType]: [...resumeData[addingType], newItem]
    });

    setAddingType(null);
    setNewItemTitle('');
    setNewItemSubtitle('');
    setNewItemDate('');
    setNewItemDesc('');
  };

  const handleDeleteItem = (type: 'education' | 'internships' | 'certifications' | 'achievements', id: string) => {
    deleteResumeItem(type, id);
  };

  const renderAddForm = (type: 'education' | 'internships' | 'certifications' | 'achievements') => {
    if (addingType !== type) return null;
    
    return (
      <form onSubmit={handleAddItem} className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white capitalize">Add {type}</h4>
          <button type="button" onClick={() => setAddingType(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input 
          type="text" 
          value={newItemTitle} 
          onChange={e => setNewItemTitle(e.target.value)} 
          placeholder="Title (e.g., B.Tech IT, Software Engineer Intern)" 
          className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" 
          required
        />
        <input 
          type="text" 
          value={newItemSubtitle} 
          onChange={e => setNewItemSubtitle(e.target.value)} 
          placeholder="Subtitle (e.g., University Name, Company Name)" 
          className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" 
        />
        <input 
          type="text" 
          value={newItemDate} 
          onChange={e => setNewItemDate(e.target.value)} 
          placeholder="Date (e.g., 2022 - 2026, Summer 2024)" 
          className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" 
        />
        <textarea 
          value={newItemDesc} 
          onChange={e => setNewItemDesc(e.target.value)} 
          placeholder="Description (optional)" 
          className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm" 
          rows={2}
        />
        <div className="flex justify-end">
          <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Save
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Resume</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your professional profile and experience.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="text-center">
              <div className="h-24 w-24 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{userProfile.name}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{userProfile.location}</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">Career Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.careerFocus.map((focus, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-lg font-medium">
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-2 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-1.5" /> Links
                </h3>
                <div className="space-y-2">
                  {resumeData.contactLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center">
              <Code2 className="w-5 h-5 mr-2 text-indigo-500" /> Top Skills
            </h3>
            <div className="space-y-3">
              {skills.slice(0, 5).map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{skill.name}</span>
                    <span className="text-zinc-500">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" /> Education
              </h3>
              <button 
                onClick={() => setAddingType('education')}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            <div className="space-y-6">
              {resumeData.education.map(edu => (
                <div key={edu.id} className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 group">
                  <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-zinc-900"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{edu.title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{edu.subtitle}</p>
                      <p className="text-xs text-zinc-500 mt-1">{edu.date}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem('education', edu.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {edu.description && <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{edu.description}</p>}
                </div>
              ))}
            </div>
            {renderAddForm('education')}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Experience & Internships
              </h3>
              <button 
                onClick={() => setAddingType('internships')}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            {resumeData.internships.length > 0 ? (
              <div className="space-y-6">
                {resumeData.internships.map(exp => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 group">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-zinc-900"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white">{exp.title}</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{exp.subtitle}</p>
                        <p className="text-xs text-zinc-500 mt-1">{exp.date}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem('internships', exp.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {exp.description && <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No experience added yet.</p>
            )}
            {renderAddForm('internships')}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-500" /> Certifications & Achievements
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setAddingType('certifications')}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Cert
                </button>
                <button 
                  onClick={() => setAddingType('achievements')}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Achievement
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.certifications.map(cert => (
                <div key={cert.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 group relative">
                  <div className="pr-8">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{cert.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{cert.subtitle} {cert.subtitle && '•'} {cert.date}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteItem('certifications', cert.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {resumeData.achievements.map(ach => (
                <div key={ach.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 group relative">
                  <div className="pr-8">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{ach.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{ach.date}</p>
                    {ach.description && <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{ach.description}</p>}
                  </div>
                  <button 
                    onClick={() => handleDeleteItem('achievements', ach.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {resumeData.certifications.length === 0 && resumeData.achievements.length === 0 && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic col-span-full">No certifications or achievements added yet.</p>
              )}
            </div>
            {renderAddForm('certifications')}
            {renderAddForm('achievements')}
          </div>
        </div>
      </div>
    </div>
  );
};
