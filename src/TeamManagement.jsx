import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Settings, 
  X, 
  Search,
  ChevronDown,
  Shield,
  ShieldCheck,
  Plus,
  FileText,
  ArrowUpRight,
  ArrowLeft,
  Calendar,
  Filter,
  FileDown
} from 'lucide-react';
import { supabase, fetchMemberLogs } from './supabase';
import InviteModal from './InviteModal';
import { ROLES } from './constants';

const S = {
  container: { padding: 40, maxWidth: 1200, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 900, color: '#0f172a', margin: 0 },
  card: { background: '#fffbf7', borderRadius: 24, border: '1px solid rgba(234,88,12,0.08)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '16px 24px', background: '#fff5ed', borderBottom: '1px solid rgba(234,88,12,0.08)', fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '20px 24px', borderBottom: '1px solid rgba(234,88,12,0.04)', fontSize: 14, color: '#334155' },
  badge: (bg, fg) => ({ padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: bg, color: fg }),
  btn: (primary) => ({
    padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700,
    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s',
    background: primary ? '#ea580c' : '#fffbf7', color: primary ? '#fff' : '#64748b',
    border: primary ? 'none' : '1px solid rgba(234,88,12,0.12)'
  }),
  iconBtn: (color) => ({
    width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s', background: '#fff5ed', color: color, border: 'none'
  }),
  input: {
    padding: '12px 16px', background: '#fff5ed', border: '1px solid rgba(234,88,12,0.12)',
    borderRadius: 12, fontSize: 14, outline: 'none'
  }
};

export default function TeamManagement({ clients }) {
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const [securityPrompt, setSecurityPrompt] = useState(null); // { member, targetRole }
  const [securityCode, setSecurityCode] = useState('');
  const currentUser = JSON.parse(sessionStorage.getItem("flc_user") || "null");
  const ADMIN_SECRET = "SpreadPixel-Admin-Gate-99X!";
  
  // Audit State
  const [viewingLog, setViewingLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [fromData, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { data: usersData } = await supabase.from('flc_ops_users').select('*').order('name');
      const { data: invitesData } = await supabase.from('flc_ops_invites').select('*').order('created_at', { ascending: false });
      setMembers(usersData || []);
      setInvites(invitesData || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadLogs = async (email) => {
    setLogsLoading(true);
    try {
      const data = await fetchMemberLogs(email);
      setLogs(data);
    } catch (e) { toast.error("Audit logs are currently unavailable."); }
    setLogsLoading(false);
  };

  const removeMember = async (id, isInvite, email) => {
    if (isInvite) {
      if (!confirm("Are you sure? This will cancel the pending invitation.")) return;
    } else {
      if (!confirm("Are you sure? This will revoke all access for this user.")) return;
    }

    try {
      if (isInvite) {
        const { error } = await supabase.from('flc_ops_invites').delete().eq('email', email);
        if (error) throw error;
        toast.success("Invitation cancelled successfully");
      } else {
        const userToDelete = members.find(m => m.id === id);
        if (userToDelete?.email === currentUser?.email) {
          toast.error("You cannot delete your own account while logged in!");
          return;
        }

        const res = await fetch('/api/auth/delete-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to delete user');
        }
        
        toast.success("Member removed successfully");
      }
      fetchTeam();
    } catch (e) {
      console.error("Delete failed:", e);
      toast.error("Failed to remove: " + e.message);
    }
  };

  const updateAccess = async (user, newClients) => {
     try {
       await supabase.from('flc_ops_users').update({ assigned_clients: newClients }).eq('id', user.id);
       setEditingMember(null);
       fetchTeam();
       toast.success("Access updated successfully");
     } catch (e) { toast.error(e.message); }
  };

  const updateMemberRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('flc_ops_users')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      fetchTeam();
      toast.success("Role updated successfully!");
    } catch (e) {
      toast.error("Failed to update role: " + e.message);
    }
  };

  const handleRoleChange = async (member, newRole) => {
    if (newRole === 'admin') {
      setSecurityPrompt({ member, targetRole: newRole });
      setSecurityCode('');
    } else {
      await updateMemberRole(member.id, newRole);
    }
  };

  const verifyAndSetAdmin = async () => {
    if (securityCode !== ADMIN_SECRET) {
      toast.error("Incorrect Administrative Security Code!");
      return;
    }
    
    const { member, targetRole } = securityPrompt;
    await updateMemberRole(member.id, targetRole);
    setSecurityPrompt(null);
    setSecurityCode('');
  };

  if (viewingLog) {
    return (
      <AuditPageView 
        member={viewingLog} 
        onBack={() => setViewingLog(null)} 
      />
    );
  }

  return (
    <div style={S.container}>
      <header style={S.header}>
        <div>
          <h1 style={S.title}>Team Management</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Manage team members and view detailed performance audits</p>
        </div>
        <button onClick={() => setShowInvite(true)} style={S.btn(true)}>
          <UserPlus size={18} /> Invite Member
        </button>
      </header>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Team Member</th>
              <th style={S.th}>Role</th>
              <th style={S.th}>Slack User ID</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Clients Assigned</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td style={S.td}>
                  <button 
                    onClick={() => setViewingLog(m)}
                    style={{ 
                      background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#ea580c', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {m.name} <ArrowUpRight size={14} />
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{m.email}</div>
                  </button>
                </td>
                <td style={S.td}>
                  {m.email === currentUser?.email ? (
                    <span style={S.badge(m.role === 'admin' ? '#fff7ed' : '#eff6ff', m.role === 'admin' ? '#ea580c' : '#3b82f6')} title="You cannot change your own role">
                      {(m.role || 'Member').toUpperCase()}
                    </span>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <select
                        value={m.role || 'member'}
                        onChange={(e) => handleRoleChange(m, e.target.value)}
                        style={{
                          padding: '6px 28px 6px 12px',
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          background: m.role === 'admin' ? '#fff7ed' : (ROLES[(m.role || '').toUpperCase()] ? `${ROLES[(m.role || '').toUpperCase()].color}15` : '#eff6ff'),
                          color: m.role === 'admin' ? '#ea580c' : (ROLES[(m.role || '').toUpperCase()] ? ROLES[(m.role || '').toUpperCase()].color : '#3b82f6'),
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s',
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="member">MEMBER</option>
                        <option value="admin">ADMIN</option>
                        {Object.keys(ROLES).map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                      <ChevronDown 
                        size={12} 
                        style={{ 
                          position: 'absolute', 
                          right: 10, 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: m.role === 'admin' ? '#dc2626' : (ROLES[(m.role || '').toUpperCase()] ? ROLES[(m.role || '').toUpperCase()].color : '#3b82f6'),
                          pointerEvents: 'none' 
                        }} 
                      />
                    </div>
                  )}
                </td>
                <td style={S.td}>
                  <input 
                    type="text" 
                    placeholder="e.g. U0B9C5Y2CG4"
                    value={m.slack_id || ''}
                    onChange={async (e) => {
                      const newSlackId = e.target.value;
                      setMembers(prev => prev.map(u => u.id === m.id ? { ...u, slack_id: newSlackId } : u));
                      try {
                        const { error } = await supabase
                          .from('flc_ops_users')
                          .update({ slack_id: newSlackId })
                          .eq('id', m.id);
                        if (error) throw error;
                      } catch (err) {
                        toast.error("Failed to update Slack ID: " + err.message);
                      }
                    }}
                    style={{
                      width: 140,
                      padding: '8px 12px',
                      background: '#f8fafc',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: 12,
                      fontSize: 12,
                      fontFamily: 'monospace',
                      outline: 'none',
                      color: '#0f172a'
                    }}
                  />
                </td>
                <td style={S.td}>
                  <span style={S.badge('#dcfce7', '#16a34a')}>ACTIVE</span>
                </td>
                <td style={S.td}>
                  {m.role === 'admin' || (m.assigned_clients || []).includes('all') ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={S.badge('#dcfce7', '#16a34a')}>ALL CLIENTS</span>
                      {m.role !== 'admin' && (
                        <button onClick={() => setEditingMember(m)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, cursor: 'pointer', fontWeight: 900 }}>[EDIT ACCESS]</button>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>{(m.assigned_clients || []).length} Clients</span>
                      <button onClick={() => setEditingMember(m)} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 11, cursor: 'pointer', fontWeight: 900 }}>[EDIT ACCESS]</button>
                    </div>
                  )}
                </td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {m.email !== currentUser?.email && (
                      <button onClick={() => removeMember(m.id, false)} style={S.iconBtn('#ef4444')} title="Remove Member"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {invites.map(i => (
              <tr key={i.email} style={{ opacity: 0.7, background: '#fcfcfc' }}>
                <td style={S.td}>
                  <div style={{ fontWeight: 600, color: '#64748b' }}>{i.email}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Pending Invitation</div>
                </td>
                <td style={S.td}><span style={S.badge('#f1f5f9', '#64748b')}>MEMBER</span></td>
                <td style={S.td}>
                  <span style={S.badge('#fef9c3', '#a16207')}>PENDING</span>
                </td>
                <td style={S.td}>
                  {(i.assigned_clients || []).length} Clients
                </td>
                <td style={S.td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => removeMember(null, true, i.email)} style={S.iconBtn('#ef4444')} title="Cancel Invite"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(members.length === 0 && invites.length === 0) && (
           <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
             <Users size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
             <p>No team members found. Start by inviting your first member!</p>
           </div>
        )}
      </div>

      {showInvite && <InviteModal clients={clients} onClose={() => { setShowInvite(false); fetchTeam(); }} />}

      {editingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 24, width: 440, padding: 32 }}>
            <h3 style={{ marginBottom: 8, fontWeight: 900 }}>Edit Access: {editingMember.name}</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Select clients this member can view/edit</p>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 24, border: '1px solid #eee', borderRadius: 12 }}>
              {/* All Clients Selection Checkbox */}
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2px solid #eee', background: '#f8fafc' }}>
                <input 
                  type="checkbox" 
                  checked={editingMember.assigned_clients?.includes('all')} 
                  onChange={(e) => {
                     if (e.target.checked) {
                       setEditingMember({ ...editingMember, assigned_clients: ['all'] });
                     } else {
                       setEditingMember({ ...editingMember, assigned_clients: [] });
                     }
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#ea580c' }}>All Clients Access (Auto-assign new clients)</span>
              </div>

               {clients.filter(c => c.package !== 'lead').map(c => {
                const isAllSelected = editingMember.assigned_clients?.includes('all');
                return (
                  <div key={c.id} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #fff5ed', opacity: isAllSelected ? 0.5 : 1 }}>
                    <input 
                      type="checkbox" 
                      disabled={isAllSelected}
                      checked={isAllSelected || editingMember.assigned_clients?.includes(c.id)} 
                      onChange={(e) => {
                         const current = editingMember.assigned_clients || [];
                         const next = e.target.checked ? [...current, c.id] : current.filter(id => id !== c.id);
                         setEditingMember({ ...editingMember, assigned_clients: next });
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setEditingMember(null)} style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={() => updateAccess(editingMember, editingMember.assigned_clients)} style={{ ...S.btn(true), flex: 1, justifyContent: 'center' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {securityPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fffbf7', borderRadius: 24, width: 440, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border: '1px solid rgba(234,88,12,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: '#ffedd5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                <Shield size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Elevate to Admin Role</h3>
            </div>
            
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 24 }}>
              Assigning the <strong>ADMIN</strong> role to <strong>{securityPrompt.member.name}</strong> will grant them complete administrative access. 
              Please enter the signup security code to verify this action.
            </p>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#ea580c', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>Security Code</div>
              <input 
                type="password" 
                style={{ ...S.input, width: '100%', border: '1px solid rgba(220,38,38,0.2)', boxSizing: 'border-box' }} 
                value={securityCode} 
                onChange={(e) => setSecurityCode(e.target.value)} 
                placeholder="Enter sign up security code" 
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => {
                  setSecurityPrompt(null);
                  setSecurityCode('');
                }} 
                style={{ ...S.btn(false), flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                onClick={verifyAndSetAdmin} 
                style={{ ...S.btn(true), flex: 1, justifyContent: 'center' }}
              >
                Verify & Grant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditPageView({ member, onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchMemberLogs(member.email);
      setLogs(data || []);
    } catch (e) {
      toast.error("Failed to fetch logs");
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.task_name.toLowerCase().includes(search.toLowerCase()) || 
      log.client_name.toLowerCase().includes(search.toLowerCase());
    
    const logDate = new Date(log.completed_at).toISOString().split('T')[0];
    const matchesFrom = !fromDate || logDate >= fromDate;
    const matchesTo = !toDate || logDate <= toDate;
    const matchesClient = selectedClient === 'ALL' || log.client_name === selectedClient;

    return matchesSearch && matchesFrom && matchesTo && matchesClient;
  });

  const uniqueClients = [...new Set(logs.map(l => l.client_name))].sort();

  return (
    <div style={S.container}>
      <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button 
            onClick={onBack}
            style={{ 
              background: 'none', border: 'none', padding: 0, color: '#64748b', fontWeight: 700, 
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12, fontSize: 13
            }}
          >
            <ArrowLeft size={16} /> Back to Team
          </button>
          <h1 style={S.title}>{member.name}'s performance Audit</h1>
          <p style={{ color: '#64748b', marginTop: 4, fontWeight: 500 }}>Comprehensive activity trail for {member.email}</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#ea580c' }}>{logs.length}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Lifetime Tasks</div>
           </div>
           <div style={{ width: 1, height: 40, background: '#e2e8f0', margin: '0 8px' }} />
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{filteredLogs.length}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>In Range</div>
           </div>
        </div>
      </header>

      {/* Persistence Bar */}
      <div style={{ ...S.card, padding: '24px 32px', marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', background: '#fffbf7' }}>
        <div style={{ position: 'relative', flex: 1.5 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            placeholder="Search tasks..."
            style={{ ...S.input, width: '100%', paddingLeft: 48 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <Filter size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <select 
            style={{ ...S.input, width: '100%', paddingLeft: 40, appearance: 'none', cursor: 'pointer' }}
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
          >
            <option value="ALL">All Clients</option>
            {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1.5 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Calendar size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="date"
              style={{ ...S.input, width: '100%', paddingLeft: 36, fontSize: 12 }}
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <span style={{ color: '#94a3b8', fontWeight: 800 }}>TO</span>
          <div style={{ position: 'relative', flex: 1 }}>
            <Calendar size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="date"
              style={{ ...S.input, width: '100%', paddingLeft: 36, fontSize: 12 }}
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          onClick={() => { setFromDate(''); setToDate(''); setSearch(''); setSelectedClient('ALL'); }}
          style={{ ...S.btn(false), padding: '12px 16px' }}
        >
          Reset Filters
        </button>
      </div>

      <div style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Operation / Task</th>
              <th style={S.th}>Client</th>
              <th style={S.th}>Completion Time</th>
              <th style={S.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="4" style={{ ...S.td, textAlign: 'center', padding: 80, color: '#94a3b8' }}>Loading secure audit trail...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan="4" style={{ ...S.td, textAlign: 'center', padding: 80, color: '#94a3b8' }}>No logs found matching your criteria.</td></tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={S.td}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>{log.task_name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>ID: {log.task_id}</div>
                  </td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{log.client_name}</div>
                  </td>
                  <td style={S.td}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>
                      {new Date(log.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>
                      {new Date(log.completed_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td style={S.td}>
                    {log.action_type === 'REVERTED' ? (
                       <span style={{ ...S.badge('#fff7ed', '#ea580c'), border: '1px solid #fed7aa' }}>REVERTED</span>
                    ) : (
                       <span style={S.badge('#dcfce7', '#16a34a')}>VERIFIED</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
