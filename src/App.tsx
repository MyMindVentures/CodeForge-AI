/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BlueprintAndWorkflow } from './components/BlueprintAndWorkflow';
import { StepExecutionMonitor } from './components/screens/StepExecutionMonitor';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { 
  Layout, 
  Plus, 
  Play, 
  Settings, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Cloud, 
  Terminal,
  ChevronRight,
  Search,
  Github,
  Monitor,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Project {
  id: string;
  name: string;
  repo_url: string;
  branch: string;
  auth_reference?: string;
  sync_settings?: any;
  framework: string;
  deployment_target: string;
  policy: any;
  verdict?: any;
  status: 'idle' | 'building' | 'success' | 'failed';
  created_at: string;
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<'name' | 'status'>('name');
  const [isCreating, setIsCreating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', 
    repo_url: '', 
    branch: 'main',
    auth_reference: '',
    sync_settings: { auto_sync: true },
    framework: 'nextjs', 
    deployment_target: 'vercel' 
  });
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'docs' | 'policy' | 'governance' | 'verdict' | 'artifacts' | 'monitor' | 'blueprint'>('console');
  const [documents, setDocuments] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);

  const [activeRun, setActiveRun] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const [sandboxHealth, setSandboxHealth] = useState<{status: string, last_checked: string} | null>(null);

  useEffect(() => {
    console.log('App mounted, starting initial fetch...');
    // Initial fetch
    setTimeout(fetchProjects, 1000);

    const interval = setInterval(() => {
      fetchProjects();
      if (activeProject) {
        fetchRuns(activeProject.id);
        fetchSandboxHealth(activeProject.id);
      }
    }, 60000); // Increased interval to 60s to reduce rate limiting
    return () => clearInterval(interval);
  }, [activeProject]);

  const fetchWithRetry = async (url: string, retries = 3, backoff = 2000): Promise<Response> => {
    try {
      const res = await fetch(url);
      if (res.status === 429 && retries > 0) {
        console.warn(`Rate limited, retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, retries - 1, backoff * 2);
      }
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, retries - 1, backoff * 2);
      }
      throw err;
    }
  };

  useEffect(() => {
    if (activeProject) {
      fetchDocuments(activeProject.id);
      fetchArtifacts(activeRun?.id);
    }
  }, [activeProject, activeRun]);

  const fetchDocuments = async (projectId: string) => {
    try {
      const res = await fetchWithRetry(`/api/projects/${projectId}/documents`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text}`);
      }
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  };

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeProject || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          content: 'Simulated content'
        }),
      });
      if (!res.ok) throw new Error('Upload failed');
      fetchDocuments(activeProject.id);
    } catch (err) {
      console.error('Failed to upload doc', err);
    }
  };

  const fetchProjects = async (retries = 3) => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      setServerStatus('connecting');
      const apiUrl = `${window.location.origin}/api/projects`;
      console.log(`[${new Date().toISOString()}] Fetching projects from: ${apiUrl}`);
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error (${res.status}): ${errorText}`);
      }
      const data = await res.json();
      setProjects(data);
      setServerStatus('online');
    } catch (err) {
      console.error('Fetch projects error:', err);
      if (retries > 0) {
        setTimeout(() => fetchProjects(retries - 1), 5000); // Increased backoff
      } else {
        setServerStatus('offline');
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setIsCreating(false);
        setNewProject({ 
          name: '', 
          repo_url: '', 
          branch: 'main',
          auth_reference: '',
          sync_settings: { auto_sync: true },
          framework: 'nextjs', 
          deployment_target: 'vercel' 
        });
        fetchProjects();
      }
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const fetchRuns = async (projectId: string) => {
    try {
      const res = await fetchWithRetry(`/api/projects/${projectId}/runs`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text}`);
      }
      const data = await res.json();
      if (data.length > 0) {
        setActiveRun(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch runs', err);
    }
  };

  const fetchArtifacts = async (runId?: string) => {
    if (!runId) return;
    try {
      const res = await fetchWithRetry(`/api/runs/${runId}/artifacts`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text}`);
      }
      const data = await res.json();
      setArtifacts(data);
    } catch (err) {
      console.error('Failed to fetch artifacts', err);
    }
  };

  const fetchSandboxHealth = async (projectId: string) => {
    try {
      const res = await fetchWithRetry(`/api/projects/${projectId}/sandbox-health`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text}`);
      }
      const data = await res.json();
      setSandboxHealth(data);
    } catch (err) {
      console.error('Failed to fetch sandbox health', err);
    }
  };

  const handleResetSandbox = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/sandbox-reset`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset sandbox');
      fetchSandboxHealth(projectId);
    } catch (err) {
      console.error('Failed to reset sandbox', err);
    }
  };

  const handleApproveRun = async (runId: string) => {
    try {
      const res = await fetch(`/api/runs/${runId}/approve`, { method: 'POST' });
      if (res.ok) {
        fetchProjects();
        if (activeProject) fetchRuns(activeProject.id);
      }
    } catch (err) {
      console.error('Failed to approve run', err);
    }
  };

  const handleStartBuild = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}/start-build`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        console.log('Build loop started:', data);
        fetchProjects();
        const project = projects.find(p => p.id === id);
        if (project) setActiveProject(project);
      }
    } catch (err) {
      console.error('Failed to start build', err);
    }
  };

  const phases = [
    { id: 'initialization', label: 'Initialization', icon: Terminal },
    { id: 'doc_ingestion', label: 'Doc Ingestion', icon: FileText },
    { id: 'blueprint_compilation', label: 'Blueprint Compilation', icon: ShieldCheck },
    { id: 'repo_scanning', label: 'Repo Scanning', icon: Search },
    { id: 'planning', label: 'Planning', icon: Layout },
    { id: 'building', label: 'Building', icon: Activity },
    { id: 'qa_validation', label: 'QA Validation', icon: CheckCircle2 },
    { id: 'release_judging', label: 'Release Judging', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Mobile Sidebar Toggle (hidden on desktop) */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-[60]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/5 text-white">
          <Layout className="w-6 h-6" />
        </button>
      </div>

      <div className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar onSelect={(tab) => {
          console.log('Sidebar selected:', tab);
          setIsSidebarOpen(false);
        }} />
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <Header serverStatus={serverStatus} onNewProject={() => setIsCreating(true)} />

        {/* Dashboard or Project View */}
        <div className="p-8 max-w-7xl mx-auto">
          {!activeProject ? (
            <>
              <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Project Factory</h1>
                  <p className="text-zinc-500">Autonomous blueprint-driven application lifecycle management.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Filter projects..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                  />
                  <button onClick={() => setSort(sort === 'name' ? 'status' : 'name')} className="p-2 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white">
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
                  .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.status.localeCompare(b.status))
                  .map((project) => (
                    <ProjectCard 
                      key={project.id}
                      project={project}
                      onClick={() => setActiveProject(project)}
                      onStartBuild={handleStartBuild}
                    />
                ))}

                <button 
                  onClick={() => setIsCreating(true)}
                  className="group bg-transparent border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                    <Plus className="w-6 h-6 text-zinc-500 group-hover:text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-zinc-500 group-hover:text-emerald-500">Add New Project</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveProject(null)}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{activeProject.name}</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-zinc-500 text-sm">{activeProject.repo_url}</p>
                      <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">{activeProject.framework}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">{activeProject.deployment_target}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {activeRun?.status === 'success' && (
                    <button 
                      onClick={() => handleApproveRun(activeRun.id)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Release
                    </button>
                  )}
                  <button 
                    onClick={() => handleStartBuild(activeProject.id)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full text-sm font-bold transition-all border border-white/5"
                  >
                    <Play className="w-4 h-4" />
                    Trigger Run
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main View Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
                    {[
                      { id: 'console', label: 'Run Console', icon: Terminal },
                      { id: 'monitor', label: 'Execution Monitor', icon: Activity },
                      { id: 'blueprint', label: 'Blueprint & Workflow', icon: FileText },
                      { id: 'docs', label: 'Documentation', icon: FileText },
                      { id: 'policy', label: 'Build Policy', icon: ShieldCheck },
                      { id: 'governance', label: 'Governance', icon: Activity },
                      { id: 'verdict', label: 'Release Verdict', icon: CheckCircle2 },
                      { id: 'artifacts', label: 'Artifacts', icon: Database },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          activeTab === tab.id 
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'console' && (
                    <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white">Active Run Console</h2>
                        {activeRun && (
                          <span className="text-xs font-mono text-zinc-500">RUN_ID: {activeRun.id}</span>
                        )}
                      </div>

                      {!activeRun ? (
                        <div className="h-64 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-2xl">
                          <Activity className="w-8 h-8 mb-2 opacity-20" />
                          <p className="text-sm">No active runs. Trigger a build to start.</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="grid grid-cols-4 gap-4">
                            {phases.map((phase, idx) => {
                              const isCompleted = phases.findIndex(p => p.id === activeRun.phase) > idx || activeRun.status === 'success';
                              const isActive = activeRun.phase === phase.id;
                              
                              return (
                                <div key={phase.id} className="relative">
                                  <div className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                                    isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                    isCompleted ? 'bg-white/5 border-white/10 text-zinc-400' :
                                    'bg-white/2 border-white/5 text-zinc-600'
                                  }`}>
                                    <phase.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">{phase.label}</span>
                                    {isCompleted && <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-emerald-500" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-black/40 rounded-2xl p-6 font-mono text-xs space-y-2 border border-white/5 max-h-64 overflow-y-auto">
                            {activeRun.logs ? JSON.parse(activeRun.logs).map((log: string, i: number) => (
                              <div key={i} className="text-emerald-500/60">{log}</div>
                            )) : (
                              <div className="text-zinc-500 italic">Initializing logs...</div>
                            )}
                            {activeRun.status === 'running' && (
                              <div className="flex items-center gap-2 text-zinc-500">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                                <span>Awaiting agent response...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'monitor' && (
                    <StepExecutionMonitor projectId={activeProject.id} />
                  )}

                  {activeTab === 'blueprint' && (
                    <BlueprintAndWorkflow projectId={activeProject.id} />
                  )}

                  {activeTab === 'docs' && (
                    <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-xl font-bold text-white">Source Documentation</h2>
                          <p className="text-sm text-zinc-500">Upload blueprints, design docs, and API contracts.</p>
                        </div>
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/5 transition-all">
                          <Plus className="w-4 h-4 inline-block mr-2" />
                          Upload
                          <input type="file" className="hidden" onChange={handleUploadDoc} />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {documents.length === 0 ? (
                          <div className="col-span-2 h-32 flex items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-2xl">
                            No documents uploaded.
                          </div>
                        ) : (
                          documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-4 p-4 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                <FileText className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate">{doc.name}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{doc.type}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'policy' && (
                    <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
                      <h2 className="text-xl font-bold text-white mb-6">Build Policy Profile</h2>
                      <div className="space-y-6">
                        {Object.entries(activeProject.policy || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
                            <div className="text-sm font-bold text-white capitalize">{key.replace('_', ' ')}</div>
                            <input 
                              type="text"
                              value={String(value)}
                              onChange={(e) => {
                                const newPolicy = { ...activeProject.policy, [key]: e.target.value };
                                setActiveProject({ ...activeProject, policy: newPolicy });
                                fetch(`/api/projects/${activeProject.id}/policy`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ policy: newPolicy })
                                });
                              }}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-emerald-500 text-xs font-bold w-32 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'artifacts' && (
                    <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
                      <h2 className="text-xl font-bold text-white mb-6">Generated Artifacts</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {artifacts.length === 0 ? (
                          <div className="col-span-2 h-32 flex items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-2xl">
                            No artifacts generated yet.
                          </div>
                        ) : (
                          artifacts.map((art) => (
                            <div key={art.id} className="flex items-center gap-4 p-4 bg-white/2 border border-white/5 rounded-2xl">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                <Database className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate">{art.name}</div>
                                <a href={art.url} target="_blank" className="text-[10px] text-emerald-500 hover:underline">View Artifact</a>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Build Success Trend</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[{name: 'Mon', success: 4}, {name: 'Tue', success: 6}, {name: 'Wed', success: 8}, {name: 'Thu', success: 5}]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip contentStyle={{ backgroundColor: '#0D0D0E', border: '1px solid #333' }} />
                          <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Blueprint Coverage</h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Routes Implemented', value: 85 },
                        { label: 'Design Fidelity', value: 92 },
                        { label: 'Test Coverage', value: 78 },
                        { label: 'Accessibility', value: 100 },
                      ].map((stat) => (
                        <div key={stat.label} className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">{stat.label}</span>
                            <span className="text-white font-bold">{stat.value}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${stat.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                  <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white">Sandbox Health</h3>
                      <button onClick={() => handleResetSandbox(activeProject.id)} className="text-zinc-500 hover:text-white">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${sandboxHealth?.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-bold text-white capitalize">{sandboxHealth?.status || 'Unknown'}</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-2">Last checked: {sandboxHealth?.last_checked ? new Date(sandboxHealth.last_checked).toLocaleTimeString() : 'Never'}</div>
                  </div>

                  <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Release Scorecard</h3>
                    <div className="flex items-center justify-center py-8">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                          <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="364" strokeDashoffset={364 - (364 * 0.85)} className="text-emerald-500" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-white">85</span>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">Score</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>All critical flows passing</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-amber-400">
                        <AlertCircle className="w-3 h-3" />
                        <span>2 minor visual deviations</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0E] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Launch Gates</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Build Success', pass: true },
                        { label: 'E2E Tests', pass: true },
                        { label: 'Security Scan', pass: true },
                        { label: 'Design Review', pass: false },
                      ].map((gate) => (
                        <div key={gate.label} className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">{gate.label}</span>
                          {gate.pass ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-white/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D0D0E] border border-white/10 rounded-[32px] p-10 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Create Project</h2>
              <p className="text-zinc-500 mb-8">Initialize a new autonomous build pipeline.</p>

              <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Project Name</label>
                      <input 
                        required
                        type="text" 
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="e.g. Enterprise CRM"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Branch</label>
                      <input 
                        type="text" 
                        value={newProject.branch}
                        onChange={(e) => setNewProject({ ...newProject, branch: e.target.value })}
                        placeholder="main"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Framework Profile</label>
                      <select 
                        value={newProject.framework}
                        onChange={(e) => setNewProject({ ...newProject, framework: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none"
                      >
                        <option value="nextjs">Next.js (React)</option>
                        <option value="remix">Remix</option>
                        <option value="vite-react">Vite + React</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Deployment Target</label>
                      <select 
                        value={newProject.deployment_target}
                        onChange={(e) => setNewProject({ ...newProject, deployment_target: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all appearance-none"
                      >
                        <option value="vercel">Vercel-like</option>
                        <option value="docker">Docker Host</option>
                        <option value="kubernetes">Kubernetes</option>
                        <option value="cloud-run">Google Cloud Run</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Repository URL</label>
                    <input 
                      required
                      type="text" 
                      value={newProject.repo_url}
                      onChange={(e) => setNewProject({ ...newProject, repo_url: e.target.value })}
                      placeholder="https://github.com/org/repo"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Auth Reference (Optional)</label>
                    <input 
                      type="text" 
                      value={newProject.auth_reference}
                      onChange={(e) => setNewProject({ ...newProject, auth_reference: e.target.value })}
                      placeholder="Secret/Key Ref"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

