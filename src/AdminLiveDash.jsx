import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard,
  Circle
} from 'lucide-react';

const S = {
  container: { padding: '20px 40px 60px', maxWidth: 1600, margin: '0 auto' },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { color: '#64748b', fontSize: 15, marginTop: 4, fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: 24 },
  card: { 
    background: '#fffbf7', 
    borderRadius: 28, 
    border: '1px solid rgba(234,88,12,0.08)', 
    padding: 24, 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  clientInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  dayBadge: {
    padding: '6px 14px', background: '#ffedd5', color: '#ea580c', 
    borderRadius: 14, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6
  },
  taskItem: {
    padding: '14px 16px', background: '#fff5ed', borderRadius: 16, border: '1px solid rgba(234,88,12,0.06)',
    display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s'
  },
  roleBadge: (color) => ({
    padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800,
    background: `${color}15`, color: color, textTransform: 'uppercase'
  }),
  olderBadge: {
    padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800,
    background: 'rgba(245, 158, 11, 0.12)', color: '#d97706',
    border: '1px solid rgba(245, 158, 11, 0.25)', textTransform: 'uppercase',
    letterSpacing: '0.03em'
  }
};

const ROLE_COLORS = {
  AM: '#3b82f6', CW: '#8b5cf6', GD: '#ec4899', VE: '#f59e0b',
  ADS: '#10b981', CRM: '#6366f1', OPS: '#ef4444', SMM: '#06b6d4', BD: '#dc2626'
};

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

export function ClientCard({ client, idx }) {
  const [expanded, setExpanded] = useState(false);

  const initialVisibleCount = 3; // Show first 3 tasks by default
  const hasMore = client.todaysTasks.length > initialVisibleCount;
  const visibleTasks = expanded 
    ? client.todaysTasks 
    : client.todaysTasks.slice(0, initialVisibleCount);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.05 }}
      className="card-padding"
      style={S.card}
    >
      <div style={S.clientInfo}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>{client.name}</h3>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Circle size={8} fill={client.package === 'premium' ? '#f59e0b' : '#94a3b8'} stroke="none" />
            {client.package.toUpperCase()} PACKAGE
          </div>
        </div>
        <div style={{
          ...S.dayBadge,
          background: client.isSunday ? 'rgba(239, 68, 68, 0.1)' : S.dayBadge.background,
          color: client.isSunday ? '#ef4444' : S.dayBadge.color
        }}>
          <Calendar size={14} />
          {client.currentDay < 1 
            ? `Starts in ${Math.abs(client.currentDay - 1)}d` 
            : `${client.isSunday ? 'Sunday (Off)' : `Day ${client.currentDay}`} • ${client.dateStr}`}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Deliverables &amp; Pending Tasks
        </div>
        
        {client.todaysTasks.length === 0 ? (
          <div style={{ 
            padding: '24px 16px', 
            textAlign: 'center', 
            color: '#64748b', 
            fontSize: 13, 
            background: '#f8fafc', 
            borderRadius: 16, 
            border: '1px dashed rgba(0,0,0,0.08)',
            fontWeight: 500
          }}>
             {client.isSunday ? "Sunday - Weekly Holiday" : "No tasks scheduled or pending today."}
          </div>
        ) : (
          <>
            {visibleTasks.map(t => {
              const isRoleKey = Object.keys(ROLE_COLORS).includes(t.role);
              const displayName = isRoleKey ? (ROLE_TO_NAME[t.role] || t.role) : t.role;
              const badgeColor = isRoleKey ? (ROLE_COLORS[t.role] || '#64748b') : '#6366f1';
              return (
                <div key={t.id} style={{
                  ...S.taskItem,
                  opacity: t.done ? 0.6 : 1,
                  borderLeft: `4px solid ${badgeColor}`
                }}>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{t.n}</div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      <span style={S.roleBadge(badgeColor)}>{displayName}</span>
                    {t.isOlder && (
                      <span style={S.olderBadge}>
                        Pending (Day {t.day})
                      </span>
                    )}
                    {t.done && (
                      <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} /> COMPLETED
                      </span>
                    )}
                  </div>
                  {/* Display Logs & Reviews */}
                  {t.notes && (
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 6, padding: '4px 8px', background: '#ffffff', borderRadius: 8, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <span style={{ fontWeight: 800, color: '#ea580c', marginRight: 4 }}>LOG:</span>
                      {t.notes.length > 80 ? t.notes.substring(0, 80) + '...' : t.notes}
                    </div>
                  )}
                  {t.review && (
                    <div style={{ fontSize: 10, color: '#0ea5e9', marginTop: 4, padding: '4px 8px', background: '#f0f9ff', borderRadius: 8, border: '1px solid rgba(14,165,233,0.1)' }}>
                      <span style={{ fontWeight: 800, color: '#0ea5e9', marginRight: 4 }}>CLIENT:</span>
                      {t.review.length > 80 ? t.review.substring(0, 80) + '...' : t.review}
                    </div>
                  )}
                </div>
                {!t.done && <Clock size={16} color="#94a3b8" />}
              </div>
            );
          })}

            {hasMore && (
              <button 
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea580c',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 4,
                  outline: 'none',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                {expanded ? 'Show Less' : `Show More (+${client.todaysTasks.length - initialVisibleCount} tasks)`}
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ 
        marginTop: 'auto', 
        paddingTop: 16, 
        borderTop: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} color="#ea580c" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ea580c' }}>
              {client.todaysTasks.length > 0
                ? `${Math.round((client.todaysTasks.filter(t => t.done).length / client.todaysTasks.length) * 100)}% Done`
                : '100% Done'}
            </span>
         </div>
         <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
            {client.todaysTasks.filter(t => t.done).length} / {client.todaysTasks.length} Tasks
         </div>
      </div>
    </motion.div>
  );
}

