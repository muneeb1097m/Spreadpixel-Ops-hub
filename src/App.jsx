
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
  Pause
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
  DEFAULT_SOPS 
} from './constants';
import ReportModal from './ReportModal';
import InviteModal from './InviteModal';
import TeamManagement from './TeamManagement';
import AdminLiveDash from './AdminLiveDash';
import BDHub, { extractOrGenerateLinkedinUrl } from './BDHub';
import CreativeHub from './CreativeHub';
import { extractDominantColors } from './logoColorExtractor';

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
  sidebar: { width: 280, background: '#fffbf7', borderRight: '1px solid rgba(234,88,12,0.08)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
  header: { minHeight: 80, height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 40px', borderBottom: '1px solid rgba(234,88,12,0.08)', backdropFilter: 'blur(12px)', sticky: 'top 0', zIndex: 20, background: 'rgba(255,251,247,0.85)' },
  tabBar: { padding: '24px 40px', borderBottom: '1px solid rgba(234,88,12,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbf7' },
  content: { flex: 1, overflowY: 'auto', padding: 40 },
  card: { background: '#fffbf7', borderRadius: 24, border: '1px solid rgba(234,88,12,0.08)', padding: 32, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)' },
  btn: (active, color = '#ea580c') => ({
    padding: '12px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10,
    background: active ? color : '#fff5ed', color: active ? '#ffffff' : '#64748b', transition: 'all 0.2s',
    border: active ? 'none' : '1px solid rgba(234,88,12,0.08)', cursor: 'pointer'
  }),
  badge: (color) => ({
    padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', tracking: '0.05em',
    background: `${color}15`, color: color, border: `1px solid ${color}30`, whiteSpace: 'nowrap'
  }),
  input: {
    width: '100%', padding: '14px 20px', background: '#fff5ed', border: '1px solid rgba(234,88,12,0.12)',
    borderRadius: 16, color: '#0f172a', fontSize: 14, outline: 'none', transition: 'all 0.2s'
  },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalBox: { background: '#fffbf7', borderRadius: 24, border: '1px solid #ffedd5', width: 'min(650px, 95vw)', padding: 32, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', color: '#0f172a' },
  quickBtn: (active) => ({
    padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
    background: active ? '#ffedd5' : '#fff5ed', color: active ? '#ea580c' : '#64748b',
    border: `1px solid ${active ? '#fed7aa' : 'rgba(234,88,12,0.18)'}`,
    cursor: 'pointer', transition: 'all 0.15s'
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
  const [newPkg, setNewPkg] = useState("intermediate");
  const [newDate, setNewDate] = useState(getKarachiDateStr());
  const [editId, setEditId] = useState(null);
  const [editNm, setEditNm] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newDriveLink, setNewDriveLink] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editDriveLink, setEditDriveLink] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [newSlackId, setNewSlackId] = useState("");
  const [editSlackId, setEditSlackId] = useState("");
  const [newBD, setNewBD] = useState("");
  const [editBD, setEditBD] = useState("");
  
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

      const readIds = JSON.parse(localStorage.getItem('flc_read_notifications') || '[]');
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
    const readIds = JSON.parse(localStorage.getItem('flc_read_notifications') || '[]');
    notifications.forEach(n => {
      if (!readIds.includes(String(n.id))) {
        readIds.push(String(n.id));
      }
    });
    localStorage.setItem('flc_read_notifications', JSON.stringify(readIds));
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


  
  const workingDayMap = useMemo(() => {
    const start = sel?.startDate;
    const map = {};
    if (!start) {
      for (let i = 1; i <= 150; i++) map[i] = i;
      return map;
    }
    const sd = new Date(start + 'T00:00:00Z');
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
  }, [sel?.startDate]);

  const cTasks = useMemo(() => {
    const defs = sel?.tasks?.__defs;
    const start = sel?.startDate;

    if (!defs) {
      return [...DEFAULT_TASKS];
    }

    const defsMap = new Map(defs.map(d => [d.id, d]));
    const defaultIds = new Set(DEFAULT_TASKS.map(t => t.id));
    const merged = [];

    DEFAULT_TASKS.forEach(bt => {
      if (defsMap.has(bt.id)) {
        const dt = defsMap.get(bt.id);
        merged.push({ ...bt, ...dt, n: dt.n || bt.n, role: dt.role || bt.role, isPost: bt.isPost, deps: bt.deps });
      }
    });

    defs.forEach(dt => {
      if (!defaultIds.has(dt.id)) {
        if (dt.isPost && dt.day >= 8 && dt.day % 2 !== 0) return;
        if (dt.id.match(/^p\d+$/) && dt.day >= 8) return;
        merged.push(dt);
      }
    });

    return merged;
  }, [sel?.tasks?.__defs, sel?.startDate]);

  const TMAP = useMemo(() => {
    const map = {};
    cTasks.forEach(t => { map[t.id] = t; });
    return map;
  }, [cTasks]);

  useEffect(() => {
    if (sel && todayDrawerOpen) {
      const notes = {};
      cTasks.forEach(t => {
        notes[t.id] = sel.tasks[t.id]?.notes || "";
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
    const tzFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = tzFormatter.format(new Date());
    const dToday = new Date(todayStr + 'T00:00:00Z');
    const dStart = new Date(sel.startDate + 'T00:00:00Z');
    return Math.max(1, Math.round((dToday - dStart) / 86400000) + 1);
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

    // Notify Slack if assignee changed
    if (newAssignee && newAssignee !== oldAssignee) {
      const member = teamMembers.find(m => m.name === newAssignee);
      if (member) {
        fetch('/api/notify-assignment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: currentLatest.name,
            task_name: taskData.n,
            member_name: member.name,
            slack_id: member.slack_id || "",
            slack_channel_id: currentLatest.tasks?.__slack_id || ""
          })
        }).catch(err => console.error("Slack assignment notification failed:", err));
      }
    }

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
    
    const member = teamMembers.find(m => m.name.toLowerCase().trim() === assigneeName.toLowerCase().trim());
    const slackId = member ? (member.slack_id || "") : "";
    const slackChannelId = currentLatest.tasks?.__slack_id || "";

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

    toast.promise(
      fetch('/api/notify-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: currentLatest.name,
          task_name: taskObj.n,
          member_name: assigneeName,
          slack_id: slackId,
          slack_channel_id: slackChannelId
        })
      }).then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to send notification');
        }
      }),
      {
        loading: 'Assigning task and notifying Slack...',
        success: `Task assigned to ${assigneeName} & notification sent!`,
        error: (err) => `Assigned, but Slack notification failed: ${err.message}`
      }
    );
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

        fetch('/api/notify-slack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            member_name: user.name,
            task_name: displayName,
            client_name: currentLatest.name,
            notes: currentLatest.tasks[id]?.notes || "",
            slack_channel_id: currentLatest.tasks?.__slack_id || "",
            duration: formattedDuration
          })
        }).catch(err => console.error("Slack notification trigger failed:", err));
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
    setNewDate(c.startDate);
    setEditWebsite(c.tasks?.__website || "");
    setEditDriveLink(c.tasks?.__drive_link || "");
    setEditClientName(c.tasks?.__client_name || "");
    setEditSlackId(c.tasks?.__slack_id || "");
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
    const tempId = Date.now();
    const initialTasks = mkState(DEFAULT_TASKS);
    initialTasks.__website = newWebsite.trim();
    initialTasks.__drive_link = newDriveLink.trim();
    initialTasks.__client_name = newClientName.trim();
    initialTasks.__slack_id = newSlackId.trim();
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
      <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Toaster position="top-center" richColors />
        <AnimatePresence mode="wait">
          {authView !== 'landing' && (
            <motion.div 
              key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ ...S.modalBox, width: 400 }}
            >
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, textAlign: 'center', color: '#0f172a' }}>{authStep === 'otp' ? 'Check Your Email' : (authView === 'login' ? 'Portal Sign In' : 'Account Onboarding')}</h3>
              <p style={{ color: '#475569', fontSize: 13, textAlign: 'center', marginBottom: 32 }}>
                {authView === 'forgot' 
                  ? (authStep === 'otp' ? 'Enter the code we sent to your email.' : (authStep === 'newpassword' ? 'Set your new secure password.' : 'Enter your email to receive a reset code.'))
                  : (authStep === 'otp' ? `We sent a 6-digit code to ${uEmail}.` : (authView === 'login' ? 'Authorized personnel only.' : 'Create your secure profile.'))
                }
              </p>
              
              {authError && (
                <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 12, padding: '12px 16px', color: '#c2410c', fontSize: 13, marginBottom: 20, textAlign: 'center', fontWeight: 600 }}>
                  ⚠️ {authError}
                </div>
              )}
              
              {authStep === 'credentials' ? (
                <>
                  {authView === 'signup' && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', tracking: 2, marginBottom: 4 }}>NAME</div>
                      <input style={S.input} value={uName} onChange={e => setUName(e.target.value)} placeholder="Full Name" />
                    </div>
                  )}
                  
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', tracking: 2, marginBottom: 4 }}>EMAIL ADDRESS</div>
                    <input style={S.input} value={uEmail} onChange={e => setUEmail(e.target.value)} placeholder="name@spreadpixel.com" />
                  </div>

                  {authView !== 'forgot' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', tracking: 2, marginBottom: 4 }}>PASSWORD (Secret Token)</div>
                      <div style={{ position: 'relative' }}>
                        <input type={showPass ? "text" : "password"} style={S.input} value={uPass} onChange={e => setUPass(e.target.value)} placeholder="••••••••" />
                        <button 
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {authView === 'login' && (
                        <div 
                          onClick={() => { setAuthView('forgot'); setAuthStep('credentials'); }}
                          style={{ textAlign: 'right', fontSize: 12, color: '#ea580c', marginTop: 8, cursor: 'pointer', fontWeight: 600 }}
                        >
                          Forgot Password?
                        </div>
                      )}
                    </div>
                  )}

                  {authView === 'signup' && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', tracking: 2, marginBottom: 8 }}>SELECT YOUR ROLE</div>
                      <select 
                        style={{ ...S.input, appearance: 'none', background: '#f8fafc', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }} 
                        value={uRole} 
                        onChange={e => setURole(e.target.value)}
                      >
                        <option value="member">Select Team Position...</option>
                        {Object.keys(ROLES).map(k => (
                          <option key={k} value={k}>{ROLES[k].label}</option>
                        ))}
                        <option value="admin">Executive Administrator (Admin Only)</option>
                      </select>
                    </div>
                  )}

                  {authView === 'signup' && uRole === 'admin' && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#f43f5e', tracking: 2, marginBottom: 4 }}>ADMINISTRATIVE PASSKEY</div>
                      <input type="password" style={{ ...S.input, border: '1px solid rgba(244,63,94,0.3)' }} value={adminToken} onChange={e => setAdminToken(e.target.value)} placeholder="Secret Token" />
                    </div>
                  )}

                  <button 
                    onClick={async () => {
                      setAuthError("");
                      if (!uEmail) return toast.error("Please enter your email");
                      if (authView !== 'forgot' && !uPass) return toast.error("Please enter password");
                      
                      setLoading(true);
                      try {
                        if (authView === 'login') {
                          const u = await signInUser(uEmail, uPass);
                          if (!u) throw new Error("Authentication failed. Please check your credentials.");
                          
                          setUser(u);
                          setAccess((u.role || uRole || 'member').toLowerCase());
                          sessionStorage.setItem("flc_user", JSON.stringify(u));
                          sessionStorage.setItem("flc_access", (u.role || uRole || 'member').toLowerCase());
                          toast.success("Authentication successful");
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

                        // Send OTP via our backend
                        const apiPath = authView === 'forgot' ? '/api/auth/request-password-reset' : '/api/auth/send-otp';
                        const res = await fetch(apiPath, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: uEmail, password: uPass, isLogin: false })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

                        setAuthStep('otp');
                        setOtpCode(""); // Reset OTP field
                        if (authView === 'forgot') setUPass(""); // Only clear for reset flow
                        toast.success("OTP sent successfully");
                      } catch (e) {
                        toast.error("Error: " + e.message);
                        setAuthError(e.message);
                      }
                      setLoading(false);
                    }}
                    disabled={loading}
                    style={{ ...S.btn(true), width: '100%', justifyContent: 'center', marginBottom: 24 }}
                  >
                    {loading ? 'Processing...' : (authView === 'login' ? 'Sign In' : (authView === 'forgot' ? 'Send Reset Code' : 'Send Verification Code'))}
                  </button>
                </>
              ) : (
                <>
                  {authStep === 'otp' && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', tracking: 2, marginBottom: 12, textAlign: 'center' }}>ENTER 6-DIGIT CODE</div>
                      <input 
                        style={{ ...S.input, fontSize: 32, fontWeight: 900, textAlign: 'center', letterSpacing: 8, height: 64 }} 
                        value={otpCode} 
                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                        placeholder="000000" 
                      />
                    </div>
                  )}

                  {authView === 'forgot' && authStep === 'newpassword' && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', tracking: 2, marginBottom: 4 }}>NEW PASSWORD</div>
                      <div style={{ position: 'relative' }}>
                        <input type={showPass ? "text" : "password"} style={S.input} value={uPass} onChange={e => setUPass(e.target.value)} placeholder="••••••••" />
                        <button 
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={async () => {
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
                          if (!res.ok) throw new Error(data.error || 'Invalid or expired code');

                          if (authView === 'forgot') {
                            setAuthStep('newpassword');
                            setUPass(""); // Clear for new password entry
                          } else {
                            let u = data.user;
                            // Signup flow - calls our backend
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
                            toast.success("Authentication successful");
                          }
                        } catch (e) { 
                          console.error("Auth Exception:", e);
                          toast.error("Failed: " + e.message); 
                          setAuthError(e.message);
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
                          if (!res.ok) throw new Error(data.error || 'Update failed');
                          
                          toast.success("Password updated successfully! Please sign in with your new password.");
                          setAuthView('login');
                          setAuthStep('credentials');
                          setUPass("");
                          setOtpCode("");
                        } catch (e) {
                          toast.error("Update Failed: " + e.message);
                          setAuthError(e.message);
                        }
                        setOtpLoading(false);
                      }
                    }}
                    disabled={otpLoading}
                    style={{ ...S.btn(true), width: '100%', justifyContent: 'center', marginBottom: 16 }}
                  >
                    {otpLoading ? 'Processing...' : (authStep === 'otp' ? 'Verify Code' : 'Update Password & Sign In')}
                  </button>

                  <div 
                    onClick={() => {
                        setAuthStep('credentials');
                        if (authView === 'forgot') setAuthView('login');
                    }}
                    style={{ textAlign: 'center', fontSize: 13, color: '#64748b', cursor: 'pointer', marginBottom: 24 }}
                  >
                    ← {authView === 'forgot' ? 'Back to Sign In' : 'Wrong email? Back to login'}
                  </div>
                </>
              )}

              <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
                {authView === 'login' ? (
                  <>Don't have an account? <span onClick={() => { setAuthView('signup'); setAuthStep('credentials'); }} style={{ color: '#ea580c', cursor: 'pointer', fontWeight: 600 }}>Sign up here</span></>
                ) : (
                  <>
                    {authView === 'forgot' ? 'Remembered your password?' : 'Already registered?'} <span onClick={() => { setAuthView('login'); setAuthStep('credentials'); }} style={{ color: '#ea580c', cursor: 'pointer', fontWeight: 600 }}>Sign in here</span>
                  </>
                )}
                <div style={{ marginTop: 12, cursor: 'pointer' }} onClick={() => { setAuthView('login'); setAuthStep('credentials'); }}>Reset Form</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const cDay = dayNum();
  const pkg = PACKAGES.find(p => p.id === sel?.package) || PACKAGES[1];
  const totalDone = sel ? cTasks.filter(t => sel.tasks[t.id]?.done).length : 0;
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
              Showing your tasks for <strong style={{ color: '#0f172a' }}>{sel.name}</strong> • Day {cDay} {isSpecificRole && `(${ROLES[userRole]?.label})`}
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

    // Calculate Weekday for outreach tasks
    let weekday = "";
    if (task.isPost && sel?.startDate) {
      const d = new Date(sel.startDate + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() + (task.day - 1));
      weekday = d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' });
    }

    return (
      <motion.div 
        layout
        className="task-item-card"
        style={{ 
          display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 16, marginBottom: 8,
          background: ready ? '#ecfdf5' : '#fffbf7', border: `1px solid ${ready ? '#a7f3d0' : 'rgba(234,88,12,0.06)'}`,
          opacity: locked ? 0.5 : 1, boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <div className="task-item-main" style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
          <div 
            onClick={() => isMember && toggleTask(task.id)}
            style={{ 
              width: 22, height: 22, borderRadius: 6, border: `2px solid ${st.done ? '#ea580c' : '#cbd5e1'}`,
              background: st.done ? '#ea580c' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (locked || !isMember) ? 'default' : 'pointer',
              flexShrink: 0
            }}
          >
            {st.done && <CheckCircle2 size={14} color="#fff" />}
            {locked && <Lock size={10} color="#94a3b8" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: st.done ? '#94a3b8' : '#0f172a', textDecoration: st.done ? 'line-through' : 'none' }}>{task.n}</span>
              {ready && <span style={S.badge('#10b981')}>Ready</span>}
              {task.freq && !task.isPost && <span style={S.badge('#818cf8')}>{task.freq}</span>}
              {st.assigned && access !== 'client' && (
                <span style={{ ...S.badge(st.timerActive ? '#f59e0b' : '#3b82f6'), display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  ⏱️ {formatTaskDuration(st)}
                  {st.timerActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />}
                </span>
              )}
            </div>
            {st.notes && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, width: '100%', minWidth: 0 }}>
                <div style={{ padding: '2px 6px', background: '#ffedd5', color: '#ea580c', borderRadius: 6, fontWeight: 800, fontSize: 9, textTransform: 'uppercase', flexShrink: 0 }}>Log</div>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>{st.notes.replace(/\n/g, ' ')}</span>
              </div>
            )}
            {st.review && (
              <div style={{ fontSize: 11, color: '#0ea5e9', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, width: '100%', minWidth: 0 }}>
                <div style={{ padding: '2px 6px', background: '#e0f2fe', color: '#0ea5e9', borderRadius: 6, fontWeight: 800, fontSize: 9, textTransform: 'uppercase', flexShrink: 0 }}>Review</div>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>{st.review.replace(/\n/g, ' ')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="task-item-actions" style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {isTeamLead && !st.done && (
            !st.assigned ? (
              <button 
                title="Assign Task" 
                onClick={() => assignTask(task.id)} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 8, 
                  border: '1px solid #3b82f6', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', 
                  fontSize: 10, fontWeight: 700, cursor: 'pointer'
                }}
              >
                <UserCheck size={12} /> Assign
              </button>
            ) : (
              <span 
                onClick={() => assignTask(task.id)}
                style={{ fontSize: 10, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }} 
                title="Click to re-assign and notify again"
              >
                <UserCheck size={12} color="#10b981" /> Assigned ({st.assignedBy || 'Lead'})
              </span>
            )
          )}
          {isMember && st.assigned && !st.done && (
            st.timerActive ? (
              <button 
                title="Pause Timer" 
                onClick={() => pauseTimer(task.id)} 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%',
                  border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer'
                }}
              >
                <Pause size={12} fill="#fff" />
              </button>
            ) : (
              <button 
                title="Start Timer" 
                onClick={() => startTimer(task.id)} 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%',
                  border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer'
                }}
              >
                <Play size={12} fill="#fff" style={{ marginLeft: 1 }} />
              </button>
            )
          )}
          <button 
            onClick={() => setModal({type: 'notes', task, nm: task.n})} 
            style={{
              color: st.review ? '#0ea5e9' : (st.notes ? '#ea580c' : '#94a3b8'), 
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0,
              position: 'relative'
            }}
          >
            <MessageSquare size={16} />
            {access === 'client' && st.done && !st.review && <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: '#0ea5e9', borderRadius: '50%', border: '2px solid #fff' }} />}
          </button>
          {isAdmin && (
            <>
              <button title="Edit Custom Task" onClick={() => setTaskModal({ type: 'edit', task })} style={{color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0}}><Settings size={16} /></button>
              <button title="Delete Task" onClick={() => deleteTaskDef(task.id)} style={{color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0}}><Trash2 size={16} /></button>
            </>
          )}
          {isMember && (
            <button title="View SOP" onClick={() => { setModal({type: 'sop', task, nm: task.n}); genSOP(task.n); }} style={{color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0}}><BookOpen size={16} /></button>
          )}
          <span style={S.badge(badgeColor)}>{displayName || '??'}</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, width: '100%', position: 'relative', flexShrink: 0 }}>
            <img src="/logo.png" alt="Ops Hub Logo" style={{ height: 75, width: 'auto', objectFit: 'contain' }} />
            {window.innerWidth <= 1024 && (
              <button onClick={() => setSidebarOpen(false)} style={{ color: '#64748b', background: 'none', border: 'none', position: 'absolute', right: 0 }}><X size={20} /></button>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {clients.filter(c => c.package !== 'lead' && (access !== 'client' || c.id === selId)).map(c => (
              <div 
                key={c.id} 
                onClick={() => { setSelId(c.id); if (tab === 'team' || tab === 'live') setTab('sprint'); }}
                style={{ 
                  padding: '16px', borderRadius: 20, cursor: 'pointer', marginBottom: 12,
                  background: selId === c.id ? 'rgba(234,88,12,0.08)' : 'transparent', border: `1px solid ${selId === c.id ? 'rgba(234,88,12,0.2)' : 'transparent'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 600, color: selId === c.id ? '#ea580c' : '#64748b', fontSize: 14 }}>{c.name}</div>
                    {c.tasks?.__client_name && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{c.tasks.__client_name}</div>}
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Edit3 size={12} style={{ color: '#64748b', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); openEditModalForClient(c); }} />
                      <Trash2 size={12} style={{ color: '#ea580c', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDeleteClient(c); }} />
                    </div>
                  )}
                </div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 12 }}>
                  <div style={{ height: '100%', width: `${Math.round((c.tasks.__defs || DEFAULT_TASKS).filter(t => c.tasks[t.id]?.done).length / (c.tasks.__defs || DEFAULT_TASKS).length * 100)}%`, background: '#ea580c', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <button 
              onClick={() => { setAddingC(true); setNewName(""); setNewWebsite(""); setNewDriveLink(""); setNewClientName(""); setNewSlackId(""); setNewBD(""); }} 
              style={{ width: '100%', padding: 16, border: '1px dashed rgba(234,88,12,0.2)', background: 'transparent', borderRadius: 20, color: '#64748b', margin: '12px 0', cursor: 'pointer', flexShrink: 0 }}
            >
              + New Client
            </button>
          )}
        </div>

        <div style={{ padding: '0 24px 24px', flexShrink: 0 }}>
          <div style={{ padding: '24px 0', borderTop: '1px solid rgba(234,88,12,0.08)' }}>
            <button 
              onClick={() => { setAccess('none'); setAuthView('landing'); sessionStorage.removeItem('flc_access'); sessionStorage.removeItem('flc_user'); }}
              style={{ width: '100%', padding: '16px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12, background: '#fff5ed', color: '#64748b', border: '1px solid rgba(234,88,12,0.08)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={16} /> Sign Out System
            </button>
          </div>
        </div>
      </aside>
      {/* Main Container */}
      <main style={S.main}>
        <header style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {(!sidebarOpen || window.innerWidth <= 1024) && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <LayoutDashboard size={24} />
              </button>
            )}
            {sel && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h2 style={{ fontWeight: 900, fontSize: 20, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {sel.name}
                    {syncing && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'flex' }}><Clock size={16} color="#94a3b8" /></motion.div>}
                  </h2>
                  <span style={S.badge(pkg.color)}>{pkg.label}</span>
                  {access === 'client' && <span style={S.badge('#94a3b8')}>View Only</span>}
                  {isAdmin && <span style={S.badge('#a855f7')}>Admin: {user?.name}</span>}
                  {access !== 'admin' && access !== 'client' && access !== 'none' && (
                    <span style={S.badge(ROLES[access.toUpperCase()]?.color || '#10b981')}>
                      {ROLES[access.toUpperCase()]?.label || 'Member'}: {user?.name}
                    </span>
                  )}
                  <span style={{ color: '#cbd5e1' }} className="mobile-hide">•</span>
                  <span style={{ fontSize: 12, color: syncing ? '#ea580c' : '#10b981', fontWeight: 700 }} className="mobile-hide">{syncing ? 'SYNCING...' : 'CLOUD SYNCED'}</span>
                  {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default' && (
                    <button 
                      onClick={() => Notification.requestPermission().then(perm => { if (perm === 'granted') toast.success('Desktop notifications enabled!'); })}
                      style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800, background: '#ffedd5', border: '1px solid #ea580c', color: '#ea580c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}
                    >
                      🔔 Enable Alerts
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {sel.tasks?.__client_name && <span style={{ fontWeight: 700, color: '#0f172a' }}>{sel.tasks.__client_name}</span>}
                    {sel.tasks?.__client_name && ' • '}
                    {sel.tasks?.__assigned_bd && <span style={{ fontWeight: 700, color: '#0f172a' }}>BD: {sel.tasks.__assigned_bd}</span>}
                    {sel.tasks?.__assigned_bd && ' • '}
                    Day {cDay} • Progress: {totalPct}%
                  </div>
                  
                  {sel.tasks?.__website ? (
                    <a 
                      href={sel.tasks.__website.startsWith('http') ? sel.tasks.__website : `https://${sel.tasks.__website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#ea580c', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', borderBottom: '1px dashed transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.borderBottomColor = '#ea580c'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                    >
                      <Globe size={12} /> {sel.tasks.__website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : isAdmin ? (
                    <button 
                      onClick={() => {
                        setEditId(sel.id);
                        setEditNm(sel.name);
                        setNewPkg(sel.package);
                        setNewDate(sel.startDate);
                        setEditWebsite("");
                        setEditDriveLink(sel.tasks?.__drive_link || "");
                        setEditClientName(sel.tasks?.__client_name || "");
                        setEditSlackId(sel.tasks?.__slack_id || "");
                        setEditBD(sel.tasks?.__assigned_bd || "");
                      }}
                      style={{ background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      + Add Website
                    </button>
                  ) : null}

                  {sel.tasks?.__drive_link ? (
                    <a 
                      href={sel.tasks.__drive_link.startsWith('http') ? sel.tasks.__drive_link : `https://${sel.tasks.__drive_link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#ea580c', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', borderBottom: '1px dashed transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.borderBottomColor = '#ea580c'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                    >
                      <FolderOpen size={12} /> Google Drive
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
                      style={{ background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      + Add Drive Link
                    </button>
                  ) : null}

                  {sel && (
                    <button 
                      onClick={() => setModal({ type: 'standard_notes', nm: `${sel.name} - Standard Notes` })}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#ea580c', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s', borderBottom: '1px dashed transparent', padding: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.borderBottomColor = '#ea580c'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                    >
                      <BookOpen size={12} /> Standard Note
                    </button>
                  )}
                </div>
                </div>
            )}
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: 16 }}>
            {isAdmin && (
               <button
                 onClick={() => setTab('live')}
                 style={{ ...S.btn(tab === 'live'), background: tab === 'live' ? '#ea580c' : '#fffbf7', color: tab === 'live' ? '#fff' : '#ea580c', border: '1px solid #ea580c', gap: 8, marginRight: 8 }}
               >
                 <TrendingUp size={16} /> <span className="mobile-hide">Admin View</span>
               </button>
            )}
            {isMember && !isAdmin && (
               <button
                 onClick={() => setTab('my-tasks')}
                 style={{ ...S.btn(tab === 'my-tasks'), background: tab === 'my-tasks' ? '#ea580c' : '#fffbf7', color: tab === 'my-tasks' ? '#fff' : '#ea580c', border: '1px solid #ea580c', gap: 8, marginRight: 8 }}
               >
                 <CheckCircle2 size={16} /> <span className="mobile-hide">My Tasks</span>
               </button>
            )}
            {isAdmin && sel && (
               <button
                 onClick={() => setModal({ type: 'share' })}
                 style={{ ...S.btn(false), background: '#ffedd5', color: '#ea580c', border: '1px solid #fed7aa' }}
               >
                 <Share2 size={16} /> <span className="mobile-hide">Share Portal</span>
               </button>
            )}
            {isMember && (
              <button
                onClick={() => setShowReport(true)}
                style={{ ...S.btn(false), background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', gap: 8 }}
              >
                <FileDown size={16} /> <span className="mobile-hide">Report</span>
              </button>
            )}
            {isBDOrAdmin && (
              <button
                onClick={() => setTab('bd-hub')}
                style={{ ...S.btn(tab === 'bd-hub'), background: tab === 'bd-hub' ? '#ea580c' : '#fff5ed', color: tab === 'bd-hub' ? '#fff' : '#0f172a', border: '1px solid rgba(234,88,12,0.08)', gap: 8, marginRight: 8 }}
              >
                <Layers size={16} /> <span className="mobile-hide">BD Hub</span>
              </button>
            )}
            <button
              onClick={() => setTab('creative')}
              style={{ ...S.btn(tab === 'creative'), background: tab === 'creative' ? '#7c3aed' : '#f5f3ff', color: tab === 'creative' ? '#fff' : '#7c3aed', border: '1px solid #c084fc', gap: 8, marginRight: 8, fontWeight: 800 }}
            >
              <Sparkles size={16} /> <span className="mobile-hide">Creative Hub</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setTab('team')}
                style={{ ...S.btn(tab === 'team'), background: tab === 'team' ? '#ea580c' : '#fff5ed', color: tab === 'team' ? '#fff' : '#0f172a', border: '1px solid rgba(234,88,12,0.08)', gap: 8 }}
              >
                <Users size={16} /> <span className="mobile-hide">Manage Team</span>
              </button>
            )}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    markAllNotificationsAsRead();
                  }
                }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: '#fff5ed',
                  border: '1px solid rgba(234,88,12,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  color: '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ffedd5'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff5ed'}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#ea580c',
                    color: '#ffffff',
                    fontSize: 9,
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'transparent' }} 
                      onClick={() => setShowNotifications(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 50,
                        width: 320,
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 16,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 100,
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(234,88,12,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#fff5ed'
                      }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>Recent Activity</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllNotificationsAsRead} 
                            style={{ border: 'none', background: 'none', color: '#ea580c', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div style={{ maxHeight: 280, overflowY: 'auto' }} className="custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b', fontSize: 12 }}>
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((n, i) => (
                            <div 
                              key={n.id || i} 
                              style={{ 
                                padding: '12px 16px', 
                                borderBottom: i < notifications.length - 1 ? '1px solid rgba(234,88,12,0.04)' : 'none', 
                                background: n.unread ? '#fff7ed' : 'transparent', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 4 
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                                <span style={{ fontWeight: 800, fontSize: 11, color: n.type === 'system' ? '#3b82f6' : '#ea580c' }}>
                                  {n.title}
                                </span>
                                <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                  {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <span style={{ fontSize: 12, color: '#334155', lineHeight: 1.4 }}>
                                {n.body}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#ffedd5', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', fontWeight: 800 }}>{user?.name?.[0] || 'F'}</div>
          </div>
        </header>

        <div className="tab-bar" style={{ padding: '16px 24px 24px', borderBottom: '1px solid rgba(234,88,12,0.08)', background: '#fffbf7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, overflowX: 'auto' }} className="tab-scroll">
            {/* Phase Selection */}
             <div style={{ display: 'flex', gap: 8, background: '#fff5ed', padding: 6, borderRadius: 16, flexShrink: 0 }}>
              {[
                ["sprint", "Day 1-7", "Foundations", Calendar],
                ["ongoing_8_30", "Day 8-30", "Operations", BarChart3],
                ["ongoing_31_60", "Day 31-60", "Operations", BarChart3],
                ["ongoing_61_90", "Day 61-90", "Operations", BarChart3]
              ]
                .map(([id, title, subtitle, Icon]) => (
                <button 
                  key={id} 
                  onClick={() => { setTab(id); setPhase(id.startsWith('ongoing') ? 'ongoing' : id); }} 
                  style={{
                    ...S.btn(tab === id), flexDirection: 'column', alignItems: 'flex-start', padding: '8px 24px', gap: 0, minWidth: 140
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{typeof Icon === 'string' ? Icon : <Icon size={16} />}</span>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>{title}</span>
                  </div>
                  {subtitle && <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.8, paddingLeft: 26, marginTop: -2 }}>{subtitle}</span>}
                </button>
              ))}
            </div>

            {/* Role Filter Icons */}
            {sel && (tab === 'sprint' || tab.startsWith('ongoing')) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'relative' }}>
                <div style={{ width: 1, height: 40, background: '#fed7aa', margin: '0 8px' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Filter size={16} style={{ position: 'absolute', left: 16, color: '#ea580c', pointerEvents: 'none' }} />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      padding: '12px 40px 12px 42px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid rgba(234,88,12,0.2)',
                      background: '#fff7ed',
                      color: '#ea580c',
                      minWidth: 160,
                      outline: 'none',
                      boxShadow: '0 4px 6px -1px rgba(234,88,12,0.1)'
                    }}
                  >
                    <option value="All">All Members</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, color: '#ea580c', pointerEvents: 'none' }} />
                </div>

                <button
                  onClick={() => setTodayDrawerOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: '1px solid rgba(234,88,12,0.2)',
                    background: '#ea580c',
                    color: '#ffffff',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxShadow: '0 4px 6px -1px rgba(234,88,12,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#c2410c';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ea580c';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Calendar size={16} />
                  <span>Today's Task</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setShowBulkModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 20px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: '1px solid #ddd6fe',
                      background: '#f5f3ff',
                      color: '#7c3aed',
                      transition: 'all 0.2s',
                      outline: 'none',
                      boxShadow: '0 4px 6px -1px rgba(124,58,237,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ddd6fe';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f5f3ff';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Layers size={16} />
                    <span>Bulk Actions</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={S.content} className="main-content">
          {tab === 'bd-hub' ? (
            <BDHub clients={clients} setClients={setClients} user={user} isAdmin={isAdmin} isBDOrAdmin={isBDOrAdmin} onEditLead={openEditModalForClient} onOpenAiScorer={openAiScorerForClient} sel={sel} />
          ) : tab === 'creative' ? (
            <CreativeHub sel={sel} setClients={setClients} user={user} isAdmin={isAdmin} />
          ) : tab === 'team' && isAdmin ? (
            <TeamManagement clients={clients} />
          ) : tab === 'live' && isAdmin ? (
            <AdminLiveDash clients={clients} tasks={tasks} />
          ) : tab === 'my-tasks' && isMember ? (
            <MemberMyTasksView />
          ) : !sel ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <LayoutDashboard size={80} />
              <div style={{ marginTop: 24, fontSize: 18, fontWeight: 700 }}>Select a client to begin</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {tab === 'sprint' && (
                <motion.div key="sprint" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="responsive-grid">
                   {[1, 2, 3, 4, 5, 6, 7].map(day => {
                    const dayTasks = cTasks.filter(t => t.phase === 'sprint' && t.day === day && (roleFilter === 'All' || t.role === roleFilter || ROLE_TO_NAME[t.role] === roleFilter));
                    if (!dayTasks.length && !isAdmin) return null;
                    
                    const dayDate = sel?.startDate ? new Date(new Date(sel.startDate + 'T00:00:00Z').getTime() + ((workingDayMap[day] || day) - 1) * 86400000) : null;
                    const weekday = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' }) : "";
                    const dateStr = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }) : "";

                    return (
                      <div key={day} id={`day-card-${day}`} className="card-padding" style={S.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <h4 style={{ fontWeight: 800, fontSize: 16 }}>Day {day} Sprint <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 12, marginLeft: 6 }}>({weekday}, {dateStr})</span></h4>
                            {isAdmin && <button title="Add Task" onClick={() => setTaskModal({ type: 'add', task: { id: 't'+Date.now(), phase: 'sprint', day, n: '', role: 'AM', deps: [] } })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', padding: 0 }}><Plus size={18} /></button>}
                          </div>
                          {(workingDayMap[day] || day) === cDay && <span style={S.badge('#ea580c')}>Active Today</span>}
                        </div>
                        {dayTasks.length > 0 ? dayTasks.map(t => <TaskItem key={t.id} task={t} />) : <div style={{ fontSize: 13, color: '#94a3b8' }}>No tasks for Day {day}.</div>}
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
   
                     {/* Outreach Grid - 37 Boxes */}
                    {(() => {
                      let minDay = 8;
                      let maxDay = 90;
                      if (tab === 'ongoing_8_30') { minDay = 8; maxDay = 30; }
                      else if (tab === 'ongoing_31_60') { minDay = 31; maxDay = 60; }
                      else if (tab === 'ongoing_61_90') { minDay = 61; maxDay = 90; }
   
                      const allPostDays = Array.from(new Set(cTasks.filter(t => t.isPost && t.day >= minDay && t.day <= maxDay).map(t => t.day))).sort((a,b)=>a-b);
                      const visiblePostDays = allPostDays.filter(day => 
                        cTasks.some(t => t.day === day && t.isPost && (roleFilter === 'All' || t.role === roleFilter || ROLE_TO_NAME[t.role] === roleFilter))
                      );
   
                      if (visiblePostDays.length === 0) return null;
   
                      const rangeTasks = cTasks.filter(t => t.isPost && t.day >= minDay && t.day <= maxDay);
                      const rangeCompletedTasks = rangeTasks.filter(t => sel.tasks[t.id]?.done);
   
                      return (
                        <div className="card-padding" style={S.card}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(234,88,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={20} color="#ea580c" />
                              </div>
                              <div>
                                <h4 style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Outreach Posts Schedule ({tab === 'ongoing_8_30' ? 'Day 8-30' : tab === 'ongoing_31_60' ? 'Day 31-60' : 'Day 61-90'})</h4>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                                  {tab === 'ongoing_8_30' ? 'Day 8 to 30' : tab === 'ongoing_31_60' ? 'Day 31 to 60' : 'Day 61 to 90'} • Pattern: Skip 1 Day, Post 1 Day
                                </div>
                              </div>
                              {isAdmin && <button title="Add Post Day" onClick={() => setTaskModal({ type: 'add', task: { id: 't'+Date.now(), phase: 'ongoing', day: minDay, n: '', role: 'SMM', deps: [], isPost: true, freq: 'Outreach' } })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', padding: 0 }}><Plus size={18} /></button>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#ea580c' }}>{rangeCompletedTasks.length} / {rangeTasks.length}</span>
                              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Tasks Completed</div>
                            </div>
                          </div>
                          
                          <div className="responsive-grid">
                            {visiblePostDays.map(day => {
                              const dayTasks = cTasks.filter(t => t.day === day && t.isPost && (roleFilter === 'All' || t.role === roleFilter || ROLE_TO_NAME[t.role] === roleFilter));
                              const actualDay = workingDayMap[day] || day;
                              const dayDate = sel?.startDate ? new Date(new Date(sel.startDate + 'T00:00:00Z').getTime() + (actualDay - 1) * 86400000) : null;
                              const weekday = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long' }) : "";
                              const dateStr = dayDate ? dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }) : "";
   
                              return (
                                <div key={day} id={`day-card-${day}`} className="card-padding" style={{ ...S.card, padding: 20 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(234,88,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', fontWeight: 800, fontSize: 13 }}>{day}</div>
                                      <h4 style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{weekday} <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 12, marginLeft: 6 }}>({dateStr})</span></h4>
                                      {isAdmin && <button title="Add Task" onClick={() => setTaskModal({ type: 'add', task: { id: 't'+Date.now(), phase: 'ongoing', day, n: '', role: 'SMM', deps: [], isPost: true, freq: 'Outreach' } })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', padding: 0 }}><Plus size={18} /></button>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      {actualDay === cDay && <span style={S.badge('#ea580c')}>Active Today</span>}
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

                    {/* ─── Brand Assets & Auto Color Picker ─── */}
                    <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 16, padding: 18, marginBottom: 24 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Sparkles size={14} /> Brand Logo & Auto Color Picker
                      </div>

                      {/* Logo File Upload / URL */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                          Brand Logo (URL or Image Upload)
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <input
                            placeholder="e.g. https://domain.com/logo.png or upload image below..."
                            value={editId ? editBrandLogoUrl : newBrandLogoUrl}
                            onChange={e => {
                              const val = e.target.value;
                              if (editId) setEditBrandLogoUrl(val); else setNewBrandLogoUrl(val);
                              if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image')) {
                                handleLogoImageColorExtraction(val);
                              }
                            }}
                            style={{ ...S.input, flex: 1, fontSize: 12 }}
                          />
                          <label style={{ padding: '10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}>
                            {isExtractingColors ? 'Extracting...' : 'Upload Logo 🎨'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsExtractingColors(true);
                                try {
                                  const reader = new FileReader();
                                  reader.onload = async (event) => {
                                    const dataUrl = event.target.result;
                                    if (editId) setEditBrandLogoUrl(dataUrl); else setNewBrandLogoUrl(dataUrl);
                                    const colors = await extractDominantColors(file, 3);
                                    if (colors && colors.length > 0) {
                                      const colorsStr = colors.join(', ');
                                      if (editId) setEditBrandColors(colorsStr); else setNewBrandColors(colorsStr);
                                      toast.success(`Extracted ${colors.length} brand colors from logo!`);
                                    }
                                    setIsExtractingColors(false);
                                  };
                                  reader.readAsDataURL(file);
                                } catch (err) {
                                  toast.error('Logo extraction failed: ' + err.message);
                                  setIsExtractingColors(false);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Brand Colors with Swatch Bubbles */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: '#475569', textTransform: 'uppercase', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Brand Palette (Hex Colors)</span>
                          <span style={{ color: '#7c3aed', fontSize: 10, fontWeight: 700 }}>Auto-extracted from logo</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <input
                            placeholder="#7C3AED, #0F172A, #059669"
                            value={editId ? editBrandColors : newBrandColors}
                            onChange={e => editId ? setEditBrandColors(e.target.value) : setNewBrandColors(e.target.value)}
                            style={{ ...S.input, flex: 1, fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}
                          />
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {(editId ? editBrandColors : newBrandColors).split(',').map((hex, idx) => {
                              const cleanHex = hex.trim();
                              if (!cleanHex.startsWith('#')) return null;
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: '50%',
                                    background: cleanHex,
                                    border: '2px solid #ffffff',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                                    flexShrink: 0
                                  }}
                                  title={`Color ${idx + 1}: ${cleanHex}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Slack Channel ID</div>
                      <input placeholder="e.g. C01234567" value={editId ? editSlackId : newSlackId} onChange={e => editId ? setEditSlackId(e.target.value) : setNewSlackId(e.target.value)} style={S.input} />
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
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', tracking: 2, marginBottom: 8, textTransform: 'uppercase' }}>Service Package</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {PACKAGES.map(p => (
                          <button key={p.id} onClick={() => setNewPkg(p.id)} style={S.btn(newPkg === p.id)}>{p.label}</button>
                        ))}
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
                        setEditSlackId("");
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
                          const st = sel.tasks[t.id] || { done: false, notes: '', review: '' };
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
