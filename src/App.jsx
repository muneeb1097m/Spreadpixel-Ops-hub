
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Users, 
  Bot, 
  LayoutDashboard,
  Calendar,
  Layers,
  Settings,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  LogOut,
  Eye,
  EyeOff,
  ArrowRight,
  Share2,
  FileDown,
  Mail,
  Filter,
  TrendingUp,
  Globe,
  FolderOpen,
  Play,
  UserCheck,
  User,
  Sparkles,
  Pause,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

import { 
  supabase,
  fetchClients, 
  upsertClient, 
  deleteClient,
  signUpUser,
  signInUser,
  logTaskCompletion,
  subscribeToClients,
  subscribeToTaskLogs,
  broadcastTaskCompletion,
  fetchRecentLogs
} from './supabase';

import { 
  ROLES, 
  PACKAGES, 
  DC, 
  DEFAULT_TASKS, 
  DEFAULT_SOPS,
  SERVICES,
  PACKAGE_SERVICES,
  getPackageTasks
} from './constants';
import ReportModal from './ReportModal';
import InviteModal from './InviteModal';
import TeamManagement from './TeamManagement';
import AdminLiveDash from './AdminLiveDash';
import BDHub, { extractOrGenerateLinkedinUrl } from './BDHub';

const ROLE_TO_NAME = {
  AM: "Account Manager",
  CW: "Content Writer",
  GD: "Graphic Designer",
  VE: "Video Editor",
  ADS: "Ads Manager",
  CRM: "CRM Executive",
  OPS: "Ops Manager",
  SMM: "Social Media Manager",
  BD: "Business Developer",
  TECH: "Tech Team"
};

const getKarachiDateStr = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
};

const mkState = (tasks) => {
  const s = {};
  tasks.forEach(t => { s[t.id] = { done: false, notes: "", review: "", delayReason: "" }; });
  return s;
};

const storage = {
  get: async (key) => ({ value: localStorage.getItem(key) }),
  set: async (key, val) => localStorage.setItem(key, val)
};

const S = {
  root: { display: 'flex', height: '100vh', background: '#fffaf5', color: '#0f172a', overflow: 'hidden', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: 280, background: '#ffffff', borderRight: '1px solid rgba(234,88,12,0.08)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', boxShadow: '2px 0 16px rgba(15,23,42,0.02)' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: '#fffaf5' },
  header: { minHeight: 76, height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 36px', borderBottom: '1px solid rgba(234,88,12,0.08)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,0.85)' },
  tabBar: { padding: '16px 36px', borderBottom: '1px solid rgba(234,88,12,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' },
  content: { flex: 1, overflowY: 'auto', padding: '32px 36px' },
  card: { background: '#ffffff', borderRadius: 20, border: '1px solid rgba(234,88,12,0.08)', padding: '28px 32px', boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(234, 88, 12, 0.02)' },
  btn: (active, color = '#ea580c') => ({
    padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
    background: active ? color : '#fff5ed', color: active ? '#ffffff' : '#64748b', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: active ? '1px solid transparent' : '1px solid rgba(234,88,12,0.08)', cursor: 'pointer',
    boxShadow: active ? '0 4px 12px rgba(234, 88, 12, 0.2)' : 'none'
  }),
  badge: (color) => ({
    padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
    background: `${color}15`, color: color, border: `1px solid ${color}30`, whiteSpace: 'nowrap'
  }),
  input: {
    width: '100%', padding: '12px 18px', background: '#ffffff', border: '1px solid rgba(234,88,12,0.14)',
    borderRadius: 14, color: '#0f172a', fontSize: 14, outline: 'none', transition: 'all 0.2s',
    boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.02)'
  },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalBox: { background: '#ffffff', borderRadius: 24, border: '1px solid rgba(234,88,12,0.12)', width: 'min(650px, 95vw)', padding: 32, position: 'relative', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.18)', color: '#0f172a' },
  quickBtn: (active) => ({
    padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
    background: active ? '#ffedd5' : '#fff5ed', color: active ? '#ea580c' : '#64748b',
    border: `1px solid ${active ? '#fed7aa' : 'rgba(234,88,12,0.14)'}`,
    cursor: 'pointer', transition: 'all 0.15s',
    boxShadow: active ? '0 2px 6px rgba(234,88,12,0.12)' : 'none'
  }),
};