export default function AdminLiveDash({ clients, tasks }) {
  const tzFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const todayStr = tzFormatter.format(new Date());
  const dToday = new Date(todayStr + 'T00:00:00Z');
  
  const activeClients = clients.filter(c => c.package !== 'lead').map(client => {
    // 1. Calculate relative day based strictly on Pakistan time
    // Parse as UTC midnight so browser timezone has no effect
    const startDate = new Date(client.startDate + 'T00:00:00Z');
    const diffTime = dToday - startDate;
    const currentDay = Math.round(diffTime / 86400000) + 1;
    
    // 2. Create a universal "Working Day" map that skips Sundays for this client
    const workingDayMap = {};
    let actual = 1;
    for (let logical = 1; logical <= 150; logical++) {
      let d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + (actual - 1));
      while (d.getUTCDay() === 0) { // Sunday
        actual++;
        d = new Date(startDate);
        d.setUTCDate(d.getUTCDate() + (actual - 1));
      }
      workingDayMap[logical] = actual;
      actual++;
    }

    let dateStr = "";
    let isSunday = false;
    if (client.startDate) {
      const dayDate = new Date(startDate.getTime() + (Math.max(1, currentDay) - 1) * 86400000);
      isSunday = dayDate.getUTCDay() === 0;
      dateStr = dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
    }

    // 3. Merge latest defaults with client customizations to get accurate task list
    let merged = [...tasks];
    if (client.tasks?.__defs) {
      const defsMap = new Map(client.tasks.__defs.map(d => [d.id, d]));
      const defaultIds = new Set(tasks.map(t => t.id));
      const newMerged = [];

      tasks.forEach(bt => {
        if (defsMap.has(bt.id)) {
          const dt = defsMap.get(bt.id);
          newMerged.push({ ...bt, ...dt, n: dt.n || bt.n, role: dt.role || bt.role, isPost: bt.isPost, deps: bt.deps });
        }
      });

      client.tasks.__defs.forEach(dt => {
        if (!defaultIds.has(dt.id)) {
          if (dt.isPost && dt.day >= 8 && dt.day % 2 !== 0) return;
          if (dt.id.match(/^p\d+$/) && dt.day >= 8) return;
          newMerged.push(dt);
        }
      });
      merged = newMerged;
    }

    // 4. Map task state and determine if task is from a previous day and pending
    const allTasks = merged.map(t => {
      const taskState = client.tasks?.[t.id] || {};
      const actualTaskDay = workingDayMap[t.day] || t.day;
      return {
        ...t,
        ...taskState,
        done: !!taskState.done,
        isOlder: actualTaskDay < currentDay,
        actualTaskDay
      };
    });

    // 5. Filter: include today's tasks OR older pending (incomplete) tasks
    const todaysTasks = allTasks.filter(t => {
      if (t.actualTaskDay === currentDay) return true;
      if (t.actualTaskDay < currentDay && !t.done) return true;
      return false;
    });

    // 6. Sort tasks: older tasks first, then by day
    todaysTasks.sort((a, b) => {
      if (a.isOlder !== b.isOlder) {
        return a.isOlder ? -1 : 1; // Older first
      }
      return a.day - b.day;
    });

    return { ...client, currentDay, todaysTasks, dateStr, isSunday };
  });

  return (
    <div className="admin-live-container" style={S.container}>
      <header style={S.header}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={S.title}>Agency Live Overview</h1>
          <p style={S.subtitle}>
            Monitoring <span style={{ color: '#ea580c', fontWeight: 700 }}>{activeClients.length}</span> active clients in Ops Hub.
          </p>
        </motion.div>
      </header>

      {activeClients.length === 0 ? (
        <div style={{ padding: '100px 0', textAlign: 'center', opacity: 0.5 }}>
          <LayoutDashboard size={64} style={{ marginBottom: 20, margin: '0 auto' }} />
          <p style={{ fontSize: 18, fontWeight: 600 }}>No clients found in the system.</p>
        </div>
      ) : (
        <div style={S.grid}>
          <AnimatePresence>
            {activeClients.map((client, idx) => (
              <ClientCard key={client.id} client={client} idx={idx} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