export default function App() {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [sops, setSops] = useState(DEFAULT_SOPS);
  const [clients, setClients] = useState([]);
  const clientsRef = useRef(clients);
  const pendingSyncData = useRef({});
  const clientSyncChains = useRef({});
  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("sprint");
  const [phase, setPhase] = useState("sprint");
  const [addingC, setAddingC] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPkg, setNewPkg] = useState("growth_starter");
  const [newServices, setNewServices] = useState(PACKAGE_SERVICES['growth_starter'] || []);
  const [newDate, setNewDate] = useState(getKarachiDateStr());
  const [editId, setEditId] = useState(null);
  const [editNm, setEditNm] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newDriveLink, setNewDriveLink] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editDriveLink, setEditDriveLink] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [newBD, setNewBD] = useState("");
  const [editBD, setEditBD] = useState("");
  const [clientFilterText, setClientFilterText] = useState("");
  
  // Outreach fields
  const [editIcp, setEditIcp] = useState('');
  const [editRawProfile, setEditRawProfile] = useState('');
  const [editLeadName, setEditLeadName] = useState('');
  const [editLeadScore, setEditLeadScore] = useState('');
  const [editLeadHeadline, setEditLeadHeadline] = useState('');
  const [editLeadCompany, setEditLeadCompany] = useState('');
  const [editLeadExplanation, setEditLeadExplanation] = useState('');
  const [editLeadStage, setEditLeadStage] = useState('not_started');
  const [editLeadNotes, setEditLeadNotes] = useState('');
  const [editLinkedinUrl, setEditLinkedinUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Brand Assets & Auto Color Extraction state
  const [newBrandColors, setNewBrandColors] = useState('#7C3AED, #0F172A, #059669');
  const [editBrandColors, setEditBrandColors] = useState('#7C3AED, #0F172A, #059669');
  const [newBrandLogoUrl, setNewBrandLogoUrl] = useState('');
  const [editBrandLogoUrl, setEditBrandLogoUrl] = useState('');
  const [newBrandNiche, setNewBrandNiche] = useState('');
  const [editBrandNiche, setEditBrandNiche] = useState('');
  const [newBrandLogoPosition, setNewBrandLogoPosition] = useState('Top-Left');
  const [editBrandLogoPosition, setEditBrandLogoPosition] = useState('Top-Left');
  const [newBrandPlatform, setNewBrandPlatform] = useState('Meta Ads (1:1 Feed Square)');
  const [editBrandPlatform, setEditBrandPlatform] = useState('Meta Ads (1:1 Feed Square)');
  const [isExtractingColors, setIsExtractingColors] = useState(false);

  const handleLogoImageColorExtraction = async (imageSource) => {
    if (!imageSource) return;
    setIsExtractingColors(true);
    try {
      const colors = await extractDominantColors(imageSource, 3);
      if (colors && colors.length > 0) {
        const colorsStr = colors.join(', ');
        if (editId) {
          setEditBrandColors(colorsStr);
        } else {
          setNewBrandColors(colorsStr);
        }
        toast.success(`Extracted ${colors.length} brand colors from logo!`);
      }
    } catch (err) {
      console.warn('[handleLogoImageColorExtraction] Error:', err);
    } finally {
      setIsExtractingColors(false);
    }
  };

  const [aiScorerClient, setAiScorerClient] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [savingAiAnalysis, setSavingAiAnalysis] = useState(false);
  const [aiScorerLinkedinProfileId, setAiScorerLinkedinProfileId] = useState('');

  const [modal, setModal] = useState(null);
  const [taskModal, setTaskModal] = useState(null); // Custom task editing modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkTab, setBulkTab] = useState("add"); // 'add' | 'edit' | 'remove'
  
  // Add Tab State
  const [bulkAddName, setBulkAddName] = useState("");
  const [bulkAddRole, setBulkAddRole] = useState("");
  const [bulkAddStartDay, setBulkAddStartDay] = useState(16);
  const [bulkAddEndDay, setBulkAddEndDay] = useState(90);
  const [bulkAddSop, setBulkAddSop] = useState("");

  // Edit Tab State
  const [bulkEditMatchName, setBulkEditMatchName] = useState("");
  const [bulkEditNewName, setBulkEditNewName] = useState("");
  const [bulkEditNewRole, setBulkEditNewRole] = useState("");
  const [bulkEditStartDay, setBulkEditStartDay] = useState(16);
  const [bulkEditEndDay, setBulkEditEndDay] = useState(90);
  const [bulkEditNewSop, setBulkEditNewSop] = useState("");

  // Remove Tab State
  const [bulkRemoveMatchName, setBulkRemoveMatchName] = useState("");
  const [bulkRemoveStartDay, setBulkRemoveStartDay] = useState(16);
  const [bulkRemoveEndDay, setBulkRemoveEndDay] = useState(90);
  const [editNote, setEditNote] = useState("");
  const [editReview, setEditReview] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [teamMembers, setTeamMembers] = useState([]);
  const [syncing, setSyncing] = useState(false);
  
  const [todayDrawerOpen, setTodayDrawerOpen] = useState(false);
  const [tempClientNotes, setTempClientNotes] = useState("");
  const [tempStandardNotes, setTempStandardNotes] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [localTaskNotes, setLocalTaskNotes] = useState({});

  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("flc_user") || "null"));

  const sel = clients.find(c => c.id === selId);



  useEffect(() => {
    if (sel && modal?.type === 'standard_notes') {
      setTempStandardNotes(sel.tasks?.__standard_notes || "");
    }
  }, [selId, modal?.type, sel?.tasks?.__standard_notes]);

  useEffect(() => {
    if (!showBulkModal) {
      setBulkAddName("");
      setBulkAddRole("");
      setBulkAddStartDay(16);
      setBulkAddEndDay(90);
      setBulkAddSop("");
      setBulkEditMatchName("");
      setBulkEditNewName("");
      setBulkEditNewRole("");
      setBulkEditStartDay(16);
      setBulkEditEndDay(90);
      setBulkEditNewSop("");
      setBulkRemoveMatchName("");
      setBulkRemoveStartDay(16);
      setBulkRemoveEndDay(90);
    }
  }, [showBulkModal]);

  const saveClientNotes = () => {
    if (!selId) return;
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;
    const updatedTasks = {
      ...(currentLatest.tasks || {}),
      __updated_at: nowStr,
      __client_notes: tempClientNotes
    };
    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);
    toast.success("Client notes saved successfully!");
  };
  const [access, setAccess] = useState(() => (sessionStorage.getItem("flc_access") || "none").toLowerCase());
  const [authView, setAuthView] = useState("login");
  const [loading, setLoading] = useState(false);
  
  const [uName, setUName] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uPass, setUPass] = useState("");
  const [uRole, setURole] = useState("member");
  const [adminToken, setAdminToken] = useState("");
  const ADMIN_SECRET = "SpreadPixel-Admin-Gate-99X!";
  
  const [authStep, setAuthStep] = useState("credentials"); // 'credentials' | 'otp'
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  
  const isAdmin = access === 'admin' || (user && user.role && user.role.toLowerCase() === 'admin');
  const isMember = isAdmin || 
    (user && user.role && (Object.keys(ROLES).includes(user.role.toUpperCase()) || user.role.toLowerCase() === 'member')) || 
    Object.keys(ROLES).includes(access.toUpperCase()) || 
    access === 'member';
  const isTeamLead = isAdmin || (user && user.name && (
    user.name.toLowerCase().includes('usman') ||
    user.name.toLowerCase().includes('neelam') ||
    user.name.toLowerCase().includes('muneeb') ||
    user.name.toLowerCase().includes('faseeh')
  ));
  const isBD = access === 'bd' || (user && user.role && user.role.toLowerCase() === 'bd');
  const isBDOrAdmin = isAdmin || isBD;
  const [authError, setAuthError] = useState("");
  useEffect(() => {
    setAuthError("");
  }, [authView, authStep]);

  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);
  
  const [aiText, setAiText] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [sopLoad, setSopLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [showPass, setShowPass] = useState(false);
  const [noteMode, setNoteMode] = useState('edit'); // 'edit' | 'preview'

  // Handle Resize for Auto-Sidebar
  useEffect(() => {
    const h = () => setSidebarOpen(window.innerWidth > 1024);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Sync and refresh user profile/role from database on load
  useEffect(() => {
    const refreshUserSession = async () => {
      if (user && user.id) {
        try {
          const { data, error } = await supabase
            .from('flc_ops_users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          if (data) {
            setUser(data);
            setAccess((data.role || 'member').toLowerCase());
            sessionStorage.setItem("flc_user", JSON.stringify(data));
            sessionStorage.setItem("flc_access", (data.role || 'member').toLowerCase());
          }
        } catch (err) {
          console.error("Failed to refresh user session:", err);
        }
      }
    };
    refreshUserSession();
  }, [user?.id]);

  // TMAP relies on cTasks, defined near sel

  const [showInvite, setShowInvite] = useState(false);
  

  // Handle URL Invites
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('signup') === 'true') {
      setAuthView('signup');
      setAuthStep('credentials');
      setUEmail(p.get('email') || '');
      setURole('member'); // Force member Role for invites
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loadClients = async () => {
    setFetchError(null);
    setLoaded(false);
    try {
      const { data: usersData } = await supabase.from('flc_ops_users').select('id, name, role, slack_id').order('name');
      setTeamMembers(usersData || []);

      const urlParams = new URLSearchParams(window.location.search);
      const cid = urlParams.get('cid');
      const mode = urlParams.get('access');

      if (mode === 'client' && cid) {
        const d = await fetchClients(cid, user);
        if (d.length) {
          const cleaned = d.map(c => ({ ...c, tasks: c.tasks || mkState(DEFAULT_TASKS), startDate: c.startDate || getKarachiDateStr() }));
          clientsRef.current = cleaned;
          setClients(cleaned);
          setAccess('client');
          setSelId(cid);
          const initialTab = urlParams.get('tab');
          if (initialTab) setTab(initialTab);
          sessionStorage.setItem('flc_access', 'client');
        }
      } else {
        const d = await fetchClients(null, user);
        const cleaned = d.map(c => ({ ...c, tasks: c.tasks || mkState(DEFAULT_TASKS), startDate: c.startDate || getKarachiDateStr() }));
        clientsRef.current = cleaned;
        setClients(cleaned);
        const realOps = cleaned.filter(c => c.package !== 'lead');
        if (realOps.length && (selId === null || !realOps.some(c => c.id === selId))) {
          setSelId(realOps[0].id);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setFetchError(err.message || "Failed to connect to database. Your client data is safe — please retry.");
    }
    setLoaded(true);
  };

  const loadNotifications = async () => {
    try {
      const logs = await fetchRecentLogs(15);
      const formatted = logs.map(l => ({
        id: l.id || `log_${l.completed_at || new Date().toISOString()}_${Math.random()}`,
        type: 'task',
        title: l.action_type === 'COMPLETED' ? 'Task Completed!' : 'Task Reverted',
        body: `${l.member_name} ${l.action_type === 'COMPLETED' ? 'completed' : 'reverted'} "${l.task_name}" for ${l.client_name}.`,
        time: l.completed_at || new Date().toISOString(),
        unread: true
      }));

      const readIds = JSON.parse(localStorage.getItem('spreadpixel_read_notifications') || localStorage.getItem('flc_read_notifications') || '[]');
      const withReadStatus = formatted.map(n => ({
        ...n,
        unread: !readIds.includes(String(n.id))
      }));

      if (user) {
        const welcomeId = `welcome_${user.email}`;
        if (!readIds.includes(welcomeId)) {
          withReadStatus.unshift({
            id: welcomeId,
            type: 'system',
            title: 'Welcome Back!',
            body: `Logged in successfully as ${user.name}.`,
            time: new Date().toISOString(),
            unread: true
          });
        }
      }

      setNotifications(withReadStatus);
      setUnreadCount(withReadStatus.filter(n => n.unread).length);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const markAllNotificationsAsRead = () => {
    const readIds = JSON.parse(localStorage.getItem('spreadpixel_read_notifications') || '[]');
    notifications.forEach(n => {
      if (!readIds.includes(String(n.id))) {
        readIds.push(String(n.id));
      }
    });
    localStorage.setItem('spreadpixel_read_notifications', JSON.stringify(readIds));
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  useEffect(() => { 
    loadClients(); 
    loadNotifications();
    
    // Set up Real-time Subscription
    const sub = subscribeToClients((payload) => {
      console.log('DB Change Detected:', payload);
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        const newC = payload.new;
        const formatted = {
          id: newC.id,
          name: newC.name,
          startDate: newC.start_date,
          package: newC.package,
          tasks: newC.tasks_data,
          followups: newC.followups_data,
          updatedAt: newC.updated_at
        };
        setClients(prev => {
          const exists = prev.find(c => c.id === formatted.id);
          let next;
          if (exists) {
            next = prev.map(c => {
              if (c.id === formatted.id) {
                // Perform smart task-by-task merge for real-time update
                const mergedTasks = { ...c.tasks, ...formatted.tasks };
                
                Object.keys(formatted.tasks || {}).forEach(taskId => {
                  if (taskId.startsWith('__')) return; // Skip metadata keys
                  
                  const dbTask = formatted.tasks[taskId] || {};
                  const localTask = c.tasks?.[taskId] || {};
                  
                  const dbTime = dbTask.updatedAt ? new Date(dbTask.updatedAt).getTime() : 0;
                  const localTime = localTask.updatedAt ? new Date(localTask.updatedAt).getTime() : 0;
                  
                  if (dbTime > 0 || localTime > 0) {
                    if (dbTime >= localTime) {
                      mergedTasks[taskId] = { ...localTask, ...dbTask };
                    } else {
                      mergedTasks[taskId] = { ...dbTask, ...localTask };
                    }
                  } else {
                    // Legacy fallback
                    const merged = { ...localTask, ...dbTask };
                    if (localTask.done && !dbTask.done) {
                      merged.done = true;
                    }
                    if (localTask.notes && localTask.notes.trim() && (!dbTask.notes || !dbTask.notes.trim())) {
                      merged.notes = dbTask.notes;
                    }
                    if (localTask.review && localTask.review.trim() && (!dbTask.review || !dbTask.review.trim())) {
                      merged.review = dbTask.review;
                    }
                    if (localTask.delayReason && localTask.delayReason.trim() && (!dbTask.delayReason || !dbTask.delayReason.trim())) {
                      merged.delayReason = dbTask.delayReason;
                    }
                    mergedTasks[taskId] = merged;
                  }
                });

                // Merge metadata keys (starting with __)
                const metadataKeys = ['__website', '__drive_link', '__client_name', '__standard_notes', '__client_notes', '__defs', '__meta_updated_at', '__assigned_bd', '__sops'];
                const dbMetaTime = formatted.tasks?.__meta_updated_at ? new Date(formatted.tasks.__meta_updated_at).getTime() : 0;
                const localMetaTime = c.tasks?.__meta_updated_at ? new Date(c.tasks.__meta_updated_at).getTime() : 0;

                metadataKeys.forEach(key => {
                  const dbVal = formatted.tasks?.[key];
                  const localVal = c.tasks?.[key];
                  if (dbMetaTime >= localMetaTime) {
                    if (dbVal !== undefined && dbVal !== null && dbVal !== "") {
                      mergedTasks[key] = dbVal;
                    }
                  } else {
                    if (localVal) {
                      mergedTasks[key] = localVal;
                    }
                  }
                });

                // Merge payment metadata
                Object.keys(formatted.tasks || {}).forEach(k => {
                  if (k.startsWith('__payment_month')) {
                    const dbVal = formatted.tasks[k];
                    const localVal = c.tasks?.[k];
                    if (dbVal !== undefined && dbVal !== null && dbVal !== "") {
                      mergedTasks[k] = dbVal;
                    } else if (localVal) {
                      mergedTasks[k] = localVal;
                    }
                  }
                });

                console.log(`Smart merged real-time update for client "${c.name}"`);
                return { ...c, ...formatted, tasks: mergedTasks };
              }
              return c;
            });
          } else {
            next = [...prev, formatted];
          }
          clientsRef.current = next;
          return next;
        });
      } else if (payload.eventType === 'DELETE') {
        setClients(prev => {
          const next = prev.filter(c => c.id !== payload.old.id);
          clientsRef.current = next;
          return next;
        });
      }
    });

    return () => { supabase.removeChannel(sub); };
  }, [user]); // Re-subscribe if user changes (for role-based filtering)

  // Request Notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Listen to task log insertions for real-time Chrome/in-app notifications
  useEffect(() => {
    const logSub = subscribeToTaskLogs((payload) => {
      console.log('Task Log Received:', payload);
      if (payload.eventType === 'INSERT') {
        const log = payload.new;
        
        // Add to notifications state list in real time
        const logId = log.id || `log_${log.completed_at || new Date().toISOString()}_${Math.random()}`;
        const newNotif = {
          id: logId,
          type: 'task',
          title: log.action_type === 'COMPLETED' ? 'Task Completed!' : 'Task Reverted',
          body: `${log.member_name} ${log.action_type === 'COMPLETED' ? 'completed' : 'reverted'} "${log.task_name}" for ${log.client_name}.`,
          time: log.completed_at || new Date().toISOString(),
          unread: true
        };

        setNotifications(prev => {
          const exists = prev.some(n => n.id === logId);
          if (exists) return prev;
          const next = [newNotif, ...prev];
          setUnreadCount(next.filter(n => n.unread).length);
          return next;
        });

        if (log.action_type === 'COMPLETED') {
          // Do not notify the user who completed the task
          if (user && log.member_email?.toLowerCase() === user.email?.toLowerCase()) {
            return;
          }

          // Find notes if available in local state
          let notesText = '';
          const clientObj = clientsRef.current?.find(c => String(c.id) === String(log.client_id));
          if (clientObj && clientObj.tasks && clientObj.tasks[log.task_id]) {
            notesText = clientObj.tasks[log.task_id].notes || '';
          }

          const title = `🚀 Task Completed!`;
          const body = `${log.member_name} completed "${log.task_name}" for ${log.client_name}.${notesText ? `\nNote: ${notesText}` : ''}`;

          // 1. Toast Notification
          toast.success(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#dc2626' }}>{title}</div>
              <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>{body}</div>
            </div>,
            { duration: 6000 }
          );

          // 2. Chrome Desktop Notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(title, {
                body,
                icon: '/logo.png'
              });
            } catch (err) {
              console.error('Failed to trigger native notification:', err);
            }
          }
        }
      }
    });

    return () => {
      supabase.removeChannel(logSub);
    };
  }, [user]);

  const lastSyncedAt = useRef({}); // { [clientId]: timestamp } - tracks when we last synced each client to DB

  const sync = (c) => {
    const fullClient = (c && c.id && Object.keys(c).length <= 2) ? clientsRef.current.find(client => client.id === c.id) : c;
    if (!fullClient) return;

    const clientId = fullClient.id;
    pendingSyncData.current[clientId] = fullClient;

    const currentChain = clientSyncChains.current[clientId] || Promise.resolve();

    clientSyncChains.current[clientId] = currentChain.then(async () => {
      setSyncing(true);
      let attempts = 0;
      const maxAttempts = 3;
      let success = false;

      while (attempts < maxAttempts && !success) {
        try {
          attempts++;
          const res = await upsertClient(fullClient);
          if (res) {
            success = true;
            lastSyncedAt.current[clientId] = Date.now();
            if (res.id !== clientId) {
              lastSyncedAt.current[res.id] = Date.now();
            }
            if (pendingSyncData.current[clientId] === fullClient) {
              delete pendingSyncData.current[clientId];
            }
            const next = clientsRef.current.map(pc => {
              if (pc.id === clientId || pc.id === res.id) {
                const dbTasksTime = res.tasks_data?.__updated_at ? new Date(res.tasks_data.__updated_at) : null;
                const localTasksTime = pc.tasks?.__updated_at ? new Date(pc.tasks.__updated_at) : null;
                
                if (dbTasksTime && localTasksTime && dbTasksTime <= localTasksTime) {
                  return { ...pc, id: res.id };
                }
                return { ...pc, id: res.id, updatedAt: res.updated_at };
              }
              return pc;
            });
            clientsRef.current = next;
            setClients(next);
            if (selId === clientId) setSelId(res.id);
          }
        } catch (e) {
          console.error(`Sync attempt ${attempts} failed for client ${clientId}:`, e);
          if (attempts >= maxAttempts) {
            if (pendingSyncData.current[clientId] === fullClient) {
              delete pendingSyncData.current[clientId];
            }
            toast.error("Database Sync Failed: Please check your internet connection. Changes may not be saved.", {
              icon: '☁️',
              duration: 8000
            });
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      setSyncing(false);
    });
  };


  
  const getEffectiveStartDate = (client) => {
    if (!client || !client.startDate) return null;
    let totalOffsetDays = Number(client.tasks?.__total_paused_days || 0);
    if (client.tasks?.__is_paused && client.tasks?.__paused_at) {
      const pDate = new Date(client.tasks.__paused_at);
      const now = new Date();
      const currentPauseDays = Math.max(0, Math.floor((now.getTime() - pDate.getTime()) / 86400000));
      totalOffsetDays += currentPauseDays;
    }
    const sd = new Date(client.startDate + 'T00:00:00Z');
    sd.setUTCDate(sd.getUTCDate() + totalOffsetDays);
    return sd.toISOString().split('T')[0];
  };
  
  const workingDayMap = useMemo(() => {
    const effectiveStart = getEffectiveStartDate(sel);
    const map = {};
    if (!effectiveStart) {
      for (let i = 1; i <= 150; i++) map[i] = i;
      return map;
    }
    const sd = new Date(effectiveStart + 'T00:00:00Z');
    let actual = 1;
    for (let logical = 1; logical <= 150; logical++) {
      let d = new Date(sd);
      d.setUTCDate(d.getUTCDate() + (actual - 1));
      while (d.getUTCDay() === 0) { // Sunday
        actual++;
        d = new Date(sd);
        d.setUTCDate(d.getUTCDate() + (actual - 1));
      }
      map[logical] = actual;
      actual++;
    }
    return map;
  }, [sel?.startDate, sel?.tasks?.__is_paused, sel?.tasks?.__paused_at, sel?.tasks?.__total_paused_days]);

  const cTasks = useMemo(() => {
    const defs = sel?.tasks?.__defs;
    const selectedServices = sel?.tasks?.__services || (sel?.package ? PACKAGE_SERVICES[sel.package] : null);
    const baseTasks = getPackageTasks(sel?.package, selectedServices);
    if (!defs) {
      return [...baseTasks];
    }

    const defsMap = new Map(defs.map(d => [d.id, d]));
    const baseIds = new Set(baseTasks.map(t => t.id));
    const merged = [];

    baseTasks.forEach(bt => {
      if (defsMap.has(bt.id)) {
        const dt = defsMap.get(bt.id);
        merged.push({ ...bt, ...dt, n: dt.n || bt.n, role: dt.role || bt.role, isPost: bt.isPost, deps: bt.deps || dt.deps || [] });
      } else {
        merged.push(bt);
      }
    });

    defs.forEach(dt => {
      if (!baseIds.has(dt.id) && (dt.id?.startsWith('t') || dt.isCustom)) {
        merged.push(dt);
      }
    });

    return merged;
  }, [sel?.tasks?.__defs, sel?.tasks?.__services, sel?.package, sel?.startDate]);

  const TMAP = useMemo(() => {
    const map = {};
    cTasks.forEach(t => { map[t.id] = t; });
    return map;
  }, [cTasks]);

  useEffect(() => {
    if (sel && todayDrawerOpen) {
      const notes = {};
      cTasks.forEach(t => {
        notes[t.id] = sel?.tasks?.[t.id]?.notes || "";
      });
      setLocalTaskNotes(notes);
    }
  }, [selId, todayDrawerOpen, sel?.tasks, cTasks]);

  const saveDrawerTasks = () => {
    if (!sel) return;
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    let updatedTasks = { ...(currentLatest.tasks || {}), __updated_at: nowStr };
    
    // Update each task note from localTaskNotes
    Object.keys(localTaskNotes).forEach(taskId => {
      updatedTasks[taskId] = {
        ...(updatedTasks[taskId] || { done: false, review: "", delayReason: "" }),
        notes: localTaskNotes[taskId],
        updatedAt: nowStr
      };
    });

    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);
    toast.success("Tasks evidence saved successfully!");
  };

  // Sync editNote when modal opens
  useEffect(() => {
    if (modal?.type === 'notes' && modal.task) {
      const taskState = sel?.tasks?.[modal.task.id];
      setEditNote(taskState?.notes || "");
      setEditReview(taskState?.review || "");
    } else {
      setEditNote("");
      setEditReview("");
    }
  }, [modal, selId, sel]);
  const isLocked = (id) => false;
  
  const dayNum = () => {
    if (!sel || !sel.startDate) return 1;
    const isPaused = sel.tasks?.__is_paused === true;
    if (isPaused && sel.tasks?.__paused_day_index) {
      return sel.tasks.__paused_day_index;
    }
    const effectiveStart = getEffectiveStartDate(sel);
    if (!effectiveStart) return 1;
    const tzFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = tzFormatter.format(new Date());
    const dToday = new Date(todayStr + 'T00:00:00Z');
    const dStart = new Date(effectiveStart + 'T00:00:00Z');
    return Math.max(1, Math.round((dToday - dStart) / 86400000) + 1);
  };

  const toggleClientPause = () => {
    if (!sel) return;
    const isPaused = sel.tasks?.__is_paused === true;
    const nowIso = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId) || sel;

    let updatedTasks = { ...(currentLatest.tasks || {}), __updated_at: nowIso };

    if (!isPaused) {
      const activeDay = dayNum();
      updatedTasks.__is_paused = true;
      updatedTasks.__paused_at = nowIso;
      updatedTasks.__paused_day_index = activeDay;

      toast.info(`Work PAUSED for ${sel.name}. Schedule & active tracking frozen on Day ${activeDay}.`, {
        icon: '⏸️',
        duration: 5000
      });
    } else {
      const pausedAtDate = updatedTasks.__paused_at ? new Date(updatedTasks.__paused_at) : new Date();
      const resumeDate = new Date();
      const pausedDaysCount = Math.max(0, Math.floor((resumeDate.getTime() - pausedAtDate.getTime()) / 86400000));
      const prevTotal = Number(updatedTasks.__total_paused_days || 0);
      const newTotal = prevTotal + pausedDaysCount;

      const pauseRecord = {
        pausedAt: updatedTasks.__paused_at,
        resumedAt: nowIso,
        pausedDays: pausedDaysCount
      };

      updatedTasks.__is_paused = false;
      updatedTasks.__paused_at = null;
      updatedTasks.__paused_day_index = null;
      updatedTasks.__total_paused_days = newTotal;
      updatedTasks.__pause_history = [...(updatedTasks.__pause_history || []), pauseRecord];

      toast.success(`Work RESUMED for ${sel.name}! Operational dates adjusted forward by ${pausedDaysCount} day(s).`, {
        icon: '▶️',
        duration: 5000
      });
    }

    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowIso };
    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);
  };

  const scrollToToday = () => {
    if (!sel) {
      toast.error("Please select a client first");
      return;
    }
    const today = dayNum(); // Actual calendar day index (e.g. 24)
    
    // Find the logical day in workingDayMap that corresponds to this actual calendar day
    let targetLogicalDay = Object.keys(workingDayMap).find(key => Number(workingDayMap[key]) === today);
    
    if (!targetLogicalDay) {
      // Fallback: find the logical day whose mapped actual day is closest to today
      let minDiff = Infinity;
      let closestLogical = 1;
      Object.keys(workingDayMap).forEach(logical => {
        const actual = Number(workingDayMap[logical]);
        const diff = Math.abs(actual - today);
        if (diff < minDiff) {
          minDiff = diff;
          closestLogical = logical;
        }
      });
      targetLogicalDay = closestLogical;
    }

    targetLogicalDay = Number(targetLogicalDay);
    
    // Determine the phase/tab based on the targetLogicalDay
    let targetTab = 'sprint';
    if (targetLogicalDay >= 8 && targetLogicalDay <= 30) {
      targetTab = 'ongoing_8_30';
    } else if (targetLogicalDay >= 31 && targetLogicalDay <= 60) {
      targetTab = 'ongoing_31_60';
    } else if (targetLogicalDay >= 61) {
      targetTab = 'ongoing_61_90';
    }
    
    // Set the tab and phase to correct values
    setTab(targetTab);
    setPhase(targetTab.startsWith('ongoing') ? 'ongoing' : targetTab);
    
    // Scroll to the card after a short delay to allow the DOM to switch
    setTimeout(() => {
      // Find the card for this logical day, or fallback to the closest active card in the DOM
      let element = document.getElementById(`day-card-${targetLogicalDay}`);
      let offset = 1;
      while (!element && offset <= 90) {
        element = document.getElementById(`day-card-${targetLogicalDay - offset}`) || 
                  document.getElementById(`day-card-${targetLogicalDay + offset}`);
        offset++;
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight the card temporarily (premium visual cue)
        const originalOutline = element.style.outline;
        const originalBoxShadow = element.style.boxShadow;
        const originalTransition = element.style.transition;
        
        element.style.transition = 'all 0.5s ease';
        element.style.outline = '3px solid #dc2626';
        element.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.4)';
        
        setTimeout(() => {
          element.style.outline = originalOutline;
          element.style.boxShadow = originalBoxShadow;
          element.style.transition = originalTransition;
        }, 2000);
        
        toast.success(`Scrolled to Day ${targetLogicalDay} tasks`);
      } else {
        toast.info(`Today is Day ${today} (${targetTab.toUpperCase()}). Showing phase tasks.`);
      }
    }, 150);
  };


  const saveTaskDef = (taskData, sopText) => {
    if (!selId || !sel) return;
    // Save SOP if provided
    if (sopText !== undefined) {
      setSops(prev => ({ ...prev, [taskData.n]: sopText }));
    }
    
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    const defs = currentLatest.tasks?.__defs ? [...currentLatest.tasks.__defs] : [...DEFAULT_TASKS];
    const existingIdx = defs.findIndex(t => t.id === taskData.id);
    
    // Detect assignee change
    let oldAssignee = "";
    if (existingIdx >= 0) {
      oldAssignee = defs[existingIdx].role || "";
    } else {
      const defaultTask = DEFAULT_TASKS.find(t => t.id === taskData.id);
      oldAssignee = defaultTask ? defaultTask.role : "";
    }
    const newAssignee = taskData.role || "";

    if (existingIdx >= 0) defs[existingIdx] = taskData;
    else defs.push(taskData);
    
    const newTasks = { ...currentLatest.tasks, __defs: defs, __updated_at: nowStr, __meta_updated_at: nowStr };
    if (sopText !== undefined) {
      newTasks.__sops = {
        ...(newTasks.__sops || {}),
        [taskData.n]: sopText
      };
    }
    if (!newTasks[taskData.id]) newTasks[taskData.id] = { done: false, notes: "", delayReason: "" };
    const updatedClient = { ...currentLatest, tasks: newTasks, updatedAt: nowStr };

    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    
    sync(updatedClient);
    setTaskModal(null);
  };

  const deleteTaskDef = (taskId) => {
    if (!selId || !sel || !confirm("Delete this custom task for this client?")) return;
    
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    const defs = (currentLatest.tasks?.__defs || DEFAULT_TASKS).filter(t => t.id !== taskId);
    const updatedClient = { ...currentLatest, tasks: { ...currentLatest.tasks, __defs: defs, __updated_at: nowStr, __meta_updated_at: nowStr }, updatedAt: nowStr };

    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    
    sync(updatedClient);
  };

  const formatTaskDuration = (taskState) => {
    if (!taskState) return "0m";
    let totalSecs = taskState.totalDuration || 0;
    if (taskState.timerActive && taskState.activeSessionStart) {
      const diffMs = Date.now() - new Date(taskState.activeSessionStart).getTime();
      totalSecs += Math.max(0, Math.floor(diffMs / 1000));
    }
    
    if (totalSecs <= 0) return "0m";
    
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
  };

  const assignTask = async (taskId) => {
    if (!selId || !sel) return;
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    const taskObj = TMAP[taskId] || { id: taskId, n: taskId, role: "AM" };
    const assigneeName = ROLE_TO_NAME[taskObj.role] || taskObj.role || "Unassigned";

    const updatedTasks = {
      ...(currentLatest.tasks || {}),
      __updated_at: nowStr,
      [taskId]: {
        ...(currentLatest.tasks[taskId] || { done: false, notes: "", delayReason: "" }),
        assigned: true,
        assignedAt: nowStr,
        assignedBy: user?.name || "Team Lead",
        updatedAt: nowStr
      }
    };

    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);

    toast.success(`Task assigned to ${assigneeName}!`);
  };

  const startTimer = (taskId) => {
    if (!selId || !sel) return;
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    const taskState = currentLatest.tasks[taskId] || { done: false, notes: "", delayReason: "" };
    if (taskState.done) {
      toast.error("Cannot start timer for a completed task.");
      return;
    }

    const sessions = taskState.sessions ? [...taskState.sessions] : [];
    sessions.push({ start: nowStr, end: null });

    const updatedTasks = {
      ...(currentLatest.tasks || {}),
      __updated_at: nowStr,
      [taskId]: {
        ...taskState,
        timerActive: true,
        activeSessionStart: nowStr,
        sessions,
        updatedAt: nowStr
      }
    };

    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);
    toast.success("Timer started!");
  };

  const pauseTimer = (taskId) => {
    if (!selId || !sel) return;
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    const taskState = currentLatest.tasks[taskId] || { done: false, notes: "", delayReason: "" };
    if (!taskState.timerActive) return;

    const sessions = taskState.sessions ? [...taskState.sessions] : [];
    const activeIdx = sessions.findIndex(s => s.end === null);
    
    let addedDuration = 0;
    if (activeIdx >= 0) {
      sessions[activeIdx] = { ...sessions[activeIdx], end: nowStr };
      const diffMs = new Date(nowStr).getTime() - new Date(sessions[activeIdx].start).getTime();
      addedDuration = Math.max(0, Math.floor(diffMs / 1000));
    }

    const totalDuration = (taskState.totalDuration || 0) + addedDuration;

    const updatedTasks = {
      ...(currentLatest.tasks || {}),
      __updated_at: nowStr,
      [taskId]: {
        ...taskState,
        timerActive: false,
        activeSessionStart: null,
        sessions,
        totalDuration,
        updatedAt: nowStr
      }
    };

    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);
    toast.success("Timer paused!");
  };

  const getTargetDays = (start, end) => {
    const days = [];
    const startNum = parseInt(start) || 1;
    const endNum = parseInt(end) || 90;
    
    for (let d = startNum; d <= endNum; d++) {
      if (d <= 7) {
        days.push(d);
      } else {
        if (d % 2 === 0) {
          days.push(d);
        }
      }
    }
    return days;
  };

  const uniqueTaskNames = useMemo(() => {
    const names = new Set();
    cTasks.forEach(t => {
      if (t.n) names.add(t.n);
    });
    return Array.from(names).sort();
  }, [cTasks]);

  const handleBulkAdd = async () => {
    if (!bulkAddName.trim()) {
      toast.error("Please enter a task name");
      return;
    }
    if (!sel) {
      toast.error("No client selected");
      return;
    }
    
    const targetDays = getTargetDays(bulkAddStartDay, bulkAddEndDay);
    if (targetDays.length === 0) {
      toast.error("No valid days found in the selected range");
      return;
    }

    setSyncing(true);
    try {
      const clientDefs = sel.tasks?.__defs;
      let clientMerged = [...DEFAULT_TASKS];
      if (clientDefs) {
        const defsMap = new Map(clientDefs.map(d => [d.id, d]));
        const defaultIds = new Set(DEFAULT_TASKS.map(t => t.id));
        const newMerged = [];

        DEFAULT_TASKS.forEach(bt => {
          if (defsMap.has(bt.id)) {
            const dt = defsMap.get(bt.id);
            newMerged.push({ ...bt, ...dt, n: dt.n || bt.n, role: dt.role || bt.role, isPost: bt.isPost, deps: bt.deps });
          }
        });

        clientDefs.forEach(dt => {
          if (!defaultIds.has(dt.id)) {
            if (dt.isPost && dt.day >= 8 && dt.day % 2 !== 0) return;
            if (dt.id.match(/^p\d+$/) && dt.day >= 8) return;
            newMerged.push(dt);
          }
        });
        clientMerged = newMerged;
      }

      const newDefs = [...clientMerged];
      const newTasksState = { ...(sel.tasks || {}) };

      targetDays.forEach(day => {
        const taskId = `tb_${day}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const newTask = {
          id: taskId,
          phase: day <= 7 ? 'sprint' : 'ongoing',
          day: day,
          n: bulkAddName.trim(),
          role: bulkAddRole,
          isPost: day > 7,
          deps: [],
          freq: day > 7 ? 'Outreach' : undefined
        };
        newDefs.push(newTask);
        newTasksState[taskId] = { done: false, notes: "", review: "", delayReason: "" };
      });

      const nowStr = new Date().toISOString();
      newTasksState.__defs = newDefs;
      if (bulkAddSop.trim()) {
        newTasksState.__sops = {
          ...(newTasksState.__sops || {}),
          [bulkAddName.trim()]: bulkAddSop.trim()
        };
        setSops(prev => ({ ...prev, [bulkAddName.trim()]: bulkAddSop.trim() }));
      }
      newTasksState.__meta_updated_at = nowStr;
      newTasksState.__updated_at = nowStr;
      const updatedClient = { ...sel, tasks: newTasksState, updatedAt: nowStr };

      if (bulkAddSop.trim()) {
        setSops(prev => ({ ...prev, [bulkAddName.trim()]: bulkAddSop.trim() }));
      }

      const next = clientsRef.current.map(c => c.id === sel.id ? updatedClient : c);
      clientsRef.current = next;
      setClients(next);
      await upsertClient(updatedClient);

      toast.success(`Added task "${bulkAddName}" to ${targetDays.length} days successfully!`);
      setShowBulkModal(false);
      setBulkAddName("");
      setBulkAddSop("");
    } catch (err) {
      console.error("Bulk add error:", err);
      toast.error("Failed to add tasks: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleBulkEdit = async () => {
    if (!bulkEditMatchName) {
      toast.error("Please select a task to edit");
      return;
    }
    if (!sel) {
      toast.error("No client selected");
      return;
    }
    
    const targetDays = getTargetDays(bulkEditStartDay, bulkEditEndDay);
    if (targetDays.length === 0) {
      toast.error("No valid days found in the selected range");
      return;
    }

    setSyncing(true);
    try {
      const clientDefs = sel.tasks?.__defs;
      let clientMerged = [...DEFAULT_TASKS];
      if (clientDefs) {
        const defsMap = new Map(clientDefs.map(d => [d.id, d]));
        const defaultIds = new Set(DEFAULT_TASKS.map(t => t.id));
        const newMerged = [];

        DEFAULT_TASKS.forEach(bt => {
          if (defsMap.has(bt.id)) {
            const dt = defsMap.get(bt.id);
            newMerged.push({ ...bt, ...dt, n: dt.n || bt.n, role: dt.role || bt.role, isPost: bt.isPost, deps: bt.deps });
          }
        });

        clientDefs.forEach(dt => {
          if (!defaultIds.has(dt.id)) {
            if (dt.isPost && dt.day >= 8 && dt.day % 2 !== 0) return;
            if (dt.id.match(/^p\d+$/) && dt.day >= 8) return;
            newMerged.push(dt);
          }
        });
        clientMerged = newMerged;
      }

      const newDefs = [];
      let updatedCount = 0;

      clientMerged.forEach(task => {
        const matchesName = task.n === bulkEditMatchName;
        const matchesDay = targetDays.includes(task.day);

        if (matchesName && matchesDay) {
          const updatedTask = { ...task };
          if (bulkEditNewName.trim()) updatedTask.n = bulkEditNewName.trim();
          if (bulkEditNewRole) {
            updatedTask.role = bulkEditNewRole === 'Unassigned' ? '' : bulkEditNewRole;
          }
          newDefs.push(updatedTask);
          updatedCount++;
        } else {
          newDefs.push(task);
        }
      });

      if (updatedCount === 0) {
        toast.info("No matching tasks found to update");
        setSyncing(false);
        return;
      }

      const finalName = bulkEditNewName.trim() || bulkEditMatchName;
      const nowStr = new Date().toISOString();
      const newTasksState = { ...(sel.tasks || {}), __defs: newDefs, __meta_updated_at: nowStr };
      if (bulkEditNewSop.trim()) {
        newTasksState.__sops = {
          ...(newTasksState.__sops || {}),
          [finalName]: bulkEditNewSop.trim()
        };
        setSops(prev => ({ ...prev, [finalName]: bulkEditNewSop.trim() }));
      }
      newTasksState.__updated_at = nowStr;
      const updatedClient = { ...sel, tasks: newTasksState, updatedAt: nowStr };

      const next = clientsRef.current.map(c => c.id === sel.id ? updatedClient : c);
      clientsRef.current = next;
      setClients(next);
      await upsertClient(updatedClient);

      toast.success(`Successfully updated tasks for ${sel.name}!`);
      setShowBulkModal(false);
      setBulkEditNewName("");
      setBulkEditNewSop("");
    } catch (err) {
      console.error("Bulk edit error:", err);
      toast.error("Failed to edit tasks: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleBulkRemove = async () => {
    if (!bulkRemoveMatchName) {
      toast.error("Please select a task to remove");
      return;
    }
    if (!sel) {
      toast.error("No client selected");
      return;
    }

    const targetDays = getTargetDays(bulkRemoveStartDay, bulkRemoveEndDay);
    if (targetDays.length === 0) {
      toast.error("No valid days found in the selected range");
      return;
    }

    if (!confirm(`Are you sure you want to remove "${bulkRemoveMatchName}" from Days ${bulkRemoveStartDay}-${bulkRemoveEndDay}?`)) {
      return;
    }

    setSyncing(true);
    try {
      const clientDefs = sel.tasks?.__defs;
      let clientMerged = [...DEFAULT_TASKS];
      if (clientDefs) {
        const defsMap = new Map(clientDefs.map(d => [d.id, d]));
        const defaultIds = new Set(DEFAULT_TASKS.map(t => t.id));
        const newMerged = [];

        DEFAULT_TASKS.forEach(bt => {
          if (defsMap.has(bt.id)) {
            const dt = defsMap.get(bt.id);
            newMerged.push({ ...bt, ...dt, n: dt.n || bt.n, role: dt.role || bt.role, isPost: bt.isPost, deps: bt.deps });
          }
        });

        clientDefs.forEach(dt => {
          if (!defaultIds.has(dt.id)) {
            if (dt.isPost && dt.day >= 8 && dt.day % 2 !== 0) return;
            if (dt.id.match(/^p\d+$/) && dt.day >= 8) return;
            newMerged.push(dt);
          }
        });
        clientMerged = newMerged;
      }

      const newDefs = [];
      let removedCount = 0;

      clientMerged.forEach(task => {
        const matchesName = task.n === bulkRemoveMatchName;
        const matchesDay = targetDays.includes(task.day);

        if (matchesName && matchesDay) {
          removedCount++;
        } else {
          newDefs.push(task);
        }
      });

      if (removedCount === 0) {
        toast.info("No matching tasks found to remove");
        setSyncing(false);
        return;
      }

      const nowStr = new Date().toISOString();
      const newTasksState = { ...(sel.tasks || {}), __defs: newDefs, __meta_updated_at: nowStr };
      const updatedClient = { ...sel, tasks: newTasksState, updatedAt: nowStr };

      const next = clientsRef.current.map(c => c.id === sel.id ? updatedClient : c);
      clientsRef.current = next;
      setClients(next);
      await upsertClient(updatedClient);

      toast.success(`Successfully removed tasks for ${sel.name}!`);
      setShowBulkModal(false);
    } catch (err) {
      console.error("Bulk remove error:", err);
      toast.error("Failed to remove tasks: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteClient = async (clientToDelete) => {
    if (!isAdmin) return;
    if (!confirm(`Delete ${clientToDelete.name}?`)) return;

    const previousClients = [...clients];
    // Optimistic UI update: remove client from list
    const next = clientsRef.current.filter(c => c.id !== clientToDelete.id);
    clientsRef.current = next;
    setClients(next);
    
    // If the deleted client was the selected one, select the next available one
    if (selId === clientToDelete.id) {
      const remaining = previousClients.filter(c => c.id !== clientToDelete.id);
      if (remaining.length > 0) {
        setSelId(remaining[0].id);
      } else {
        setSelId(null);
      }
    }

    try {
      await deleteClient(clientToDelete.id);
      delete clientSyncChains.current[clientToDelete.id];
      toast.success(`Client "${clientToDelete.name}" deleted successfully.`);
    } catch (e) {
      console.error("Delete client error:", e);
      // Revert the optimistic update if it fails
      clientsRef.current = previousClients;
      setClients(previousClients);
      if (selId === clientToDelete.id) {
        setSelId(clientToDelete.id);
      }
      toast.error(`Failed to delete client: ${e.message || e.details || "Database constraint violation"}. The deletion was aborted.`, {
        duration: 6000,
        icon: '⚠️'
      });
    }
  };

  const toggleTask = (id) => { 
    if (isLocked(id)) return; 

    // Request browser notification permission on user gesture
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(err => console.warn("Permission request failed:", err));
    }

    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    // Verification: Notes must exist before marking as done
    const isReadyToComplete = !currentLatest.tasks[id]?.done;
    const hasNotes = currentLatest.tasks[id]?.notes?.trim().length > 1;

    if (isReadyToComplete && !hasNotes) {
      toast.error("Evidence Required: Please add a note or remark before marking this task as complete.", {
        icon: '📝',
        duration: 4000
      });
      return;
    }

    const nowStr = new Date().toISOString();
    const taskState = currentLatest.tasks[id] || { done: false, notes: "", delayReason: "" };
    
    // Timer Auto-Stop Logic on completion
    let timerActive = !!taskState.timerActive;
    let sessions = taskState.sessions ? [...taskState.sessions] : [];
    let totalDuration = taskState.totalDuration || 0;
    let activeSessionStart = taskState.activeSessionStart;

    if (isReadyToComplete && timerActive) {
      const activeIdx = sessions.findIndex(s => s.end === null);
      if (activeIdx >= 0) {
        sessions[activeIdx] = { ...sessions[activeIdx], end: nowStr };
        const diffMs = new Date(nowStr).getTime() - new Date(sessions[activeIdx].start).getTime();
        totalDuration += Math.max(0, Math.floor(diffMs / 1000));
      }
      timerActive = false;
      activeSessionStart = null;
    }

    const updatedTasks = { 
      ...(currentLatest.tasks || {}), 
      __updated_at: nowStr,
      [id]: { 
        ...taskState,
        done: !taskState.done,
        timerActive,
        sessions,
        totalDuration,
        activeSessionStart,
        doneAt: isReadyToComplete ? nowStr : null,
        updatedAt: nowStr
      } 
    };
    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };

    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);

    // Log activity (Completion or Reversion) and notify Slack
    if (user) {
      const isCompleting = isReadyToComplete;
      const taskObj = TMAP[id] || { n: id, day: 1 };
      
      // Calculate post details dynamically for Day 8+ tasks
      let displayName = taskObj.n || id;
      if (taskObj.day >= 8) {
        const postNum = Math.floor((taskObj.day - 8) / 2) + 1;
        const postType = (taskObj.day % 4 === 0) ? "Graphic Post" : "Video Post";
        displayName = `${taskObj.n} (Post #${postNum} - ${postType})`;
      }

      logTaskCompletion({
        member_name: user.name,
        member_email: user.email,
        task_id: id,
        task_name: displayName,
        client_id: currentLatest.id,
        client_name: currentLatest.name,
        action_type: isCompleting ? 'COMPLETED' : 'REVERTED'
      });

      if (isCompleting) {
        broadcastTaskCompletion({
          member_name: user.name,
          member_email: user.email,
          task_id: id,
          task_name: displayName,
          client_id: currentLatest.id,
          client_name: currentLatest.name,
          action_type: 'COMPLETED'
        });

        const formattedDuration = formatTaskDuration({
          timerActive,
          sessions,
          totalDuration,
          activeSessionStart
        });
      }
    }
  };
  
  const updateTaskData = (id, updates) => {
    if (!sel) return;
    
    const nowStr = new Date().toISOString();
    const currentLatest = clientsRef.current.find(c => c.id === selId);
    if (!currentLatest) return;

    const currentTask = currentLatest.tasks[id] || { done: false, notes: "", review: "", delayReason: "" };
    const updatedTasks = { 
      ...(currentLatest.tasks || {}), 
      __updated_at: nowStr,
      [id]: { ...currentTask, ...updates, updatedAt: nowStr } 
    };
    const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };

    const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
    clientsRef.current = next;
    setClients(next);
    sync(updatedClient);
  };

  const handleAnalyzeLead = async () => {
    if (!editRawProfile.trim()) {
      toast.error('Please paste the raw profile text first');
      return;
    }
    if (!editIcp.trim()) {
      toast.error('Please specify the target ICP');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawProfile: editRawProfile, icp: editIcp })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze profile');
      }

      if (data.name) {
        setEditLeadName(data.name);
      }
      setEditLeadHeadline(data.headline || '');
      setEditLeadCompany(data.company || '');
      setEditLeadScore(data.score !== undefined ? data.score : 50);
      setEditLeadExplanation(data.explanation || '');

      const extractedUrl = data.linkedin_url || extractOrGenerateLinkedinUrl(editRawProfile, data.name || editLeadName, data.company || editLeadCompany);
      setEditLinkedinUrl(extractedUrl);

      setAiAnalysisResult(data);
      toast.success('Profile analyzed successfully!');
    } catch (e) {
      console.error(e);
      toast.error('AI Analysis failed: ' + e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openEditModalForClient = (c) => {
    setEditId(c.id);
    setEditNm(c.name);
    setNewPkg(c.package);
    setNewServices(c.tasks?.__services || PACKAGE_SERVICES[c.package] || PACKAGE_SERVICES['growth_starter']);
    setNewDate(c.startDate);
    setEditWebsite(c.tasks?.__website || "");
    setEditDriveLink(c.tasks?.__drive_link || "");
    setEditClientName(c.tasks?.__client_name || "");
    setEditBD(c.tasks?.__assigned_bd || "");
    
    setEditIcp(c.tasks?.__bd_outreach_icp || '');
    setEditRawProfile(c.tasks?.__bd_outreach_raw_profile || "");
    setEditLeadScore(c.tasks?.__bd_outreach_score || "");
    setEditLeadHeadline(c.tasks?.__bd_outreach_headline || "");
    setEditLeadCompany(c.tasks?.__bd_outreach_company || "");
    setEditLeadExplanation(c.tasks?.__bd_outreach_ai_explanation || "");
    setEditLeadStage(c.tasks?.__bd_outreach_stage || "not_started");
    setEditLeadNotes(c.tasks?.__bd_outreach_notes || "");

    setEditBrandColors(c.tasks?.__brand_colors || "#7C3AED, #0F172A, #059669");
    setEditBrandLogoUrl(c.tasks?.__brand_logo_url || "");
    setEditBrandNiche(c.tasks?.__brand_niche || "");
    setEditBrandLogoPosition(c.tasks?.__brand_logo_position || "Top-Left");
    setEditBrandPlatform(c.tasks?.__brand_platform || "Meta Ads (1:1 Feed Square)");
  };

  const openAiScorerForClient = (c) => {
    const target = c || (sel ? sel : { id: 'new_bd_lead', name: 'New Outreach Lead', tasks: {} });
    setAiScorerClient(target);
    setEditIcp(target?.tasks?.__bd_outreach_icp || sel?.tasks?.__bd_outreach_icp || '');
    setEditRawProfile(target?.tasks?.__bd_outreach_raw_profile || '');
    const profiles = target?.tasks?.__linkedin_profiles || sel?.tasks?.__linkedin_profiles || [];
    setAiScorerLinkedinProfileId(target?.tasks?.__bd_outreach_linkedin_profile_id || (profiles.length > 0 ? profiles[0].id : ''));
    const calculatedUrl = target?.tasks?.__bd_outreach_linkedin_url || extractOrGenerateLinkedinUrl(target?.tasks?.__bd_outreach_raw_profile, target?.name || '', target?.tasks?.__bd_outreach_company || '');
    setEditLinkedinUrl(calculatedUrl || '');
    setAiAnalysisResult(null);
  };

  const handleSaveAiAnalysis = async () => {
    if (!aiAnalysisResult || !aiScorerClient) return;
    setSavingAiAnalysis(true);
    const nowStr = new Date().toISOString();

    // Check if we are creating a NEW lead or updating an EXISTING lead
    const isCreatingNewLead = !aiScorerClient.id || aiScorerClient.id === sel?.id || aiScorerClient.id === 'new_bd_lead';

    const currentStage = isCreatingNewLead ? 'match_icp' : (aiScorerClient.tasks?.__bd_outreach_stage || 'match_icp');
    const targetStage = currentStage === 'not_started' ? 'match_icp' : currentStage;

    const updatedTasks = {
      ...(isCreatingNewLead ? {} : (aiScorerClient.tasks || {})),
      __bd_outreach_stage: targetStage,
      __bd_outreach_icp: editIcp,
      __bd_outreach_raw_profile: editRawProfile,
      __bd_outreach_score: aiAnalysisResult.score !== undefined ? Number(aiAnalysisResult.score) : 50,
      __bd_outreach_ai_explanation: aiAnalysisResult.explanation || '',
      __bd_outreach_company: aiAnalysisResult.company || '',
      __bd_outreach_headline: aiAnalysisResult.headline || '',
      __bd_outreach_date: nowStr,
      __meta_updated_at: nowStr,
      __bd_outreach_parent_client_id: aiScorerClient?.tasks?.__bd_outreach_parent_client_id || sel?.id || null,
      __bd_outreach_linkedin_profile_id: aiScorerLinkedinProfileId || aiScorerClient?.tasks?.__bd_outreach_linkedin_profile_id || (sel?.tasks?.__linkedin_profiles?.[0]?.id || null),
      __bd_outreach_linkedin_url: editLinkedinUrl.trim() || extractOrGenerateLinkedinUrl(editRawProfile, aiAnalysisResult.name, aiAnalysisResult.company),
    };

    let targetClientData;
    if (isCreatingNewLead) {
      // Create a brand new client record for the lead
      targetClientData = {
        name: aiAnalysisResult.name || 'New Lead',
        startDate: nowStr.split('T')[0],
        package: 'lead', // mark as lead
        tasks: updatedTasks,
        followups: [],
        updatedAt: nowStr
      };
    } else {
      // Update the existing lead record
      targetClientData = {
        ...aiScorerClient,
        name: aiAnalysisResult.name || aiScorerClient.name,
        tasks: updatedTasks,
        updatedAt: nowStr
      };
    }

    try {
      const saved = await upsertClient(targetClientData);
      
      // Update clients list state
      setClients(prev => {
        let next;
        if (isCreatingNewLead) {
          next = [...prev, { ...targetClientData, id: saved.id }];
        } else {
          next = prev.map(c => c.id === aiScorerClient.id ? { ...targetClientData, id: saved.id } : c);
        }
        clientsRef.current = next;
        return next;
      });

      toast.success(isCreatingNewLead ? `New lead "${targetClientData.name}" created and scored!` : `Lead "${targetClientData.name}" updated!`);
      setAiScorerClient(null);
      setAiAnalysisResult(null);
      setEditRawProfile("");
    } catch (e) {
      toast.error('Failed to save analysis: ' + e.message);
    } finally {
      setSavingAiAnalysis(false);
    }
  };

  const addClient = async () => {
    if (!newName.trim()) return;
    const tempId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (`client_${Date.now()}`);
    const selectedPkgTasks = getPackageTasks(newPkg, newServices);
    const initialTasks = mkState(selectedPkgTasks);
    initialTasks.__services = newServices;
    initialTasks.__website = newWebsite.trim();
    initialTasks.__drive_link = newDriveLink.trim();
    initialTasks.__client_name = newClientName.trim();
    initialTasks.__assigned_bd = newBD.trim();
    
    // Outreach fields
    initialTasks.__bd_outreach_stage = editLeadStage || 'not_started';
    initialTasks.__bd_outreach_notes = editLeadNotes || '';
    initialTasks.__bd_outreach_icp = editIcp || '';
    initialTasks.__bd_outreach_raw_profile = editRawProfile || '';
    initialTasks.__bd_outreach_score = editLeadScore ? Number(editLeadScore) : null;
    initialTasks.__bd_outreach_ai_explanation = editLeadExplanation || '';
    initialTasks.__bd_outreach_company = editLeadCompany || '';
    initialTasks.__bd_outreach_headline = editLeadHeadline || '';
    initialTasks.__bd_outreach_date = new Date().toISOString();
    
    // Brand Asset fields
    initialTasks.__brand_colors = (newBrandColors || editBrandColors || "#7C3AED, #0F172A, #059669").trim();
    initialTasks.__brand_logo_url = (newBrandLogoUrl || editBrandLogoUrl || "").trim();
    initialTasks.__brand_niche = (newBrandNiche || editBrandNiche || "").trim();
    initialTasks.__brand_logo_position = newBrandLogoPosition || editBrandLogoPosition || "Top-Left";
    initialTasks.__brand_platform = newBrandPlatform || editBrandPlatform || "Meta Ads (1:1 Feed Square)";
    initialTasks.__creative_brand_brief = {
      client_name: newName.trim(),
      core_offer: '',
      brand_colors: initialTasks.__brand_colors,
      brand_logo_url: initialTasks.__brand_logo_url,
      brand_niche: initialTasks.__brand_niche,
      brand_logo_position: initialTasks.__brand_logo_position,
      brand_platform: initialTasks.__brand_platform
    };
    initialTasks.__meta_updated_at = new Date().toISOString();

    const newC = { id: tempId, name: newName.trim(), startDate: newDate, package: newPkg, tasks: initialTasks, followups: [] };
    
    setLoading(true);
    try {
      const saved = await upsertClient(newC);
      const readyC = { ...newC, id: saved.id }; // Use the real ID from database
      setClients(p => {
        const next = [...p, readyC];
        clientsRef.current = next;
        return next;
      }); 
      setSelId(readyC.id); 
      setAddingC(false);
      setNewName("");
      setNewClientName("");
      setNewWebsite("");
      setNewDriveLink("");
      setNewBD("");
      toast.success("Client added successfully");
    } catch (e) {
      toast.error("Failed to save client: " + e.message);
    }
    setLoading(false);
  };

  const genSOP = async (name) => {
    if (sops[name] || sel?.tasks?.__sops?.[name]) return;
    setSopLoad(true);
    await new Promise(r => setTimeout(r, 1000));
    const txt = `**Procedure for ${name}**\n\n1. Review parameters.\n2. Execute workflow.\n3. Log completion.`;
    setSops(p => ({ ...p, [name]: txt })); setSopLoad(false);
  };

  const getAI = async () => {
    setAiLoad(true); 
    await new Promise(r => setTimeout(r, 1500));
    setAiText("1. Priority: Setup Drive Structure\n2. Next: Finalize Brand Board\n3. Review CRM Mapping");
    setAiLoad(false);
  };

  const renderMD = (txt) => {
    if (!txt) return "";
    let html = txt
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
    // Convert markdown links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #ea580c; text-decoration: underline; word-break: break-all;">$1</a>');
    
    // Convert remaining plain URLs (not inside href="...")
    html = html.replace(/(?<!href=["'])(https?:\/\/[^\s<]+)/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #ea580c; text-decoration: underline; word-break: break-all;">$1</a>');
    
    html = html.replace(/^# (.*$)/gm, '<h1 style="font-size: 1.5em; font-weight: 900; margin: 0.5em 0;">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.25em; font-weight: 800; margin: 0.4em 0;">$1</h2>')
      .replace(/^- (.*$)/gm, '<li style="margin-left: 1.2em; list-style-type: disc;">$1</li>')
      .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: 1.6 }} />;
  };

  if (!loaded) return <div style={{...S.root, alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, letterSpacing: 2, flexDirection: 'column', gap: 16}}>
    <div style={{ width: 40, height: 40, border: '3px solid #ffedd5', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <span>INITIALIZING SPREAD PIXEL OPS...</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>;

  if (fetchError) return (
    <div style={{...S.root, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24}}>
      <div style={{ background: '#fffbf7', borderRadius: 24, border: '1px solid #fed7aa', padding: '40px 48px', textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontWeight: 900, fontSize: 20, color: '#ea580c', marginBottom: 12 }}>Connection Error</h2>
        <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>Could not load client data from the database.</p>
        <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginBottom: 32, background: '#fff5ed', padding: '12px 16px', borderRadius: 12, fontFamily: 'monospace' }}>{fetchError}</p>
        <p style={{ color: '#10b981', fontSize: 13, fontWeight: 700, marginBottom: 24 }}>✅ Your client data is safe — this is a temporary connection issue.</p>
        <button onClick={loadClients} style={{ ...S.btn(true), width: '100%', justifyContent: 'center', padding: '16px' }}>🔄 Retry Connection</button>
      </div>
    </div>
  );

  if (access === 'none') {
    return (
      <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '100vh', padding: '24px', overflowY: 'auto' }}>
        <Toaster position="top-center" richColors />
        
        {/* Subtle Decorative Background Mesh */}
        <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-15%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none', filter: 'blur(50px)', zIndex: 0 }} />

        <motion.div 
          key="auth-card" 
          initial={{ opacity: 0, y: 16, scale: 0.98 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ 
            width: 'min(440px, 100%)', 
            background: '#ffffff', 
            borderRadius: 24, 
            border: '1px solid rgba(234, 88, 12, 0.12)', 
            boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(234, 88, 12, 0.04)', 
            padding: '36px 32px',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Spread<span style={{ color: '#ea580c' }}>Pixel</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>
                Operations Hub
              </div>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              {authStep === 'otp' ? 'Verification Code' : (authStep === 'newpassword' ? 'Set New Password' : (authView === 'login' ? 'Welcome Back' : (authView === 'forgot' ? 'Reset Password' : 'Create Account')))}
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>
              {authStep === 'otp' 
                ? `Enter the 6-digit code sent to ${uEmail}`
                : authStep === 'newpassword'
                ? 'Create a strong, secure password for your profile.'
                : authView === 'forgot' 
                ? 'Enter your registered email address to receive a recovery code.'
                : authView === 'login'
                ? 'Sign in to access your operations dashboard.'
                : 'Join the SpreadPixel operations management team.'}
            </p>
          </div>

          {/* Segmented Tab Switcher (Only on Credentials step for Login / Sign Up) */}
          {authStep === 'credentials' && authView !== 'forgot' && (
            <div style={{ display: 'flex', background: '#fff5ed', padding: 4, borderRadius: 14, marginBottom: 24, border: '1px solid rgba(234,88,12,0.08)' }}>
              <button 
                onClick={() => { setAuthView('login'); setAuthError(''); }}
                style={{ 
                  flex: 1, padding: '9px 0', borderRadius: 11, fontSize: 13, fontWeight: 700,
                  background: authView === 'login' ? '#ffffff' : 'transparent',
                  color: authView === 'login' ? '#ea580c' : '#64748b',
                  boxShadow: authView === 'login' ? '0 2px 8px rgba(15,23,42,0.06)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthView('signup'); setAuthError(''); }}
                style={{ 
                  flex: 1, padding: '9px 0', borderRadius: 11, fontSize: 13, fontWeight: 700,
                  background: authView === 'signup' ? '#ffffff' : 'transparent',
                  color: authView === 'signup' ? '#ea580c' : '#64748b',
                  boxShadow: authView === 'signup' ? '0 2px 8px rgba(15,23,42,0.06)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer'
                }}
              >
                Register
              </button>
            </div>
          )}

          {/* Error Banner */}
          {authError && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, 
                padding: '10px 14px', color: '#b91c1c', fontSize: 12, fontWeight: 600, 
                marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 
              }}
            >
              <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{authError}</span>
            </motion.div>
          )}

          {/* Step 1: Credentials Form */}
          {authStep === 'credentials' ? (
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {authView === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      style={{ ...S.input, paddingLeft: 40 }} 
                      value={uName} 
                      onChange={e => setUName(e.target.value)} 
                      placeholder="e.g. Muneeb Bhatti" 
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    style={{ ...S.input, paddingLeft: 40 }} 
                    value={uEmail} 
                    onChange={e => setUEmail(e.target.value)} 
                    placeholder="name@spreadpixel.com" 
                  />
                </div>
              </div>

              {authView !== 'forgot' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                    {authView === 'login' && (
                      <span 
                        onClick={() => { setAuthView('forgot'); setAuthStep('credentials'); setAuthError(''); }}
                        style={{ fontSize: 12, color: '#ea580c', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Forgot Password?
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type={showPass ? "text" : "password"} 
                      style={{ ...S.input, paddingLeft: 40, paddingRight: 40 }} 
                      value={uPass} 
                      onChange={e => setUPass(e.target.value)} 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {authView === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Position / Role</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <select 
                      style={{ 
                        ...S.input, paddingLeft: 40, appearance: 'none', cursor: 'pointer',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ea580c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, 
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', backgroundSize: '15px' 
                      }} 
                      value={uRole} 
                      onChange={e => setURole(e.target.value)}
                    >
                      <option value="member">Team Member</option>
                      {Object.keys(ROLES).map(k => (
                        <option key={k} value={k}>{ROLES[k].label}</option>
                      ))}
                      <option value="admin">Executive Administrator (Admin Only)</option>
                    </select>
                  </div>
                </div>
              )}

              {authView === 'signup' && uRole === 'admin' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Administrative Passkey</label>
                  <input 
                    type="password" 
                    style={{ ...S.input, border: '1px solid rgba(234,88,12,0.35)', background: '#fff7ed' }} 
                    value={adminToken} 
                    onChange={e => setAdminToken(e.target.value)} 
                    placeholder="Enter Secret Passkey" 
                  />
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Required to authorize admin onboarding privileges.</div>
                </motion.div>
              )}

              <button 
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  setAuthError("");
                  if (!uEmail) return toast.error("Please enter your email");
                  if (authView !== 'forgot' && !uPass) return toast.error("Please enter password");
                  
                  setLoading(true);
                  try {
                    if (authView === 'login') {
                      const u = await signInUser(uEmail, uPass);
                      if (!u) throw new Error("Invalid email or password.");
                      
                      setUser(u);
                      setAccess((u.role || uRole || 'member').toLowerCase());
                      sessionStorage.setItem("flc_user", JSON.stringify(u));
                      sessionStorage.setItem("flc_access", (u.role || uRole || 'member').toLowerCase());
                      toast.success("Welcome back! Signed in successfully.");
                      setLoading(false);
                      return;
                    }

                    if (authView === 'signup') {
                      if (uRole === 'admin' && adminToken !== ADMIN_SECRET) {
                        throw new Error("Invalid Administrative Passkey.");
                      }
                      const { data: existing } = await supabase.from('flc_ops_users').select('id').ilike('email', uEmail.trim()).maybeSingle();
                      if (existing) throw new Error("User already exists with this email.");
                    } else if (authView === 'forgot') {
                      const { data: userExist } = await supabase.from('flc_ops_users').select('id').ilike('email', uEmail.trim()).maybeSingle();
                      if (!userExist) throw new Error("No account found with this email.");
                    }

                    const apiPath = authView === 'forgot' ? '/api/auth/request-password-reset' : '/api/auth/send-otp';
                    const res = await fetch(apiPath, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: uEmail, password: uPass, isLogin: false })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to send verification code');

                    setAuthStep('otp');
                    setOtpCode(data.devCode || ""); 
                    if (authView === 'forgot') setUPass(""); 
                    if (data.devCode) {
                      toast.success(`Verification Code: ${data.devCode}`, { duration: 15000 });
                    } else {
                      toast.success("Verification code sent to your email!");
                    }
                  } catch (err) {
                    toast.error(err.message);
                    setAuthError(err.message);
                  }
                  setLoading(false);
                }}
                disabled={loading}
                style={{ 
                  marginTop: 8, padding: '14px 20px', borderRadius: 14, fontSize: 14, fontWeight: 800,
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: loading ? 'not-allowed' : 'pointer', border: 'none',
                  boxShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.35)', transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Processing...' : (authView === 'login' ? 'Sign In to OpsHub' : (authView === 'forgot' ? 'Send Recovery Code' : 'Continue to Verification'))}
                {!loading && <ArrowRight size={16} />}
              </button>

              {authView === 'forgot' && (
                <div 
                  onClick={() => { setAuthView('login'); setAuthStep('credentials'); setAuthError(''); }}
                  style={{ textAlign: 'center', fontSize: 13, color: '#64748b', cursor: 'pointer', fontWeight: 600, marginTop: 4 }}
                >
                  ← Back to Sign In
                </div>
              )}
            </form>
          ) : (
            /* Step 2: OTP Verification & New Password Step */
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {authStep === 'otp' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', marginBottom: 12 }}>Enter 6-Digit Code</label>
                  <input 
                    style={{ 
                      ...S.input, fontSize: 32, fontWeight: 900, textAlign: 'center', letterSpacing: 10, height: 60,
                      background: '#fffaf5', border: '2px solid rgba(234,88,12,0.25)', color: '#ea580c'
                    }} 
                    value={otpCode} 
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="000000" 
                    autoFocus
                  />
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const apiPath = authView === 'forgot' ? '/api/auth/request-password-reset' : '/api/auth/send-otp';
                          const res = await fetch(apiPath, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: uEmail, password: uPass, isLogin: false })
                          });
                          const data = await res.json();
                          if (data.devCode) setOtpCode(data.devCode);
                          toast.success("New code sent to your email!");
                        } catch (e) {
                          toast.error("Failed to resend code");
                        }
                      }}
                      style={{ fontSize: 12, color: '#ea580c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Didn't get the code? Resend
                    </button>
                  </div>
                </div>
              )}

              {authView === 'forgot' && authStep === 'newpassword' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Create New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type={showPass ? "text" : "password"} 
                      style={{ ...S.input, paddingLeft: 40, paddingRight: 40 }} 
                      value={uPass} 
                      onChange={e => setUPass(e.target.value)} 
                      placeholder="Enter new password" 
                      autoFocus
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  setAuthError("");
                  if (authStep === 'otp') {
                    if (otpCode.length !== 6) return toast.error("Please enter 6-digit code");
                    setOtpLoading(true);
                    try {
                      const res = await fetch('/api/auth/verify-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: uEmail, code: otpCode, isLogin: false, password: uPass })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Invalid or expired verification code');

                      if (authView === 'forgot') {
                        setAuthStep('newpassword');
                        setUPass(""); 
                      } else {
                        let u = data.user;
                        const signupRes = await fetch('/api/auth/signup', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: uName, email: uEmail, password: uPass, role: uRole })
                        });
                        const signupData = await signupRes.json();
                        if (!signupRes.ok) throw new Error(signupData.error || 'Account creation failed');
                        u = signupData.user;
                        
                        setUser(u);
                        setAccess((u.role || uRole || 'member').toLowerCase());
                        sessionStorage.setItem("flc_user", JSON.stringify(u));
                        sessionStorage.setItem("flc_access", (u.role || uRole || 'member').toLowerCase());
                        toast.success("Account created! Signed in successfully.");
                      }
                    } catch (err) { 
                      toast.error(err.message); 
                      setAuthError(err.message);
                    }
                    setOtpLoading(false);
                  } else if (authStep === 'newpassword') {
                    if (!uPass) return toast.error("Please enter a new password");
                    setOtpLoading(true);
                    try {
                      const res = await fetch('/api/auth/update-forgotten-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: uEmail, newPassword: uPass })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Password update failed');
                      
                      toast.success("Password updated successfully! Please sign in with your new password.");
                      setAuthView('login');
                      setAuthStep('credentials');
                      setUPass("");
                      setOtpCode("");
                    } catch (err) {
                      toast.error(err.message);
                      setAuthError(err.message);
                    }
                    setOtpLoading(false);
                  }
                }}
                disabled={otpLoading}
                style={{ 
                  padding: '14px 20px', borderRadius: 14, fontSize: 14, fontWeight: 800,
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: otpLoading ? 'not-allowed' : 'pointer', border: 'none',
                  boxShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.35)', transition: 'all 0.2s ease'
                }}
              >
                {otpLoading ? 'Verifying...' : (authStep === 'otp' ? 'Confirm Verification Code' : 'Save New Password & Sign In')}
                {!otpLoading && <CheckCircle2 size={16} />}
              </button>

              <div 
                onClick={() => {
                  setAuthStep('credentials');
                  if (authView === 'forgot') setAuthView('login');
                }}
                style={{ textAlign: 'center', fontSize: 13, color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
              >
                ← {authView === 'forgot' ? 'Back to Sign In' : 'Change Email or Details'}
              </div>
            </form>
          )}

          {/* Trust & Security Footer */}
          <div style={{ borderTop: '1px solid rgba(15,23,42,0.06)', marginTop: 24, paddingTop: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span>🔒 256-bit Encrypted Session</span>
              <span>•</span>
              <span>SpreadPixel Network</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const cDay = dayNum();
  const pkg = PACKAGES.find(p => p.id === sel?.package) || PACKAGES[1];
  const totalDone = sel && sel.tasks ? cTasks.filter(t => sel.tasks[t.id]?.done).length : 0;
  const totalPct = cTasks.length ? Math.round(totalDone / cTasks.length * 100) : 0;

  const EvidenceInput = ({ taskId, initialValue, onSave }) => {
    const [val, setVal] = useState(initialValue || "");

    useEffect(() => {
      setVal(initialValue || "");
    }, [initialValue]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Evidence / Deliverable Log
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input 
            type="text"
            value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={() => onSave(taskId, val)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSave(taskId, val);
                e.currentTarget.blur();
              }
            }}
            placeholder="Paste Link (Drive, Loom, etc.) or description..."
            style={{
              flex: 1,
              padding: '8px 12px',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 8,
              fontSize: 12,
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
          />
          {val !== (initialValue || "") && (
            <button
              onClick={() => {
                onSave(taskId, val);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: '#ea580c',
                color: '#fff',
                border: 'none',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>
    );
  };

  const MemberMyTasksView = () => {
    const userName = (user?.name || "").trim().toLowerCase();
    const userRole = access.toUpperCase();
    const isSpecificRole = Object.keys(ROLES).includes(userRole);
    const assignedRoleName = (ROLE_TO_NAME[userRole] || "").trim().toLowerCase();

    const matchesUser = (t) => {
      // Get the assigned person's name for this task's role
      const taskAssigneeName = (ROLE_TO_NAME[t.role] || t.role || "").trim().toLowerCase();
      // Match strictly based on user's name
      return userName && taskAssigneeName === userName;
    };

    const missedTasks = useMemo(() => {
      if (!sel || !cTasks) return [];
      return cTasks.filter(t => {
        if (!matchesUser(t)) return false;
        const st = sel.tasks?.[t.id] || { done: false };
        if (st.done) return false;
        const actualDay = workingDayMap[t.day] || t.day;
        return actualDay < cDay;
      });
    }, [cTasks, cDay, userRole, userName, assignedRoleName]);

    const todayTasks = useMemo(() => {
      if (!sel || !cTasks) return [];
      return cTasks.filter(t => {
        if (!matchesUser(t)) return false;
        const actualDay = workingDayMap[t.day] || t.day;
        return actualDay === cDay;
      });
    }, [cTasks, cDay, userRole, userName, assignedRoleName]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0 }}>My Daily Tasks</h2>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              Showing your tasks for <strong style={{ color: '#0f172a' }}>{sel?.name || 'Assigned Client'}</strong> • Day {cDay} {isSpecificRole && `(${ROLES[userRole]?.label})`}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Missed Tasks Section */}
          <div className="card-padding" style={{ ...S.card, borderLeft: '4px solid #ea580c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertTriangle size={18} color="#ea580c" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Missed / Pending Tasks</h3>
              <span style={S.badge('#ea580c')}>{missedTasks.length}</span>
            </div>
            {missedTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {missedTasks.map(t => {
                  const st = sel.tasks?.[t.id] || { done: false, notes: "" };
                  return (
                    <div key={t.id} style={{ padding: '16px', background: '#fff5ed', borderRadius: '16px', border: '1px solid rgba(234,88,12,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#ea580c' }}>Day {t.day} Deliverable</span>
                      </div>
                      <TaskItem task={t} />
                      <div style={{ paddingLeft: 38, borderLeft: '2px solid #fed7aa' }}>
                        <EvidenceInput 
                          taskId={t.id} 
                          initialValue={st.notes} 
                          onSave={(id, val) => {
                            updateTaskData(id, { notes: val });
                            toast.success("Evidence saved successfully!");
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: 13, background: '#fff5ed', borderRadius: 12, border: '1px dashed rgba(234,88,12,0.12)', fontWeight: 500 }}>
                No missed tasks! You're all caught up.
              </div>
            )}
          </div>

          {/* Today's Tasks Section */}
          <div className="card-padding" style={{ ...S.card, borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Calendar size={18} color="#10b981" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Today's Tasks (Day {cDay})</h3>
              <span style={S.badge('#10b981')}>{todayTasks.length}</span>
            </div>
            {todayTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {todayTasks.map(t => {
                  const st = sel.tasks?.[t.id] || { done: false, notes: "" };
                  return (
                    <div key={t.id} style={{ padding: '16px', background: '#fff5ed', borderRadius: '16px', border: '1px solid rgba(234,88,12,0.06)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <TaskItem task={t} />
                      <div style={{ paddingLeft: 38, borderLeft: '2px solid #fed7aa' }}>
                        <EvidenceInput 
                          taskId={t.id} 
                          initialValue={st.notes} 
                          onSave={(id, val) => {
                            updateTaskData(id, { notes: val });
                            toast.success("Evidence saved successfully!");
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: 13, background: '#fff5ed', borderRadius: 12, border: '1px dashed rgba(234,88,12,0.12)', fontWeight: 500 }}>
                No tasks scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }) => {
    const st = sel?.tasks[task.id] || { done: false };
    const locked = isLocked(task.id);
    const isRoleKey = Object.keys(ROLES).includes(task.role);
    const displayName = isRoleKey ? (ROLE_TO_NAME[task.role] || task.role) : task.role;
    const badgeColor = isRoleKey ? (ROLES[task.role]?.color || '#ea580c') : '#ea580c';
    const ready = !locked && !st.done && task.deps && task.deps.length > 0 && task.deps.every(d => sel.tasks[d]?.done);

    return (
      <motion.div 
        layout
        className="task-item-card"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 12, 
          padding: '12px 14px', 
          borderRadius: 12, 
          marginBottom: 6,
          background: st.done ? '#f8fafc' : (ready ? '#ecfdf5' : '#ffffff'), 
          border: `1px solid ${st.done ? '#e2e8f0' : (ready ? '#a7f3d0' : 'rgba(234,88,12,0.12)')}`,
          opacity: locked ? 0.5 : 1, 
          boxShadow: st.done ? 'none' : '0 1px 4px rgba(15,23,42,0.03)',
          transition: 'all 0.15s ease'
        }}
      >
        {/* Left Area: Checkbox & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div 
            onClick={() => isMember && toggleTask(task.id)}
            style={{ 
              width: 20, 
              height: 20, 
              borderRadius: 6, 
              border: `2px solid ${st.done ? '#ea580c' : '#cbd5e1'}`,
              background: st.done ? '#ea580c' : '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: (locked || !isMember) ? 'default' : 'pointer',
              flexShrink: 0, 
              transition: 'all 0.15s ease'
            }}
          >
            {st.done && <CheckCircle2 size={13} color="#fff" />}
            {locked && <Lock size={9} color="#94a3b8" />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ 
                fontSize: 13, 
                fontWeight: st.done ? 500 : 700, 
                color: st.done ? '#94a3b8' : '#0f172a', 
                textDecoration: st.done ? 'line-through' : 'none', 
                letterSpacing: '-0.01em',
                lineHeight: 1.3
              }}>
                {task.n}
              </span>

              {ready && <span style={{ ...S.badge('#10b981'), fontSize: 9.5, padding: '1px 6px' }}>Ready</span>}
              {task.freq && !task.isPost && <span style={{ ...S.badge('#818cf8'), fontSize: 9.5, padding: '1px 6px' }}>{task.freq}</span>}

              {st.assigned && access !== 'client' && (
                <span style={{ ...S.badge(st.timerActive ? '#f59e0b' : '#3b82f6'), display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9.5, padding: '1px 6px' }}>
                  ⏱ {formatTaskDuration(st)}
                  {st.timerActive && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />}
                </span>
              )}
            </div>

            {st.notes && (
              <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5, width: '100%', minWidth: 0 }}>
                <div style={{ padding: '1px 5px', background: '#ffedd5', color: '#ea580c', borderRadius: 4, fontWeight: 800, fontSize: 8.5, textTransform: 'uppercase', flexShrink: 0 }}>Log</div>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>{st.notes.replace(/\n/g, ' ')}</span>
              </div>
            )}
            {st.review && (
              <div style={{ fontSize: 10.5, color: '#0ea5e9', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5, width: '100%', minWidth: 0 }}>
                <div style={{ padding: '1px 5px', background: '#e0f2fe', color: '#0ea5e9', borderRadius: 4, fontWeight: 800, fontSize: 8.5, textTransform: 'uppercase', flexShrink: 0 }}>Review</div>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>{st.review.replace(/\n/g, ' ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Assignee & Action Buttons */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {isTeamLead && !st.done && (
            !st.assigned ? (
              <button 
                title="Assign Task" 
                onClick={() => assignTask(task.id)} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, 
                  border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', 
                  fontSize: 10.5, fontWeight: 700, cursor: 'pointer'
                }}
              >
                <UserCheck size={11} /> Assign
              </button>
            ) : (
              <span 
                onClick={() => assignTask(task.id)}
                style={{ fontSize: 10, color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, background: '#ecfdf5', padding: '2px 7px', borderRadius: 6, border: '1px solid #a7f3d0' }} 
                title="Click to re-assign"
              >
                <UserCheck size={11} color="#059669" /> {st.assignedBy || 'Assigned'}
              </span>
            )
          )}

          {isMember && st.assigned && !st.done && (
            st.timerActive ? (
              <button 
                title="Pause Timer" 
                onClick={() => pauseTimer(task.id)} 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%',
                  border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer'
                }}
              >
                <Pause size={10} fill="#fff" />
              </button>
            ) : (
              <button 
                title="Start Timer" 
                onClick={() => startTimer(task.id)} 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%',
                  border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer'
                }}
              >
                <Play size={10} fill="#fff" style={{ marginLeft: 1 }} />
              </button>
            )
          )}

          <button 
            title="Task Notes / Log"
            onClick={() => setModal({type: 'notes', task, nm: task.n})} 
            style={{
              color: st.review ? '#0ea5e9' : (st.notes ? '#ea580c' : '#94a3b8'), 
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', display: 'flex', padding: 5,
              position: 'relative'
            }}
          >
            <MessageSquare size={13} />
            {access === 'client' && st.done && !st.review && <span style={{ position: 'absolute', top: -3, right: -3, width: 6, height: 6, background: '#0ea5e9', borderRadius: '50%', border: '1.5px solid #fff' }} />}
          </button>

          {isMember && (
            <button 
              title="View SOP" 
              onClick={() => { setModal({type: 'sop', task, nm: task.n}); genSOP(task.n); }} 
              style={{ color: '#059669', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, cursor: 'pointer', display: 'flex', padding: 5 }}
            >
              <BookOpen size={13} />
            </button>
          )}

          {isAdmin && (
            <>
              <button title="Edit Task" onClick={() => setTaskModal({ type: 'edit', task })} style={{ color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, cursor: 'pointer', display: 'flex', padding: 5 }}>
                <Settings size={13} />
              </button>
              <button title="Delete Task" onClick={() => deleteTaskDef(task.id)} style={{ color: '#e11d48', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 6, cursor: 'pointer', display: 'flex', padding: 5 }}>
                <Trash2 size={13} />
              </button>
            </>
          )}

          <span style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 6,
            background: `${badgeColor}15`,
            color: badgeColor,
            border: `1px solid ${badgeColor}35`,
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            {displayName || '??'}
          </span>
        </div>
      </motion.div>
    );
  };

  const PaymentGate = ({ month }) => {
    const status = sel?.tasks?.[`__payment_month${month}_status`] || 'pending';
    const screenshot = sel?.tasks?.[`__payment_month${month}_screenshot`] || '';
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large. Please upload an image under 2MB.");
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setPreviewUrl(base64data);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    };

    const submitScreenshot = async () => {
      if (!previewUrl) {
        toast.error("Please select an image screenshot first.");
        return;
      }
      try {
        const nowStr = new Date().toISOString();
        const currentLatest = clientsRef.current.find(c => c.id === selId);
        if (!currentLatest) return;
        const updatedTasks = {
          ...(currentLatest.tasks || {}),
          __updated_at: nowStr,
          [`__payment_month${month}_screenshot`]: previewUrl,
          [`__payment_month${month}_status`]: 'submitted',
          [`__payment_month${month}_updated_at`]: nowStr,
        };
        const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
        const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
        clientsRef.current = next;
        setClients(next);
        sync(updatedClient);
        toast.success(`Month ${month} payment screenshot submitted successfully!`);
      } catch (err) {
        toast.error("Failed to submit payment screenshot: " + err.message);
      }
    };

    const handleApprove = () => {
      const nowStr = new Date().toISOString();
      const currentLatest = clientsRef.current.find(c => c.id === selId);
      if (!currentLatest) return;
      const updatedTasks = {
        ...(currentLatest.tasks || {}),
        __updated_at: nowStr,
        [`__payment_month${month}_status`]: 'approved',
        [`__payment_month${month}_updated_at`]: nowStr,
      };
      const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
      const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
      clientsRef.current = next;
      setClients(next);
      sync(updatedClient);
      toast.success(`Month ${month} payment approved and access unlocked!`);
    };

    const handleReject = () => {
      const nowStr = new Date().toISOString();
      const currentLatest = clientsRef.current.find(c => c.id === selId);
      if (!currentLatest) return;
      const updatedTasks = {
        ...(currentLatest.tasks || {}),
        __updated_at: nowStr,
        [`__payment_month${month}_status`]: 'rejected',
        [`__payment_month${month}_screenshot`]: null,
        [`__payment_month${month}_updated_at`]: nowStr,
      };
      const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
      const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
      clientsRef.current = next;
      setClients(next);
      sync(updatedClient);
      toast.error(`Month ${month} payment rejected. User notified to re-upload.`);
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(20px)',
        borderRadius: 32,
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        maxWidth: 680,
        margin: '40px auto',
        textAlign: 'center'
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #fecaca 0%, #fee2e2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
          marginBottom: 24,
          boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.1)'
        }}>
          <Lock size={36} />
        </div>

        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>
          Month {month} Access Locked
        </h3>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, maxWidth: 480, marginBottom: 32 }}>
          To view the tasks for <strong>{month === 2 ? 'Day 31-60' : 'Day 61-90'}</strong>, please provide a screenshot of the Month {month} payment confirmation.
        </p>

        {status === 'pending' || status === 'rejected' ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {status === 'rejected' && (
              <div style={{
                width: '100%',
                padding: '12px 16px',
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#ef4444',
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
                <AlertTriangle size={16} /> Previous submission was rejected. Please upload a valid payment screenshot.
              </div>
            )}
            
            <div style={{
              width: '100%',
              minHeight: 180,
              border: '2px dashed rgba(220, 38, 38, 0.3)',
              borderRadius: 20,
              background: '#fff5f5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s',
              overflow: 'hidden'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)'}
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Payment Screenshot Preview" 
                  style={{
                    maxHeight: 140,
                    maxWidth: '100%',
                    borderRadius: 10,
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <>
                  <div style={{ color: '#dc2626', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                    {uploading ? 'Processing Image...' : 'Click to Upload Screenshot'}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>
                    PNG, JPG or JPEG up to 2MB
                  </div>
                </>
              )}
            </div>

            {previewUrl && (
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button 
                  onClick={() => setPreviewUrl('')} 
                  style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}
                >
                  Clear Selection
                </button>
                <button 
                  onClick={submitScreenshot} 
                  style={{ ...S.btn(true), flex: 2, justifyContent: 'center' }}
                >
                  Submit Screenshot
                </button>
              </div>
            )}
          </div>
        ) : status === 'submitted' ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 99,
              background: '#fef3c7',
              color: '#d97706',
              fontSize: 13,
              fontWeight: 800,
              border: '1px solid #fde68a'
            }}>
              <Clock size={16} /> Awaiting Admin Approval
            </div>

            {screenshot && (
              <div style={{
                width: '100%',
                padding: 12,
                borderRadius: 20,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}>
                <img 
                  src={screenshot} 
                  alt="Submitted Payment Screenshot" 
                  style={{
                    maxHeight: 200,
                    maxWidth: '100%',
                    borderRadius: 12,
                    objectFit: 'contain',
                    cursor: 'zoom-in'
                  }}
                  onClick={() => {
                    const w = window.open();
                    w.document.write(`<img src="${screenshot}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                  }}
                />
              </div>
            )}

            {isMember ? (
              <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                <button 
                  onClick={handleReject} 
                  style={{ ...S.btn(false), flex: 1, justifyContent: 'center', background: '#fef2f2', color: '#ef4444', borderColor: '#fecaca' }}
                >
                  Reject & Re-request
                </button>
                <button 
                  onClick={handleApprove} 
                  style={{ ...S.btn(true), flex: 1, justifyContent: 'center', background: '#10b981', color: '#ffffff' }}
                >
                  Approve & Unlock
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: '#64748b' }}>
                Your payment screenshot has been uploaded. An administrator will review and unlock your workspace shortly.
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div style={S.root}>
      <Toaster position="top-center" richColors />
      {/* Toggle Overlay for Mobile */}
      {sidebarOpen && window.innerWidth <= 1024 && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(4px)' }} 
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        ...S.sidebar, 
        width: 280,
        position: window.innerWidth <= 1024 ? 'fixed' : 'relative',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-280px)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 100
      }}>
        <div className="custom-scrollbar" style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, width: '100%', position: 'relative', flexShrink: 0, paddingBottom: 16, borderBottom: '1px solid rgba(234,88,12,0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Spread<span style={{ color: '#ea580c' }}>Pixel</span>
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
                Ops Hub
              </span>
            </div>
            {window.innerWidth <= 1024 && (
              <button onClick={() => setSidebarOpen(false)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', right: 0 }}><X size={20} /></button>
            )}
          </div>

          {/* Search bar for clients */}
          {clients.filter(c => c.package !== 'lead').length > 3 && (
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={clientFilterText} 
                onChange={e => setClientFilterText(e.target.value)}
                style={{ 
                  width: '100%', padding: '8px 12px 8px 32px', background: '#fff5ed', border: '1px solid rgba(234,88,12,0.12)',
                  borderRadius: 12, fontSize: 12, color: '#0f172a', outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ flex: 1 }}>
            {clients
              .filter(c => c.package !== 'lead' && (access !== 'client' || c.id === selId))
              .filter(c => !clientFilterText || c.name.toLowerCase().includes(clientFilterText.toLowerCase()) || (c.tasks?.__client_name && c.tasks.__client_name.toLowerCase().includes(clientFilterText.toLowerCase())))
              .map(c => {
                const totalTasks = (c.tasks?.__defs || DEFAULT_TASKS).length || 1;
                const completedTasks = (c.tasks?.__defs || DEFAULT_TASKS).filter(t => c.tasks?.[t.id]?.done).length;
                const pct = Math.round((completedTasks / totalTasks) * 100);
                const isSelected = selId === c.id;
                return (
                  <div 
                    key={c.id} 
                    onClick={() => { setSelId(c.id); if (tab === 'team' || tab === 'live') setTab('sprint'); }}
                    style={{ 
                      padding: '12px 14px', borderRadius: 14, cursor: 'pointer', marginBottom: 8,
                      background: isSelected ? 'linear-gradient(135deg, rgba(234,88,12,0.08) 0%, rgba(255,245,237,0.8) 100%)' : '#ffffff',
                      border: isSelected ? '1px solid rgba(234,88,12,0.3)' : '1px solid rgba(15,23,42,0.06)',
                      boxShadow: isSelected ? '0 4px 12px rgba(234,88,12,0.06)' : '0 1px 2px rgba(15,23,42,0.02)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, color: isSelected ? '#ea580c' : '#0f172a', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                        {c.tasks?.__client_name && <div style={{ fontSize: 11, color: '#64748b', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.tasks.__client_name}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? '#ea580c' : '#94a3b8' }}>{pct}%</span>
                        {isAdmin && (
                          <div style={{ display: 'flex', gap: 6, marginLeft: 2 }}>
                            <Edit3 size={12} style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); openEditModalForClient(c); }} />
                            <Trash2 size={12} style={{ color: '#ea580c', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDeleteClient(c); }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ height: 4, background: '#f1f5f9', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: isSelected ? 'linear-gradient(90deg, #ea580c, #f97316)' : '#cbd5e1', borderRadius: 99, transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                );
              })}
          </div>

          {isAdmin && (
            <button 
              onClick={() => { setAddingC(true); setNewName(""); setNewWebsite(""); setNewDriveLink(""); setNewClientName(""); setNewBD(""); }} 
              style={{ width: '100%', padding: '12px', border: '1px dashed rgba(234,88,12,0.25)', background: '#fffaf5', borderRadius: 14, color: '#ea580c', margin: '8px 0', cursor: 'pointer', flexShrink: 0, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Plus size={14} /> Add New Client
            </button>
          )}
        </div>

        <div style={{ padding: '0 24px 24px', flexShrink: 0 }}>
          <button 
            onClick={() => { setAccess('none'); setAuthView('landing'); sessionStorage.removeItem('flc_access'); sessionStorage.removeItem('flc_user'); }}
            style={{ width: '100%', padding: '16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12, background: '#fff5ed', color: '#64748b', border: '1px solid rgba(234,88,12,0.08)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            <LogOut size={16} /> Sign Out System
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main style={S.main}>
        <header style={{ ...S.header, padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Left Block: Client Identity & Quick Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
            {(!sidebarOpen || window.innerWidth <= 1024) && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}>
                <LayoutDashboard size={22} />
              </button>
            )}
            {sel ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #ea580c, #f97316)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18,
                  boxShadow: '0 2px 10px rgba(234, 88, 12, 0.22)',
                  flexShrink: 0
                }}>
                  {sel.name?.[0]?.toUpperCase() || 'C'}
                </div>

                <h2 style={{ fontWeight: 900, fontSize: 20, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {sel.name}
                  {syncing && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}><Clock size={15} color="#ea580c" /></motion.div>}
                </h2>
                
                <span style={{ ...S.badge(pkg.color), background: `${pkg.color}12`, border: `1px solid ${pkg.color}30`, fontWeight: 800, fontSize: 11, padding: '4px 10px' }}>
                  {pkg.label}
                </span>

                {sel.tasks?.__is_paused ? (
                  <span style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontWeight: 800, fontSize: 11, padding: '4px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Pause size={12} color="#dc2626" /> PAUSED (Day {cDay}/90)
                  </span>
                ) : (
                  <span style={{ ...S.badge('#ea580c'), display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '4px 10px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ea580c', display: 'inline-block' }} />
                    Day {cDay}/90
                  </span>
                )}

                <div style={{ width: 1, height: 16, background: '#fed7aa', margin: '0 2px' }} />

                {sel.tasks?.__website && (
                  <a 
                    href={sel.tasks.__website.startsWith('http') ? sel.tasks.__website : `https://${sel.tasks.__website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ea580c', fontWeight: 700, textDecoration: 'none', background: '#fff5ed', padding: '5px 12px', borderRadius: 9, border: '1px solid #fed7aa' }}
                  >
                    <Globe size={13} /> {sel.tasks.__website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}

                {sel.tasks?.__drive_link ? (
                  <a 
                    href={sel.tasks.__drive_link.startsWith('http') ? sel.tasks.__drive_link : `https://${sel.tasks.__drive_link}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ea580c', fontWeight: 700, textDecoration: 'none', background: '#fff5ed', padding: '5px 12px', borderRadius: 9, border: '1px solid #fed7aa' }}
                  >
                    <FolderOpen size={13} /> Drive
                  </a>
                ) : isAdmin ? (
                  <button 
                    onClick={() => {
                      setEditId(sel.id);
                      setEditNm(sel.name);
                      setNewPkg(sel.package);
                      setNewDate(sel.startDate);
                      setEditWebsite(sel.tasks?.__website || "");
                      setEditDriveLink("");
                      setEditClientName(sel.tasks?.__client_name || "");
                      setEditSlackId(sel.tasks?.__slack_id || "");
                      setEditBD(sel.tasks?.__assigned_bd || "");
                    }}
                    style={{ background: '#ffffff', border: '1px dashed #fed7aa', padding: '5px 12px', borderRadius: 9, fontSize: 12, color: '#ea580c', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    + Drive
                  </button>
                ) : null}

                <button 
                  onClick={() => setModal({ type: 'standard_notes', nm: `${sel.name} - Standard Notes` })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#0f172a', fontWeight: 700, background: '#ffffff', padding: '5px 12px', borderRadius: 9, border: '1px solid #fed7aa', cursor: 'pointer' }}
                >
                  <BookOpen size={13} color="#ea580c" /> Notes
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setModal({ type: 'share' })}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#ea580c', fontWeight: 700, background: '#fff5ed', padding: '5px 12px', borderRadius: 9, border: '1px solid #fed7aa', cursor: 'pointer' }}
                  >
                    <Share2 size={13} /> Share Portal
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={toggleClientPause}
                    title={sel.tasks?.__is_paused ? "Resume client operations" : "Pause client operations"}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: 9,
                      cursor: 'pointer',
                      border: sel.tasks?.__is_paused ? '1px solid #86efac' : '1px solid #fed7aa',
                      background: sel.tasks?.__is_paused ? '#f0fdf4' : '#ffffff',
                      color: sel.tasks?.__is_paused ? '#16a34a' : '#d97706',
                      boxShadow: sel.tasks?.__is_paused ? '0 2px 8px rgba(22, 163, 74, 0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {sel.tasks?.__is_paused ? <Play size={13} fill="#16a34a" /> : <Pause size={13} />}
                    {sel.tasks?.__is_paused ? 'Resume Work' : 'Stop / Pause'}
                  </button>
                )}
              </div>
            ) : (
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Operations Dashboard</span>
            )}
          </div>

          {/* Right Block: Clean Action Toolbar */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {isAdmin && (
              <button
                onClick={() => setTab(tab === 'live' ? 'sprint' : 'live')}
                style={{ ...S.btn(tab === 'live'), background: tab === 'live' ? '#ea580c' : '#fffbf7', color: tab === 'live' ? '#fff' : '#ea580c', border: '1px solid #fed7aa', padding: '8px 14px', fontSize: 12.5 }}
              >
                <TrendingUp size={14} /> <span className="mobile-hide">{tab === 'live' ? 'Tasks View' : 'Admin View'}</span>
              </button>
            )}
            {isMember && !isAdmin && (
              <button
                onClick={() => setTab('my-tasks')}
                style={{ ...S.btn(tab === 'my-tasks'), background: tab === 'my-tasks' ? '#ea580c' : '#fffbf7', color: tab === 'my-tasks' ? '#fff' : '#ea580c', border: '1px solid #fed7aa', padding: '8px 14px', fontSize: 12.5 }}
              >
                <CheckCircle2 size={14} /> <span className="mobile-hide">My Tasks</span>
              </button>
            )}
            {isMember && (
              <button
                onClick={() => setShowReport(true)}
                style={{ ...S.btn(false), background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '8px 14px', fontSize: 12.5 }}
              >
                <FileDown size={14} /> <span className="mobile-hide">Report</span>
              </button>
            )}
            {isBDOrAdmin && (
              <button
                onClick={() => setTab(tab === 'bd-hub' ? 'sprint' : 'bd-hub')}
                style={{ ...S.btn(tab === 'bd-hub'), background: tab === 'bd-hub' ? '#ea580c' : '#fff5ed', color: tab === 'bd-hub' ? '#fff' : '#0f172a', border: '1px solid #fed7aa', padding: '8px 14px', fontSize: 12.5 }}
              >
                <Layers size={14} /> <span className="mobile-hide">BD Hub</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setTab(tab === 'team' ? 'sprint' : 'team')}
                style={{ ...S.btn(tab === 'team'), background: tab === 'team' ? '#ea580c' : '#fff5ed', color: tab === 'team' ? '#fff' : '#0f172a', border: '1px solid #fed7aa', padding: '8px 14px', fontSize: 12.5 }}
              >
                <Users size={14} /> <span className="mobile-hide">Team</span>
              </button>
            )}
            
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#fff5ed',
                  border: '1px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ea580c',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    background: '#ea580c',
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: 15,
                    height: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Avatar */}
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ffedd5', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', fontWeight: 800, fontSize: 14 }}>
              {user?.name?.[0] || 'M'}
            </div>
          </div>
        </header>

        {/* Segmented Phase Navigation Bar (Shown on Client Task views) */}
        {sel && (tab === 'sprint' || tab.startsWith('ongoing')) && (
          <div className="tab-bar" style={{ padding: '14px 36px', borderBottom: '1px solid rgba(234,88,12,0.08)', background: '#fffbf7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', padding: '4px', background: '#ffffff', borderRadius: 14, border: '1px solid #fed7aa', boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }} className="tab-scroll">
              {[
                ["sprint", "Onboarding", "Day 1 – 15", Calendar, 1, 15],
                ["ongoing_8_30", "Month 1 Ops", "Day 16 – 30", BarChart3, 16, 30],
                ["ongoing_31_60", "Month 2 Scale", "Day 31 – 60", TrendingUp, 31, 60],
                ["ongoing_61_90", "Month 3 Review", "Day 61 – 90", CheckCircle2, 61, 90]
              ].map(([id, title, subtitle, Icon, minD, maxD]) => {
                const isSelected = tab === id;
                const phaseTasks = cTasks.filter(t => (id === 'sprint' ? t.phase === 'sprint' : t.phase === 'ongoing') && t.day >= minD && t.day <= maxD);
                const phaseDone = phaseTasks.filter(t => sel?.tasks?.[t.id]?.done).length;

                return (
                  <button 
                    key={id} 
                    onClick={() => { setTab(id); setPhase(id.startsWith('ongoing') ? 'ongoing' : id); }} 
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: isSelected ? '1px solid #ea580c' : '1px solid transparent',
                      background: isSelected ? 'linear-gradient(135deg, #ea580c, #f97316)' : 'transparent',
                      color: isSelected ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 3px 10px rgba(234, 88, 12, 0.22)' : 'none'
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: isSelected ? 'rgba(255,255,255,0.2)' : '#fff5ed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#ffffff' : '#ea580c'
                    }}>
                      <Icon size={14} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#ffffff' : '#0f172a' }}>{title}</span>
                        <span style={{
                          fontSize: 9.5,
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 5,
                          background: isSelected ? 'rgba(255,255,255,0.25)' : '#fff5ed',
                          color: isSelected ? '#ffffff' : '#ea580c',
                          border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid #fed7aa'
                        }}>
                          {phaseDone}/{phaseTasks.length}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.85)' : '#64748b' }}>
                        {subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Filter & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Filter size={15} style={{ position: 'absolute', left: 14, color: '#ea580c', pointerEvents: 'none' }} />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    padding: '10px 34px 10px 36px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: '1px solid rgba(234,88,12,0.2)',
                    background: '#fff7ed',
                    color: '#ea580c',
                    outline: 'none'
                  }}
                >
                  <option value="All">All Members</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown size={15} style={{ position: 'absolute', right: 12, color: '#ea580c', pointerEvents: 'none' }} />
              </div>

              <button
                onClick={() => setTodayDrawerOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  background: '#ea580c',
                  color: '#ffffff',
                  transition: 'all 0.15s',
                  outline: 'none',
                  boxShadow: '0 3px 8px rgba(234,88,12,0.22)'
                }}
              >
                <Calendar size={15} />
                <span>Today's Task</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setShowBulkModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: '1px solid #ddd6fe',
                    background: '#f5f3ff',
                    color: '#7c3aed',
                    transition: 'all 0.15s',
                    outline: 'none'
                  }}
                >
                  <Layers size={15} />
                  <span>Bulk Actions</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div style={S.content} className="main-content">
          {tab === 'bd-hub' ? (
            <BDHub clients={clients} setClients={setClients} user={user} isAdmin={isAdmin} isBDOrAdmin={isBDOrAdmin} onEditLead={openEditModalForClient} onOpenAiScorer={openAiScorerForClient} sel={sel} />
          ) : tab === 'team' && isAdmin ? (
            <TeamManagement clients={clients} />
          ) : tab === 'live' && isAdmin ? (
            <AdminLiveDash clients={clients} tasks={DEFAULT_TASKS} />
          ) : tab === 'my-tasks' && isMember ? (
            <MemberMyTasksView />
          ) : !sel ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <LayoutDashboard size={80} />
              <div style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}>Select a client to begin</div>
            </div>
          ) : (
            <>
              {/* Operations Paused Notification Banner */}
              {sel && sel.tasks?.__is_paused && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: 14,
                  padding: '14px 20px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                      <Pause size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>OPERATIONS PAUSED</span>
                        <span style={{ fontSize: 11, fontWeight: 800, background: '#fef3c7', border: '1px solid #fde68a', padding: '1px 8px', borderRadius: 6, color: '#b45309' }}>
                          Frozen on Day {cDay}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#b45309', marginTop: 2 }}>
                        Client timeline and active tracking are frozen. Scheduled operational dates will automatically shift forward upon resumption.
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={toggleClientPause}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12.5,
                        fontWeight: 800,
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                      }}
                    >
                      <Play size={14} fill="#ffffff" /> Resume Operations
                    </button>
                  )}
                </div>
              )}

              {/* Executive Metrics Ribbon */}
              {(() => {
                let minDay = 1;
                let maxDay = 15;
                if (tab === 'ongoing_8_30') { minDay = 16; maxDay = 30; }
                else if (tab === 'ongoing_31_60') { minDay = 31; maxDay = 60; }
                else if (tab === 'ongoing_61_90') { minDay = 61; maxDay = 90; }

                const pTasks = cTasks.filter(t => (tab === 'sprint' ? t.phase === 'sprint' : t.phase === 'ongoing') && t.day >= minDay && t.day <= maxDay);
                const pDone = pTasks.filter(t => sel?.tasks?.[t.id]?.done).length;
                const pPct = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : 0;
                const todayDueTasks = cTasks.filter(t => t.day === cDay);
                const todayDoneCount = todayDueTasks.filter(t => sel?.tasks?.[t.id]?.done).length;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginBottom: 28 }}>
                    <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff5ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                        <CheckCircle2 size={22} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phase Progress</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span>{pDone}/{pTasks.length}</span>
                          <span style={{ fontSize: 13, color: '#ea580c', fontWeight: 800 }}>({pPct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: 4, background: '#f1f5f9', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${pPct}%`, height: '100%', background: '#ea580c', borderRadius: 99, transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff5ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                        <Calendar size={22} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Today's Work (Day {cDay})</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                          {todayDoneCount} / {todayDueTasks.length} <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Completed</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#ea580c', fontWeight: 700, marginTop: 4, cursor: 'pointer' }} onClick={() => setTodayDrawerOpen(true)}>
                          Open Daily Drawer →
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 10px rgba(15,23,42,0.03)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${pkg.color}15`, border: `1px solid ${pkg.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: pkg.color }}>
                        <Sparkles size={22} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Package Service Tier</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pkg.label}
                        </div>
                        <div style={{ fontSize: 11, color: pkg.color, fontWeight: 800, marginTop: 2 }}>
                          PKR {pkg.price} / Month
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <AnimatePresence mode="wait">
                {tab === 'sprint' && (
                <motion.div key="sprint" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="responsive-grid">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(day => {
                    const dayTasks = cTasks.filter(t => t.phase === 'sprint' && t.day === day && (roleFilter === 'All' || t.role === roleFilter || ROLE_TO_NAME[t.role] === roleFilter));
                    if (!dayTasks.length && !isAdmin) return null;
                    
                    const effectiveStart = getEffectiveStartDate(sel);
                    const dayDate = effectiveStart ? new Date(new Date(effectiveStart + 'T00:00:00Z').getTime() + ((workingDayMap[day] || day) - 1) * 86400000) : null;
                    const weekday = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' }) : "";
                    const dateStr = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }) : "";
                    const isCurrentDay = (workingDayMap[day] || day) === cDay;
                    const dayDoneCount = dayTasks.filter(t => sel?.tasks?.[t.id]?.done).length;
                    const allDayDone = dayTasks.length > 0 && dayDoneCount === dayTasks.length;

                    return (
                      <div 
                        key={day} 
                        id={`day-card-${day}`} 
                        style={{
                          background: '#ffffff',
                          border: isCurrentDay ? '1.5px solid #ea580c' : (allDayDone ? '1px solid #a7f3d0' : '1px solid #fed7aa'),
                          borderRadius: 18,
                          padding: '16px 18px',
                          boxShadow: isCurrentDay ? '0 6px 20px rgba(234, 88, 12, 0.08)' : '0 2px 10px rgba(15,23,42,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(234,88,12,0.08)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: 9,
                              background: isCurrentDay ? 'linear-gradient(135deg, #ea580c, #f97316)' : (allDayDone ? '#ecfdf5' : '#fff5ed'),
                              color: isCurrentDay ? '#ffffff' : (allDayDone ? '#059669' : '#ea580c'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: 13,
                              boxShadow: isCurrentDay ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
                            }}>
                              {allDayDone ? <CheckCircle2 size={16} /> : day}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <h4 style={{ fontWeight: 800, fontSize: 14.5, color: '#0f172a', margin: 0 }}>
                                  Day {day} Onboarding
                                </h4>
                                {isAdmin && (
                                  <button 
                                    title="Add Task" 
                                    onClick={() => setTaskModal({ type: 'add', task: { id: 't'+Date.now(), phase: 'sprint', day, n: '', role: 'AM', deps: [] } })} 
                                    style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 6, cursor: 'pointer', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, padding: 0 }}
                                  >
                                    <Plus size={13} />
                                  </button>
                                )}
                              </div>
                              <div style={{ color: '#64748b', fontWeight: 600, fontSize: 11, marginTop: 1 }}>
                                {weekday}, {dateStr}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isCurrentDay && (
                              <span style={{ ...S.badge(sel?.tasks?.__is_paused ? '#d97706' : '#ea580c'), display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '2px 8px' }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: sel?.tasks?.__is_paused ? '#d97706' : '#ea580c', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
                                {sel?.tasks?.__is_paused ? 'Paused Today' : 'Active Today'}
                              </span>
                            )}
                            <span style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: allDayDone ? '#ecfdf5' : '#f8fafc',
                              color: allDayDone ? '#059669' : '#64748b',
                              border: `1px solid ${allDayDone ? '#a7f3d0' : '#e2e8f0'}`
                            }}>
                              {dayDoneCount}/{dayTasks.length} Done
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {dayTasks.length > 0 ? (
                            dayTasks.map(t => <TaskItem key={t.id} task={t} />)
                          ) : (
                            <div style={{ fontSize: 12, color: '#94a3b8', padding: '12px 0', textAlign: 'center' }}>
                              No tasks scheduled for Day {day}.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}


              {tab.startsWith('ongoing') && (
                (tab === 'ongoing_31_60' && ((access === 'client' && (sel?.tasks?.__payment_month2_status || 'pending') !== 'approved') || (access !== 'client' && sel?.tasks?.__payment_month2_status === 'submitted'))) ? (
                  <PaymentGate month={2} />
                ) : (tab === 'ongoing_61_90' && ((access === 'client' && (sel?.tasks?.__payment_month3_status || 'pending') !== 'approved') || (access !== 'client' && sel?.tasks?.__payment_month3_status === 'submitted'))) ? (
                  <PaymentGate month={3} />
                ) : (
                  <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
   
                      {/* Operations Tasks Grid */}
                    {(() => {
                      let minDay = 16;
                      let maxDay = 30;
                      if (tab === 'ongoing_8_30') { minDay = 16; maxDay = 30; }
                      else if (tab === 'ongoing_31_60') { minDay = 31; maxDay = 60; }
                      else if (tab === 'ongoing_61_90') { minDay = 61; maxDay = 90; }
   
                      const rangeTasks = cTasks.filter(t => (t.phase === 'ongoing' || t.day >= 16) && t.day >= minDay && t.day <= maxDay);
                      const allDays = Array.from(new Set(rangeTasks.map(t => t.day))).sort((a,b)=>a-b);
                      const visibleDays = allDays.filter(day => 
                        cTasks.some(t => t.day === day && (roleFilter === 'All' || t.role === roleFilter || ROLE_TO_NAME[t.role] === roleFilter))
                      );
   
                      if (visibleDays.length === 0 && !isAdmin) return null;
   
                      const rangeCompletedTasks = rangeTasks.filter(t => sel?.tasks?.[t.id]?.done);
   
                      return (
                        <div className="card-padding" style={S.card}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(234,88,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={20} color="#ea580c" />
                              </div>
                              <div>
                                <h4 style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Operations Schedule ({tab === 'ongoing_8_30' ? 'Day 16-30 (Month 1)' : tab === 'ongoing_31_60' ? 'Day 31-60 (Month 2)' : 'Day 61-90 (Month 3)'})</h4>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                                  {tab === 'ongoing_8_30' ? 'Day 16 to 30' : tab === 'ongoing_31_60' ? 'Day 31 to 60' : 'Day 61 to 90'} • Recurring Operations Cadence (Mon-Sat)
                                </div>
                              </div>
                              {isAdmin && <button title="Add Operations Task" onClick={() => setTaskModal({ type: 'add', task: { id: 't'+Date.now(), phase: 'ongoing', day: minDay, n: '', role: 'AM', deps: [] } })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', padding: 0 }}><Plus size={18} /></button>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#ea580c' }}>{rangeCompletedTasks.length} / {rangeTasks.length}</span>
                              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Tasks Completed</div>
                            </div>
                          </div>
                          
                          <div className="responsive-grid">
                            {visibleDays.map(day => {
                              const dayTasks = cTasks.filter(t => t.day === day && (roleFilter === 'All' || t.role === roleFilter || ROLE_TO_NAME[t.role] === roleFilter));
                              const actualDay = workingDayMap[day] || day;
                              const effectiveStart = getEffectiveStartDate(sel);
                              const dayDate = effectiveStart ? new Date(new Date(effectiveStart + 'T00:00:00Z').getTime() + (actualDay - 1) * 86400000) : null;
                              const weekday = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' }) : "";
                              const dateStr = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }) : "";
                              const isCurrentDay = actualDay === cDay;
                              const dayDoneCount = dayTasks.filter(t => sel?.tasks?.[t.id]?.done).length;
                              const allDayDone = dayTasks.length > 0 && dayDoneCount === dayTasks.length;
   
                              return (
                                <div 
                                  key={day} 
                                  id={`day-card-${day}`} 
                                  style={{
                                    background: '#ffffff',
                                    border: isCurrentDay ? '1.5px solid #ea580c' : (allDayDone ? '1px solid #a7f3d0' : '1px solid #fed7aa'),
                                    borderRadius: 18,
                                    padding: '16px 18px',
                                    boxShadow: isCurrentDay ? '0 6px 20px rgba(234, 88, 12, 0.08)' : '0 2px 10px rgba(15,23,42,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(234,88,12,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 9,
                                        background: isCurrentDay ? 'linear-gradient(135deg, #ea580c, #f97316)' : (allDayDone ? '#ecfdf5' : '#fff5ed'),
                                        color: isCurrentDay ? '#ffffff' : (allDayDone ? '#059669' : '#ea580c'),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 900,
                                        fontSize: 13,
                                        boxShadow: isCurrentDay ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
                                      }}>
                                        {allDayDone ? <CheckCircle2 size={16} /> : day}
                                      </div>

                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                          <h4 style={{ fontWeight: 800, fontSize: 14.5, color: '#0f172a', margin: 0 }}>
                                            {weekday}
                                          </h4>
                                          {isAdmin && (
                                            <button 
                                              title="Add Task" 
                                              onClick={() => setTaskModal({ type: 'add', task: { id: 't'+Date.now(), phase: 'ongoing', day, n: '', role: 'AM', deps: [] } })} 
                                              style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 6, cursor: 'pointer', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, padding: 0 }}
                                            >
                                              <Plus size={13} />
                                            </button>
                                          )}
                                        </div>
                                        <div style={{ color: '#64748b', fontWeight: 600, fontSize: 11, marginTop: 1 }}>
                                          {dateStr}
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      {isCurrentDay && (
                                        <span style={{ ...S.badge('#ea580c'), display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '2px 8px' }}>
                                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ea580c', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
                                          Active Today
                                        </span>
                                      )}
                                      <span style={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: 6,
                                        background: allDayDone ? '#ecfdf5' : '#f8fafc',
                                        color: allDayDone ? '#059669' : '#64748b',
                                        border: `1px solid ${allDayDone ? '#a7f3d0' : '#e2e8f0'}`
                                      }}>
                                        {dayDoneCount}/{dayTasks.length} Done
                                      </span>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {dayTasks.map(t => <TaskItem key={t.id} task={t} />)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <div style={S.modalOverlay} onClick={() => setModal(null)}>
            <motion.div 
              style={modal.type === 'notes' ? { ...S.modalBox, width: '80%', maxWidth: '1200px', maxHeight: '95vh', overflowY: 'auto' } : S.modalBox} 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 32, right: 32, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: '#0f172a' }}>
                {modal.type === 'notes' ? 'Task Intelligence' : modal.type === 'share' ? 'Share Client Portal' : modal.type === 'standard_notes' ? 'Client Standard Notes' : 'Workflow System (SOP)'}
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 32 }}>{modal.nm}</p>
 
              {modal.type === 'notes' && (() => {
                const canEditNote = isMember;
                return (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <button onClick={() => setNoteMode('edit')} style={S.quickBtn(noteMode === 'edit')}>Edit Mode</button>
                      <button onClick={() => setNoteMode('preview')} style={S.quickBtn(noteMode === 'preview')}>Preview (Markdown)</button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                      {/* Team Internal Log */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                          Team Internal Log & Evidence ({modal.task?.role || 'No Role Assigned'})
                        </div>
                        {noteMode === 'edit' ? (
                          <textarea 
                            value={editNote} onChange={e => setEditNote(e.target.value)}
                            readOnly={!canEditNote}
                            placeholder={canEditNote ? "Log links to Drive, Loom videos, or internal blockers..." : "Only team members can edit this note."}
                            style={{ 
                              ...S.input, 
                              height: 320, 
                              resize: 'none', 
                              opacity: canEditNote ? 1 : 0.6,
                              fontFamily: 'monospace',
                              fontSize: 13,
                              lineHeight: 1.5,
                              whiteSpace: 'pre-wrap'
                            }}
                          />
                        ) : (
                          <div style={{ ...S.input, height: 320, overflowY: 'auto', background: '#f8fafc', padding: 24, border: '1px solid rgba(0,0,0,0.06)' }}>
                            {renderMD(editNote || "*No internal logs recorded.*")}
                          </div>
                        )}
                      </div>
 
                      {/* Client Review Section */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#0ea5e9', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Client Review & Feedback</div>
                        {noteMode === 'edit' ? (
                          <textarea 
                            value={editReview} onChange={e => setEditReview(e.target.value)}
                            readOnly={!(access === 'client' && sel?.tasks?.[modal.task.id]?.done) && !isMember}
                            placeholder={access === 'client' ? (sel?.tasks?.[modal.task.id]?.done ? "How did we do? Add your review or feedback here..." : "Reviews can be added once the task is complete.") : "No client review yet."}
                            style={{ 
                              ...S.input, 
                              height: 320, 
                              resize: 'none', 
                              border: (access === 'client' && sel?.tasks?.[modal.task.id]?.done) ? '1px solid #0ea5e9' : '1px solid rgba(0,0,0,0.1)',
                              fontFamily: 'monospace',
                              fontSize: 13,
                              lineHeight: 1.5,
                              whiteSpace: 'pre-wrap'
                            }}
                          />
                        ) : (
                          <div style={{ ...S.input, height: 320, overflowY: 'auto', background: '#f0f9ff', padding: 24, border: '1px solid rgba(14,165,233,0.1)' }}>
                            {renderMD(editReview || "*No client review recorded yet.*")}
                          </div>
                        )}
                      </div>
                    </div>
 
                    <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                      {isMember && (
                        <button 
                          onClick={() => {
                            const updates = {};
                            if (canEditNote) updates.notes = editNote;
                            updates.review = editReview;
                            updateTaskData(modal.task.id, updates);
                            setModal(null); 
                            toast.success("Changes saved successfully");
                          }} 
                          style={{ ...S.btn(true), flex: 1, justifyContent: 'center' }}
                        >
                          Save All Changes
                        </button>
                      )}
                      {access === 'client' && sel?.tasks?.[modal.task.id]?.done && (
                        <button 
                          onClick={() => { 
                            updateTaskData(modal.task.id, { review: editReview }); 
                            setModal(null); 
                            toast.success("Review saved! Thank you for your feedback.");
                          }} 
                          style={{ ...S.btn(true, '#0ea5e9'), flex: 1, justifyContent: 'center' }}
                        >
                          Submit Review
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}



              {modal.type === 'sop' && (
                <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 14 }}>
                  {sopLoad ? 'Drafting protocol...' : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{sel?.tasks?.__sops?.[modal.nm] || sops[modal.nm] || 'No SOP found for this task.'}</div>
                  )}
                </div>
              )}

              {modal.type === 'share' && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>CLIENT ACCESS LINK</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input 
                      readOnly 
                      style={{ ...S.input, flex: 1, background: '#f1f5f9' }} 
                      value={`${window.location.origin}/?cid=${sel?.id}&access=client`} 
                    />
                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}/?cid=${sel?.id}&access=client`;
                        navigator.clipboard.writeText(url);
                        toast.success("Link copied to clipboard!");
                      }}
                      style={{ ...S.btn(true), width: 'auto', whiteSpace: 'nowrap' }}
                    >
                      Copy Link
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 16, lineHeight: 1.5 }}>
                    Anyone with this link can view <b>{sel?.name}'s</b> dashboard in read-only mode. No login required.
                  </p>
                </div>
              )}

              {modal.type === 'standard_notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <textarea 
                    value={tempStandardNotes}
                    onChange={e => setTempStandardNotes(e.target.value)}
                    placeholder="Add standard guidelines, credentials, or client instructions that the entire team should access..."
                    style={{
                      ...S.input,
                      height: 300,
                      resize: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      lineHeight: 1.5,
                      padding: 16
                    }}
                  />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => setModal(null)} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                    <button 
                      onClick={() => {
                        const nowStr = new Date().toISOString();
                        const currentLatest = clientsRef.current.find(c => c.id === selId);
                        if (!currentLatest) return;
                        const updatedTasks = {
                          ...(currentLatest.tasks || {}),
                          __updated_at: nowStr,
                          __standard_notes: tempStandardNotes,
                          __meta_updated_at: nowStr
                        };
                        const updatedClient = { ...currentLatest, tasks: updatedTasks, updatedAt: nowStr };
                        const next = clientsRef.current.map(c => c.id === selId ? updatedClient : c);
                        clientsRef.current = next;
                        setClients(next);
                        sync(updatedClient);
                        setModal(null);
                        toast.success("Standard notes updated!");
                      }}
                      style={{ ...S.btn(true), flex: 1, justifyContent: 'center' }}
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {(addingC || editId) && (
          <div style={S.modalOverlay} onClick={() => { setAddingC(false); setEditId(null); setNewClientName(""); setEditClientName(""); setNewSlackId(""); setEditSlackId(""); setNewBD(""); setEditBD(""); setEditRawProfile(""); setEditLeadScore(""); setEditLeadHeadline(""); setEditLeadCompany(""); setEditLeadExplanation(""); setEditLeadNotes(""); setEditLeadStage("not_started"); }}>
             <motion.div 
               style={isBDOrAdmin ? { ...S.modalBox, width: 'min(1100px, 95vw)', maxWidth: 1100, maxHeight: '90vh', overflowY: 'auto' } : S.modalBox} 
               onClick={e => e.stopPropagation()}
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
             >
                <h3 style={{ fontSize: 32, fontWeight: 900, textAlign: 'center', marginBottom: 40, color: '#0f172a' }}>{editId ? 'Edit Client' : 'Onboard Client'}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: isBDOrAdmin ? '1.1fr 1fr' : '1fr', gap: isBDOrAdmin ? 32 : 0 }}>
                  {/* Left Column: Standard Setup */}
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Brand Name</div>
                      <input placeholder="e.g. Acme Scaling" value={editId ? editNm : newName} onChange={e => editId ? setEditNm(e.target.value) : setNewName(e.target.value)} style={S.input} autoFocus />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Client Name</div>
                      <input placeholder="e.g. John Doe" value={editId ? editClientName : newClientName} onChange={e => editId ? setEditClientName(e.target.value) : setNewClientName(e.target.value)} style={S.input} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Client Website</div>
                      <input placeholder="e.g. https://acmescaling.com" value={editId ? editWebsite : newWebsite} onChange={e => editId ? setEditWebsite(e.target.value) : setNewWebsite(e.target.value)} style={S.input} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Google Drive Link</div>
                      <input placeholder="e.g. https://drive.google.com/..." value={editId ? editDriveLink : newDriveLink} onChange={e => editId ? setEditDriveLink(e.target.value) : setNewDriveLink(e.target.value)} style={S.input} />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Business Developer (BD)</div>
                      <select 
                         style={{ ...S.input, appearance: 'none', background: '#f8fafc', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                         value={editId ? editBD : newBD} 
                         onChange={e => editId ? setEditBD(e.target.value) : setNewBD(e.target.value)}
                       >
                         <option value="">Select Business Developer...</option>
                         {teamMembers.filter(m => (m.role || '').toLowerCase() === 'bd').map(m => (
                           <option key={m.id} value={m.name}>{m.name}</option>
                         ))}
                       </select>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          90-Day Deliverable Services
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#ea580c', background: '#fff5ed', padding: '2px 8px', borderRadius: 6, border: '1px solid #fed7aa' }}>
                          {newServices.length} Services Selected • {getPackageTasks(newPkg, newServices).length} Total Tasks
                        </div>
                      </div>

                      {/* Quick Presets Strip */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        {PACKAGES.map(p => {
                          const pServices = PACKAGE_SERVICES[p.id] || [];
                          const isFullMatch = pServices.length > 0 && pServices.every(s => newServices.includes(s)) && newServices.length === pServices.length;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setNewPkg(p.id);
                                setNewServices(pServices);
                              }}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: 'pointer',
                                border: isFullMatch ? `2px solid ${p.color}` : '1px solid #fed7aa',
                                background: isFullMatch ? `${p.color}15` : '#fffbf7',
                                color: isFullMatch ? p.color : '#0f172a',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {p.label} (PKR {p.price})
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setNewServices(SERVICES.map(s => s.id))}
                          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', border: '1px solid #fed7aa', background: '#ffffff', color: '#ea580c' }}
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewServices([])}
                          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', border: '1px solid #e2e8f0', background: '#ffffff', color: '#94a3b8' }}
                        >
                          Clear
                        </button>
                      </div>

                      {/* 10 Modular Service Cards Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 8, maxHeight: 300, overflowY: 'auto', padding: '2px 4px 2px 2px' }} className="custom-scrollbar">
                        {SERVICES.map(svc => {
                          const isChecked = newServices.includes(svc.id);
                          const SvcIcon = {
                            Mail,
                            UserCheck,
                            Sparkles,
                            Play,
                            BookOpen,
                            Target,
                            Search,
                            Globe,
                            TrendingUp,
                            Bot
                          }[svc.icon] || Sparkles;

                          return (
                            <div
                              key={svc.id}
                              onClick={() => {
                                setNewServices(prev => 
                                  prev.includes(svc.id) ? prev.filter(id => id !== svc.id) : [...prev, svc.id]
                                );
                              }}
                              style={{
                                padding: '10px 12px',
                                borderRadius: 12,
                                border: isChecked ? `1.5px solid ${svc.color}` : '1px solid #fed7aa',
                                background: isChecked ? `${svc.color}0a` : '#ffffff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10,
                                transition: 'all 0.15s ease',
                                boxShadow: isChecked ? `0 2px 8px ${svc.color}15` : 'none'
                              }}
                            >
                              <div style={{
                                width: 18,
                                height: 18,
                                borderRadius: 5,
                                border: isChecked ? `1.5px solid ${svc.color}` : '1.5px solid #cbd5e1',
                                background: isChecked ? svc.color : '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                marginTop: 2,
                                flexShrink: 0,
                                transition: 'all 0.15s'
                              }}>
                                {isChecked && <CheckCircle2 size={13} strokeWidth={3} />}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <SvcIcon size={14} color={isChecked ? svc.color : '#64748b'} />
                                  <span style={{ fontSize: 12, fontWeight: 800, color: isChecked ? '#0f172a' : '#475569' }}>
                                    {svc.label}
                                  </span>
                                </div>
                                <p style={{ fontSize: 10, color: '#64748b', margin: '3px 0 0', lineHeight: 1.3 }}>
                                  {svc.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Journey Start Date</div>
                      <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={S.input} />
                    </div>
                  </div>

                  {/* Right Column: BD Hub Outreach */}
                  {isBDOrAdmin && (
                    <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 32 }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 800, color: '#7c3aed', marginBottom: 20 }}>
                        <Bot size={18} />
                        <span>BD Hub Outreach</span>
                      </h4>

                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Target ICP</div>
                        <textarea 
                          value={editIcp} 
                          onChange={e => setEditIcp(e.target.value)} 
                          placeholder="e.g. Founders, CEOs, or CTOs of tech companies in North America with 10-200 employees..."
                          rows={4} 
                          style={{ ...S.input, resize: 'none', height: 120 }} 
                        />
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Pipeline Stage</div>
                        <select 
                          value={editLeadStage} 
                          onChange={e => setEditLeadStage(e.target.value)} 
                          style={{ ...S.input, background: '#fff' }}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="match_icp">Match ICP</option>
                          <option value="connection_send">Connection Send</option>
                          <option value="accepted_connection">Accepted Connection</option>
                          <option value="first_message_send">1st Message Send</option>
                          <option value="in_followup">In Followup Message</option>
                          <option value="booked_meeting">Booked Meeting</option>
                          <option value="closed">Closed</option>
                          <option value="unclosed">Unclosed</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Outreach Notes</div>
                        <textarea 
                          value={editLeadNotes} 
                          onChange={e => setEditLeadNotes(e.target.value)} 
                          placeholder="Outreach progress notes..." 
                          rows={4} 
                          style={{ ...S.input, resize: 'none', height: 120 }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={() => { setAddingC(false); setEditId(null); setNewClientName(""); setEditClientName(""); setNewSlackId(""); setEditSlackId(""); setNewBD(""); setEditBD(""); setEditRawProfile(""); setEditLeadScore(""); setEditLeadHeadline(""); setEditLeadCompany(""); setEditLeadExplanation(""); setEditLeadNotes(""); setEditLeadStage("not_started"); }} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button 
                    onClick={() => {
                      if (editId) {
                        const nowStr = new Date().toISOString();
                        let updatedRef = null;
                        const next = clientsRef.current.map(c => {
                          if (c.id === editId) {
                            const updatedTasks = { ...c.tasks };
                            updatedTasks.__website = editWebsite.trim();
                            updatedTasks.__drive_link = editDriveLink.trim();
                            updatedTasks.__client_name = editClientName.trim();
                            updatedTasks.__slack_id = editSlackId.trim();
                            updatedTasks.__assigned_bd = editBD.trim();
                            
                            // Outreach fields
                            updatedTasks.__bd_outreach_stage = editLeadStage;
                            updatedTasks.__bd_outreach_notes = editLeadNotes;
                            updatedTasks.__bd_outreach_icp = editIcp;
                            updatedTasks.__bd_outreach_raw_profile = editRawProfile;
                            updatedTasks.__bd_outreach_score = editLeadScore ? Number(editLeadScore) : null;
                            updatedTasks.__bd_outreach_ai_explanation = editLeadExplanation;
                            updatedTasks.__bd_outreach_company = editLeadCompany;
                            updatedTasks.__bd_outreach_headline = editLeadHeadline;
                            updatedTasks.__bd_outreach_date = nowStr;

                            // Brand Asset fields
                            updatedTasks.__brand_colors = editBrandColors.trim();
                            updatedTasks.__brand_logo_url = editBrandLogoUrl.trim();
                            updatedTasks.__brand_niche = editBrandNiche.trim();
                            updatedTasks.__brand_logo_position = editBrandLogoPosition;
                            updatedTasks.__brand_platform = editBrandPlatform;
                            updatedTasks.__creative_brand_brief = {
                              ...(updatedTasks.__creative_brand_brief || {}),
                              client_name: editNm.trim(),
                              brand_colors: editBrandColors.trim(),
                              brand_logo_url: editBrandLogoUrl.trim(),
                              brand_niche: editBrandNiche.trim(),
                              brand_logo_position: editBrandLogoPosition,
                              brand_platform: editBrandPlatform
                            };

                            updatedTasks.__services = newServices;
                            updatedTasks.__updated_at = nowStr;
                            updatedTasks.__meta_updated_at = nowStr;
                            
                            updatedRef = { ...c, name: editNm, package: newPkg, startDate: newDate, tasks: updatedTasks, updatedAt: nowStr };
                            return updatedRef;
                          }
                          return c;
                        });
                        clientsRef.current = next;
                        setClients(next);
                        if (updatedRef) {
                          sync(updatedRef);
                        }
                        setEditId(null);
                        setEditClientName("");
                        setEditBD("");
                        setEditRawProfile("");
                        setEditLeadScore("");
                        setEditLeadHeadline("");
                        setEditLeadCompany("");
                        setEditLeadExplanation("");
                        setEditLeadNotes("");
                        setEditLeadStage("not_started");
                      } else {
                        addClient();
                        setAddingC(false);
                        setEditRawProfile("");
                        setEditLeadScore("");
                        setEditLeadHeadline("");
                        setEditLeadCompany("");
                        setEditLeadExplanation("");
                        setEditLeadNotes("");
                        setEditLeadStage("not_started");
                      }
                    }} 
                    style={{ ...S.btn(true), flex: 2, justifyContent: 'center' }}
                  >
                    {editId ? 'Save Changes' : 'Launch System'}
                  </button>
                </div>
             </motion.div>
          </div>
        )}

        {aiScorerClient && (
          <div style={S.modalOverlay} onClick={() => { setAiScorerClient(null); setAiAnalysisResult(null); setEditRawProfile(""); }}>
            <motion.div 
              style={{ ...S.modalBox, width: 'min(600px, 95vw)', maxHeight: '90vh', overflowY: 'auto' }} 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#7c3aed', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bot size={22} />
                  <span>AI Profile Scorer — {aiScorerClient?.name || 'Outreach Lead'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => { setAiScorerClient(null); setAiAnalysisResult(null); setEditRawProfile(""); }}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}
                  title="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
              
              {((sel?.tasks?.__linkedin_profiles && sel.tasks.__linkedin_profiles.length > 0) || (aiScorerClient?.tasks?.__linkedin_profiles && aiScorerClient.tasks.__linkedin_profiles.length > 0)) && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={12} /> Target LinkedIn Account *
                  </div>
                  <select
                    value={aiScorerLinkedinProfileId}
                    onChange={e => setAiScorerLinkedinProfileId(e.target.value)}
                    style={{ ...S.input, background: '#f5f3ff', border: '1.5px solid #ddd6fe', fontWeight: 700, color: '#6d28d9', cursor: 'pointer' }}
                  >
                    {(aiScorerClient?.tasks?.__linkedin_profiles || sel?.tasks?.__linkedin_profiles || []).map(p => (
                      <option key={p.id} value={p.id}>{p.name} (LinkedIn Account)</option>
                    ))}
                  </select>
                </div>
              )}

              {/* LinkedIn Link Preview / Field */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#0284c7', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={12} /> Extracted / Direct LinkedIn Profile Link
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input 
                    value={editLinkedinUrl}
                    onChange={e => setEditLinkedinUrl(e.target.value)}
                    placeholder="Auto-extracted URL or search link..."
                    style={{ ...S.input, flex: 1, background: '#f0f9ff', borderColor: '#bae6fd', fontSize: 12, fontWeight: 600, color: '#0369a1' }}
                  />
                  {editLinkedinUrl && (
                    <a
                      href={editLinkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '9px 14px',
                        borderRadius: 10,
                        background: '#0284c7',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 12,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Open Link ↗
                    </a>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Target ICP</div>
                <textarea 
                  value={editIcp} 
                  onChange={e => setEditIcp(e.target.value)} 
                  rows={3} 
                  style={{ ...S.input, resize: 'none', height: 'auto', background: '#f8fafc' }} 
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Raw Profile Content</div>
                <textarea 
                  placeholder="Paste LinkedIn raw profile copy..." 
                  value={editRawProfile} 
                  onChange={e => setEditRawProfile(e.target.value)} 
                  rows={8} 
                  style={{ ...S.input, fontFamily: 'monospace', fontSize: 11, resize: 'none', height: 'auto' }} 
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={handleAnalyzeLead}
                  disabled={isAnalyzing || !editRawProfile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: '#7c3aed',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 13,
                    border: 'none',
                    cursor: editRawProfile ? 'pointer' : 'not-allowed',
                    opacity: editRawProfile ? 1 : 0.6,
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                >
                  {isAnalyzing ? 'Analyzing Lead...' : 'Analyze with AI'}
                </button>
              </div>

              {aiAnalysisResult && (() => {
                const score = aiAnalysisResult.score ?? 50;
                const outOf10 = Math.round(score / 10);
                const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
                const scoreBg = score >= 70 ? '#ecfdf5' : score >= 40 ? '#fffbeb' : '#fef2f2';
                const scoreBorder = score >= 70 ? '#6ee7b7' : score >= 40 ? '#fcd34d' : '#fca5a5';
                const scoreLabel = score >= 70 ? '🔥 Strong Match' : score >= 40 ? '⚡ Moderate Match' : '❌ Weak Match';
                return (
                  <div style={{
                    background: scoreBg,
                    border: `1.5px solid ${scoreBorder}`,
                    borderRadius: 16,
                    padding: '18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginBottom: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                  }}>
                    {/* Score Hero Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #e2e8f0 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: `0 0 0 4px ${scoreBg}, 0 0 0 6px ${scoreBorder}`
                      }}>
                        <div style={{
                          width: 54, height: 54, borderRadius: '50%',
                          background: scoreBg,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: 20, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{outOf10}</span>
                          <span style={{ fontSize: 9, color: '#64748b', fontWeight: 700 }}>/10</span>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: scoreColor, marginBottom: 2 }}>{scoreLabel}</div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ICP Match Score: <b style={{ color: scoreColor }}>{score}%</b></div>
                        {aiAnalysisResult.name && <div style={{ fontSize: 12, color: '#0f172a', marginTop: 4, fontWeight: 700 }}>👤 {aiAnalysisResult.name}</div>}
                        {aiAnalysisResult.headline && <div style={{ fontSize: 11, color: '#475569' }}>💼 {aiAnalysisResult.headline}</div>}
                        {aiAnalysisResult.company && <div style={{ fontSize: 11, color: '#475569' }}>🏢 {aiAnalysisResult.company}</div>}
                      </div>
                    </div>
                    {/* Explanation */}
                    {aiAnalysisResult.explanation && (
                      <p style={{ fontSize: 12, color: '#334155', margin: 0, lineHeight: 1.6, borderTop: `1px solid ${scoreBorder}`, paddingTop: 10 }}>
                        <b style={{ color: scoreColor }}>AI Says: </b>{aiAnalysisResult.explanation}
                      </p>
                    )}
                  </div>
                );
              })()}

              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={() => { setAiScorerClient(null); setAiAnalysisResult(null); setEditRawProfile(""); }} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button 
                  onClick={handleSaveAiAnalysis}
                  disabled={savingAiAnalysis || !aiAnalysisResult}
                  style={{ ...S.btn(true), flex: 2, justifyContent: 'center', opacity: aiAnalysisResult ? 1 : 0.6 }}
                >
                  {savingAiAnalysis ? 'Saving...' : 'Save & Score Lead'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {taskModal && (
          <div style={S.modalOverlay} onClick={() => setTaskModal(null)}>
             <motion.div 
               style={{...S.modalBox, width: 480}} 
               onClick={e => e.stopPropagation()}
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
             >
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24, color: '#0f172a' }}>{taskModal.type === 'edit' ? 'Edit Task' : 'Create Custom Task'}</h3>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 4 }}>TASK NAME</div>
                  <input style={S.input} value={taskModal.task.n} onChange={e => setTaskModal({ ...taskModal, task: { ...taskModal.task, n: e.target.value }})} placeholder="e.g. Weekly Optimization" autoFocus />
                </div>

                <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 4 }}>ASSIGNED TEAM MEMBER</div>
                    <select style={S.input} value={taskModal.task.role} onChange={e => setTaskModal({ ...taskModal, task: { ...taskModal.task, role: e.target.value }})}>
                      <option value="">Unassigned</option>
                      {teamMembers.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 4 }}>PHASE</div>
                    <select style={S.input} value={taskModal.task.phase} onChange={e => setTaskModal({ ...taskModal, task: { ...taskModal.task, phase: e.target.value, isPost: e.target.value === 'ongoing' ? true : false }})}>
                      <option value="sprint">Sprint (Days 1-7)</option>
                      <option value="ongoing">Ongoing (Outreach Posts)</option>
                    </select>
                  </div>
                </div>

                {(taskModal.task.phase !== 'ongoing' || taskModal.task.isPost || true) && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 4 }}>DAY #</div>
                    <input type="number" style={S.input} value={taskModal.task.day || (taskModal.task.phase === 'ongoing' ? 8 : 1)} onChange={e => setTaskModal({ ...taskModal, task: { ...taskModal.task, day: parseInt(e.target.value) || 1 }})} />
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#10b981', tracking: 2, marginBottom: 4 }}>SOP / PROCEDURE</div>
                  <textarea
                    style={{ ...S.input, height: 160, resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
                    value={taskModal.sop ?? (sel?.tasks?.__sops?.[taskModal.task.n] || sops[taskModal.task.n] || '')}
                    onChange={e => setTaskModal({ ...taskModal, sop: e.target.value })}
                    placeholder={`Describe the step-by-step procedure for "${taskModal.task.n || 'this task'}"...`}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setTaskModal(null)} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button onClick={() => saveTaskDef(taskModal.task, taskModal.sop ?? (sel?.tasks?.__sops?.[taskModal.task.n] || sops[taskModal.task.n]))} style={{ ...S.btn(true), flex: 1, justifyContent: 'center' }}>Save Task</button>
                </div>
             </motion.div>
          </div>
        )}

        {showBulkModal && (
          <div style={S.modalOverlay} onClick={() => setShowBulkModal(false)}>
             <motion.div 
               style={{...S.modalBox, width: 560, maxHeight: '90vh', overflowY: 'auto'}} 
               onClick={e => e.stopPropagation()}
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
             >
                <button onClick={() => setShowBulkModal(false)} style={{ position: 'absolute', top: 32, right: 32, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20, color: '#0f172a' }}>Bulk Task Actions</h3>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 12 }}>
                  <button onClick={() => setBulkTab('add')} style={S.quickBtn(bulkTab === 'add')}>Add in Bulk</button>
                  <button onClick={() => setBulkTab('edit')} style={S.quickBtn(bulkTab === 'edit')}>Edit in Bulk</button>
                  <button onClick={() => setBulkTab('remove')} style={S.quickBtn(bulkTab === 'remove')}>Remove in Bulk</button>
                </div>

                {/* Tab Content */}
                {bulkTab === 'add' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>TASK NAME</div>
                      <input style={S.input} value={bulkAddName} onChange={e => setBulkAddName(e.target.value)} placeholder="e.g. Organic Marketing Report" autoFocus />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>ASSIGNED TEAM MEMBER</div>
                        <select style={S.input} value={bulkAddRole} onChange={e => setBulkAddRole(e.target.value)}>
                          <option value="">Unassigned</option>
                          {teamMembers.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>START DAY</div>
                        <input type="number" style={S.input} value={bulkAddStartDay} onChange={e => setBulkAddStartDay(parseInt(e.target.value) || 1)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>END DAY</div>
                        <input type="number" style={S.input} value={bulkAddEndDay} onChange={e => setBulkAddEndDay(parseInt(e.target.value) || 1)} />
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>SOP / PROCEDURE (OPTIONAL)</div>
                      <textarea
                        style={{ ...S.input, height: 100, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                        value={bulkAddSop}
                        onChange={e => setBulkAddSop(e.target.value)}
                        placeholder="Describe the step-by-step procedure..."
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      <button onClick={() => setShowBulkModal(false)} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                      <button onClick={handleBulkAdd} style={{ ...S.btn(true, '#7c3aed'), flex: 1, justifyContent: 'center' }}>Add Tasks</button>
                    </div>
                  </div>
                )}

                {bulkTab === 'edit' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>SELECT TASK TO EDIT</div>
                      <select style={S.input} value={bulkEditMatchName} onChange={e => setBulkEditMatchName(e.target.value)}>
                        <option value="">-- Choose Task --</option>
                        {uniqueTaskNames.map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>NEW TASK NAME (LEAVE BLANK TO UNCHANGE)</div>
                      <input style={S.input} value={bulkEditNewName} onChange={e => setBulkEditNewName(e.target.value)} placeholder="e.g. Updated Task Name" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>NEW ASSIGNED TEAM MEMBER (LEAVE BLANK TO UNCHANGE)</div>
                        <select style={S.input} value={bulkEditNewRole} onChange={e => setBulkEditNewRole(e.target.value)}>
                          <option value="">-- Unchanged --</option>
                          <option value="Unassigned">Unassigned</option>
                          {teamMembers.map(m => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>START DAY</div>
                        <input type="number" style={S.input} value={bulkEditStartDay} onChange={e => setBulkEditStartDay(parseInt(e.target.value) || 1)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>END DAY</div>
                        <input type="number" style={S.input} value={bulkEditEndDay} onChange={e => setBulkEditEndDay(parseInt(e.target.value) || 1)} />
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>NEW SOP / PROCEDURE (LEAVE BLANK TO UNCHANGE)</div>
                      <textarea
                        style={{ ...S.input, height: 100, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                        value={bulkEditNewSop}
                        onChange={e => setBulkEditNewSop(e.target.value)}
                        placeholder="Update the step-by-step procedure..."
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      <button onClick={() => setShowBulkModal(false)} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                      <button onClick={handleBulkEdit} style={{ ...S.btn(true, '#7c3aed'), flex: 1, justifyContent: 'center' }}>Save Changes</button>
                    </div>
                  </div>
                )}

                {bulkTab === 'remove' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>SELECT TASK TO REMOVE</div>
                      <select style={S.input} value={bulkRemoveMatchName} onChange={e => setBulkRemoveMatchName(e.target.value)}>
                        <option value="">-- Choose Task --</option>
                        {uniqueTaskNames.map(name => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>START DAY</div>
                        <input type="number" style={S.input} value={bulkRemoveStartDay} onChange={e => setBulkRemoveStartDay(parseInt(e.target.value) || 1)} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#7c3aed', tracking: 2, marginBottom: 6 }}>END DAY</div>
                        <input type="number" style={S.input} value={bulkRemoveEndDay} onChange={e => setBulkRemoveEndDay(parseInt(e.target.value) || 1)} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button onClick={() => setShowBulkModal(false)} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                      <button onClick={handleBulkRemove} style={{ ...S.btn(true, '#ef4444'), flex: 1, justifyContent: 'center' }}>Remove Tasks</button>
                    </div>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <ReportModal clients={clients} initialClient={sel || null} onClose={() => setShowReport(false)} />
        )}
      </AnimatePresence>

      {/* Invite Team Modal */}
      <AnimatePresence>
        {showInvite && (
          <InviteModal clients={clients} user={user} onClose={() => setShowInvite(false)} />
        )}
      </AnimatePresence>

      {/* Today's Task Drawer */}
      <AnimatePresence>
        {todayDrawerOpen && sel && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setTodayDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.3)',
                backdropFilter: 'blur(8px)',
                zIndex: 150
              }}
            />
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(500px, 100vw)',
                background: '#ffffff',
                borderLeft: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '-10px 0 30px -10px rgba(15, 23, 42, 0.1)',
                zIndex: 160,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc'
              }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Today's Deliverables
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                    Day {cDay} • {sel.name}
                  </div>
                </div>
                <button 
                  onClick={() => setTodayDrawerOpen(false)}
                  style={{
                    color: '#64748b',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="custom-scrollbar" style={{
                flex: 1,
                overflowY: 'auto',
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 28
              }}>
                {/* Tasks List */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#dc2626', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16 }}>
                    Tasks scheduled for today
                  </div>

                  {(() => {
                    const todayTasks = cTasks.filter(t => (workingDayMap[t.day] || t.day) === cDay);
                    if (todayTasks.length === 0) {
                      return (
                        <div style={{
                          padding: '32px 16px',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: 13,
                          background: '#f8fafc',
                          borderRadius: 20,
                          border: '1px dashed rgba(0,0,0,0.08)',
                          fontWeight: 500
                        }}>
                          No tasks scheduled for today (Day {cDay}).
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {todayTasks.map(t => {
                          const st = sel?.tasks?.[t.id] || { done: false, notes: '', review: '' };
                          const role = ROLES[t.role];
                          const assigneeName = ROLE_TO_NAME[t.role] || t.role || 'Unassigned';
                          return (
                            <div key={t.id} style={{
                              padding: 16,
                              background: '#f8fafc',
                              borderRadius: 16,
                              border: '1px solid rgba(0,0,0,0.04)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 12
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div 
                                  onClick={() => isMember && toggleTask(t.id)}
                                  style={{ 
                                    width: 20, height: 20, borderRadius: 6, border: `2px solid ${st.done ? '#dc2626' : '#cbd5e1'}`,
                                    background: st.done ? '#dc2626' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !isMember ? 'default' : 'pointer',
                                    flexShrink: 0
                                  }}
                                >
                                  {st.done && <CheckCircle2 size={12} color="#fff" />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                 <div style={{ fontSize: 14, fontWeight: 700, color: st.done ? '#94a3b8' : '#0f172a', textDecoration: st.done ? 'line-through' : 'none' }}>
                                   {t.n}
                                 </div>
                                </div>
                                <span style={S.badge(role?.color || '#94a3b8')}>{assigneeName}</span>
                              </div>

                              {/* Task specific notes / reviews / evidence input */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 32, borderLeft: '2px solid #e2e8f0' }}>
                                {isMember && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      Internal Log / Evidence
                                    </span>
                                    <input 
                                      type="text"
                                      value={localTaskNotes[t.id] !== undefined ? localTaskNotes[t.id] : (st.notes || '')}
                                      onChange={e => {
                                        const newVal = e.target.value;
                                        setLocalTaskNotes(prev => ({
                                          ...prev,
                                          [t.id]: newVal
                                        }));
                                      }}
                                      placeholder="Add evidence / link to complete task..."
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        borderRadius: 8,
                                        fontSize: 12,
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        fontFamily: 'Inter, sans-serif'
                                      }}
                                    />
                                  </div>
                                )}
                                {!isMember && st.notes && (
                                  <div style={{ fontSize: 12, color: '#475569' }}>
                                    <strong style={{ color: '#dc2626', fontSize: 10, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Internal Log / Evidence</strong>
                                    {renderMD(st.notes)}
                                  </div>
                                )}
                                {st.review && (
                                  <div style={{ fontSize: 12, color: '#475569' }}>
                                    <strong style={{ color: '#0ea5e9', fontSize: 10, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Client Feedback</strong>
                                    {renderMD(st.review)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Sticky Footer with Save button */}
              {isMember && (
                <div style={{
                  padding: '20px 32px',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  background: '#ffffff',
                  display: 'flex',
                  gap: 12,
                  boxShadow: '0 -4px 10px rgba(0,0,0,0.02)'
                }}>
                  <button 
                    onClick={saveDrawerTasks}
                    style={{
                      ...S.btn(true),
                      flex: 1,
                      justifyContent: 'center',
                      boxShadow: '0 4px 6px -1px rgba(220,38,38,0.15)'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { margin: 0; padding: 0; background: #f8fafc; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(220,38,38,0.2) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(220,38,38,0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(220,38,38,0.6); }
        *:focus { border-color: rgba(220,38,38,0.5) !important; }
        
        .responsive-grid {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          gap: 24px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        @media (max-width: 1024px) {
          .responsive-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        .admin-live-container {
          padding: 20px 40px 60px !important;
        }
        @media (max-width: 1024px) {
          .admin-live-container {
            padding: 16px 16px 40px !important;
          }
        }
        
        @media (max-width: 1024px) {
          aside { position: fixed !important; top: 0; left: 0; bottom: 0; z-index: 100 !important; visibility: visible; }
          .mobile-hide-inline { display: none !important; }
          header { padding: 12px 16px !important; min-height: 64px !important; height: auto !important; flex-wrap: wrap !important; gap: 12px !important; }
          .tab-bar { padding: 12px 16px !important; }
          .main-content { padding: 16px !important; overflow-x: hidden !important; }
          .card-padding { 
            padding: 20px !important; 
            width: auto !important;
            max-width: 480px !important;
            height: auto !important; 
            min-height: auto !important;
            display: block !important;
            overflow: visible !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          [style*="grid-template-columns"] { grid-template-columns: minmax(0, 1fr) !important; gap: 16px !important; }
          
          .tab-scroll { overflow-x: auto !important; padding-bottom: 2px; }
          .tab-scroll::-webkit-scrollbar { display: none; }
          .tab-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          .tab-scroll > div { flex-wrap: nowrap !important; }
          .tab-scroll button { flex-shrink: 0 !important; white-space: nowrap !important; }
        }

        @media (max-width: 768px) {
          .mobile-hide { display: none !important; }
          header { padding: 12px 12px !important; gap: 8px !important; }
          header > div:last-child { gap: 8px !important; }
          .card-padding { 
            padding: 16px !important; 
            width: auto !important;
            max-width: 480px !important; 
            height: auto !important; 
            min-height: auto !important;
            display: block !important;
            overflow: visible !important;
            margin-left: auto !important; 
            margin-right: auto !important; 
          }
          .grid-stack { grid-template-columns: minmax(0, 1fr) !important; }
          .modal-box { padding: 24px !important; width: 95vw !important; }
          .header-title { font-size: 16px !important; }
          .tab-bar { padding: 12px 12px !important; }
          .main-content { padding: 12px !important; overflow-x: hidden !important; }
          .btn-responsive { padding: 10px 12px !important; font-size: 11px !important; }
        }

        @media (max-width: 640px) {
          .task-item-card {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
            padding: 10px 12px !important;
          }
          .task-item-main {
            width: 100% !important;
            align-items: flex-start !important;
          }
          .task-item-actions {
            width: 100% !important;
            justify-content: flex-end !important;
            border-top: 1px solid rgba(0,0,0,0.06) !important;
            padding-top: 8px !important;
            margin-top: 2px !important;
          }
          .header-actions {
            gap: 6px !important;
            width: 100% !important;
            justify-content: space-between !important;
            margin-top: 4px !important;
          }
          .header-actions button {
            padding: 6px 10px !important;
            border-radius: 10px !important;
            height: 38px !important;
            font-size: 11px !important;
          }
          .header-actions button:last-of-type,
          .header-actions div:last-child {
            width: 38px !important;
            height: 38px !important;
            border-radius: 10px !important;
          }
          .header-actions div:last-child {
            font-size: 14px !important;
          }
        }

        /* Utility helper for dynamic grids */
        [style*="grid-template-columns: 1fr 1fr"],
        [style*="grid-template-columns: repeat(3, 1fr)"] {
          @media (max-width: 1024px) {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
