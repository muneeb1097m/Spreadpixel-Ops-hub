import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles,
  SlidersHorizontal,
  X,
  Save,
  ExternalLink,
  Bot,
  TrendingUp,
  MessageSquare,
  Building2,
  Briefcase,
  User,
  Target,
  Trash2,
  Plus,
  Layers,
  UserCheck,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { upsertClient, deleteClient } from './supabase';

const COLUMNS = [
  { id: 'match_icp', label: 'Match ICP', color: '#faf5ff', textColor: '#7c3aed', borderColor: '#ddd6fe' },
  { id: 'connection_send', label: 'Connection Send', color: '#e0f2fe', textColor: '#0369a1', borderColor: '#bae6fd' },
  { id: 'accepted_connection', label: 'Accepted Connection', color: '#dcfce7', textColor: '#15803d', borderColor: '#bbf7d0' },
  { id: 'first_message_send', label: '1st Message Send', color: '#fef9c3', textColor: '#a16207', borderColor: '#fef08a' },
  { id: 'in_followup', label: 'In Followup Message', color: '#f3e8ff', textColor: '#6b21a8', borderColor: '#e9d5ff' },
  { id: 'booked_meeting', label: 'Booked Meeting', color: '#ffedd5', textColor: '#c2410c', borderColor: '#fed7aa' },
  { id: 'closed', label: 'Closed', color: '#ecfdf5', textColor: '#047857', borderColor: '#a7f3d0' },
  { id: 'unclosed', label: 'Unclosed', color: '#fff7ed', textColor: '#c2410c', borderColor: '#ffedd5' }
];

const INPUT_STYLE = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  fontSize: 13,
  outline: 'none',
  background: '#f8fafc',
  color: '#0f172a',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const FIELD_LABEL = {
  fontSize: 10,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 6,
  display: 'flex',
  alignItems: 'center',
  gap: 5,
};

export function extractOrGenerateLinkedinUrl(rawText = '', name = '', company = '') {
  if (rawText) {
    const match = rawText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/(?:in|sales\/lead|pub|profile)\/[a-zA-Z0-9_%-]+\/?)/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  const queryParts = [name, company].filter(Boolean).join(' ').trim();
  if (queryParts) {
    return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(queryParts)}`;
  }

  return '';
}

export default function BDHub({ clients = [], setClients, user, isAdmin, isBDOrAdmin, onEditLead, onOpenAiScorer, sel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [icpFilter, setIcpFilter] = useState('');
  const [filterScope, setFilterScope] = useState('all'); // 'all' | 'client'
  const [dragOverCol, setDragOverCol] = useState(null);

  // LinkedIn Profile state
  const linkedinProfiles = useMemo(() => {
    return sel?.tasks?.__linkedin_profiles || [];
  }, [sel?.tasks?.__linkedin_profiles]);

  const [activeProfileId, setActiveProfileId] = useState('');
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [addingProfile, setAddingProfile] = useState(false);

  // Sync active profile ID when client or profiles change
  React.useEffect(() => {
    if (linkedinProfiles.length > 0) {
      if (!activeProfileId || !linkedinProfiles.some(p => p.id === activeProfileId)) {
        setActiveProfileId(linkedinProfiles[0].id);
      }
    } else {
      setActiveProfileId('');
    }
  }, [linkedinProfiles, sel?.id]);


  // Lead detail modal state
  const [selectedLead, setSelectedLead] = useState(null); // null | client | { isNew: true }
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStage, setEditStage] = useState('match_icp');
  const [editCompany, setEditCompany] = useState('');
  const [editHeadline, setEditHeadline] = useState('');
  const [editScore, setEditScore] = useState('');
  const [editIcp, setEditIcp] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editExplanation, setEditExplanation] = useState('');
  const [editAssignedBD, setEditAssignedBD] = useState('');
  const [editParentClientId, setEditParentClientId] = useState('');
  const [editLinkedinProfileId, setEditLinkedinProfileId] = useState('');
  const [editLinkedinUrl, setEditLinkedinUrl] = useState('');

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAddLinkedinProfile = async () => {
    const name = newProfileName.trim();
    if (!name) {
      toast.error('Please enter a LinkedIn Account name');
      return;
    }
    if (!sel) return;

    setAddingProfile(true);
    const newId = 'lp_' + Date.now();
    const newProfile = { id: newId, name };
    const currentProfiles = sel.tasks?.__linkedin_profiles || [];
    const updatedProfiles = [...currentProfiles, newProfile];

    const updatedTasks = {
      ...(sel.tasks || {}),
      __linkedin_profiles: updatedProfiles,
      __meta_updated_at: new Date().toISOString()
    };

    const updatedClient = {
      ...sel,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    };

    try {
      await upsertClient(updatedClient);
      setClients(prev => prev.map(c => c.id === sel.id ? updatedClient : c));
      setActiveProfileId(newId);
      setNewProfileName('');
      setShowAddProfileModal(false);
      toast.success(`LinkedIn account "${name}" created!`);
    } catch (e) {
      toast.error('Failed to create LinkedIn account: ' + e.message);
    } finally {
      setAddingProfile(false);
    }
  };

  const openLead = (client) => {
    setSelectedLead(client);
    setEditName(client.name || '');
    setEditStage(client.tasks?.__bd_outreach_stage || 'match_icp');
    setEditCompany(client.tasks?.__bd_outreach_company || '');
    setEditHeadline(client.tasks?.__bd_outreach_headline || '');
    setEditScore(client.tasks?.__bd_outreach_score !== undefined && client.tasks?.__bd_outreach_score !== null ? String(client.tasks.__bd_outreach_score) : '');
    setEditIcp(client.tasks?.__bd_outreach_icp || '');
    setEditNotes(client.tasks?.__bd_outreach_notes || '');
    setEditExplanation(client.tasks?.__bd_outreach_ai_explanation || '');
    setEditAssignedBD(client.tasks?.__assigned_bd || '');
    setEditParentClientId(client.tasks?.__bd_outreach_parent_client_id || sel?.id || '');
    setEditLinkedinProfileId(client.tasks?.__bd_outreach_linkedin_profile_id || activeProfileId || '');
    const calculatedUrl = client.tasks?.__bd_outreach_linkedin_url || extractOrGenerateLinkedinUrl(client.tasks?.__bd_outreach_raw_profile || client.tasks?.__bd_outreach_notes, client.name, client.tasks?.__bd_outreach_company);
    setEditLinkedinUrl(calculatedUrl);
  };

  const openNewLead = () => {
    setSelectedLead({ isNew: true });
    setEditName('');
    setEditStage('match_icp');
    setEditCompany('');
    setEditHeadline('');
    setEditScore('');
    setEditIcp('');
    setEditNotes('');
    setEditExplanation('');
    setEditAssignedBD(user?.name || '');
    setEditParentClientId(sel?.id || '');
    setEditLinkedinProfileId(activeProfileId || '');
    setEditLinkedinUrl('');
  };

  const closeLead = () => {
    setSelectedLead(null);
    setConfirmingDelete(false);
  };

  const handleDeleteLead = async () => {
    if (!selectedLead || selectedLead.isNew) return;
    setDeleting(true);
    try {
      await deleteClient(selectedLead.id);
      setClients(prev => prev.filter(c => c.id !== selectedLead.id));
      toast.success(`Lead "${selectedLead.name}" deleted successfully.`);
      closeLead();
    } catch (e) {
      toast.error('Failed to delete lead: ' + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const saveLead = async () => {
    if (!selectedLead) return;
    const leadName = editName.trim();
    if (!leadName) {
      toast.error('Lead name is required');
      return;
    }

    setSaving(true);
    const nowStr = new Date().toISOString();
    const isNew = selectedLead.isNew;

    const existingTasks = isNew ? {} : (selectedLead.tasks || {});
    const updatedTasks = {
      ...existingTasks,
      __bd_outreach_stage: editStage,
      __bd_outreach_company: editCompany.trim(),
      __bd_outreach_headline: editHeadline.trim(),
      __bd_outreach_score: editScore !== '' ? Number(editScore) : null,
      __bd_outreach_icp: editIcp.trim(),
      __bd_outreach_notes: editNotes.trim(),
      __bd_outreach_ai_explanation: editExplanation.trim(),
      __assigned_bd: editAssignedBD.trim(),
      __bd_outreach_date: existingTasks.__bd_outreach_date || nowStr,
      __meta_updated_at: nowStr,
      __bd_outreach_parent_client_id: editParentClientId || sel?.id || null,
      __bd_outreach_linkedin_profile_id: editLinkedinProfileId || activeProfileId || null,
      __bd_outreach_linkedin_url: editLinkedinUrl.trim() || extractOrGenerateLinkedinUrl(editNotes, editName, editCompany),
    };

    const targetData = isNew ? {
      name: leadName,
      startDate: nowStr.split('T')[0],
      package: 'lead',
      tasks: updatedTasks,
      followups: [],
      updatedAt: nowStr
    } : {
      ...selectedLead,
      name: leadName,
      tasks: updatedTasks,
      updatedAt: nowStr
    };

    try {
      const saved = await upsertClient(targetData);
      const updatedClient = { ...targetData, id: saved.id };
      
      setClients(prev => {
        if (isNew) {
          return [...prev, updatedClient];
        }
        return prev.map(c => c.id === selectedLead.id ? updatedClient : c);
      });

      toast.success(isNew ? `Lead "${leadName}" created!` : `Lead "${leadName}" saved!`);
      closeLead();
    } catch (e) {
      toast.error('Failed to save lead: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Group clients by stage across workspace
  const groupedClients = useMemo(() => {
    const groups = COLUMNS.reduce((acc, col) => {
      acc[col.id] = [];
      return acc;
    }, {});

    clients.forEach(client => {
      let stage = client.tasks?.__bd_outreach_stage;
      const parentId = client.tasks?.__bd_outreach_parent_client_id;
      const profileId = client.tasks?.__bd_outreach_linkedin_profile_id;

      // Default stage to match_icp for leads missing a stage
      if (!stage || stage === 'not_started') {
        if (client.package === 'lead' || client.tasks?.__bd_outreach_icp || client.tasks?.__bd_outreach_notes || client.tasks?.__bd_outreach_headline || client.tasks?.__bd_outreach_company || (client.tasks?.__bd_outreach_score !== undefined && client.tasks?.__bd_outreach_score !== null)) {
          stage = 'match_icp';
        }
      }

      if (!stage || !groups[stage]) return;

      const matchesSearch = searchQuery === '' || 
        (client.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.tasks?.__bd_outreach_company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.tasks?.__bd_outreach_headline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.tasks?.__assigned_bd || '').toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesIcp = icpFilter === '' || 
        (client.tasks?.__bd_outreach_icp || '').toLowerCase().includes(icpFilter.toLowerCase());

      if (!matchesSearch || !matchesIcp) return;

      // Strictly isolate leads to current selected client if sel is present
      const matchesClient = !sel?.id || parentId === sel.id;

      // Filter by active LinkedIn profile if profiles exist
      let matchesProfile = true;
      if (sel?.id && linkedinProfiles.length > 0) {
        matchesProfile = profileId === activeProfileId || (!profileId && activeProfileId === linkedinProfiles[0]?.id);
      }

      if (matchesClient && matchesProfile) {
        groups[stage].push(client);
      }
    });

    return groups;
  }, [clients, searchQuery, icpFilter, sel?.id, linkedinProfiles, activeProfileId]);

  // Lookup map for client parent names
  const clientMap = useMemo(() => {
    const map = {};
    clients.forEach(c => { map[c.id] = c.name; });
    return map;
  }, [clients]);

  const getScoreColor = (score) => {
    if (score === undefined || score === null || score === '') return '#64748b';
    const num = Number(score);
    if (num >= 80) return '#10b981';
    if (num >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const totalLeadsCount = useMemo(() => {
    return Object.values(groupedClients).reduce((acc, list) => acc + list.length, 0);
  }, [groupedClients]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
      
      {/* Top Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search leads, company, BD..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>

          {/* ICP Filter Input */}
          <div style={{ position: 'relative', width: 240 }}>
            <SlidersHorizontal size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Filter by ICP (e.g. Founder)..."
              value={icpFilter}
              onChange={e => setIcpFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>

          {/* Active Client Badge */}
          {sel && (
            <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', background: '#f5f3ff', padding: '6px 14px', borderRadius: 20, border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} /> {sel.name} BD Hub
            </div>
          )}

          {/* Total Badge */}
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: '#f8fafc', padding: '6px 12px', borderRadius: 20, border: '1px solid #e2e8f0' }}>
            Total: <span style={{ color: '#7c3aed', fontWeight: 900 }}>{totalLeadsCount}</span> leads
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isBDOrAdmin && (
            <>
              <button
                onClick={openNewLead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#0f172a',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.2)',
                  transition: 'all 0.15s'
                }}
              >
                <Plus size={16} />
                <span>Add Lead</span>
              </button>


              <button
                onClick={() => onOpenAiScorer?.(sel || null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 18px',
                  borderRadius: 12,
                  border: '1.5px solid #7c3aed',
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(124,58,237,0.1)'
                }}
              >
                <Sparkles size={16} />
                <span>ICP Scorer {sel ? `(${sel.name})` : ''}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* LinkedIn Accounts Selector Bar */}
      {sel && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 16px', borderRadius: 14, border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={15} color="#7c3aed" /> LinkedIn Accounts:
            </span>
            {linkedinProfiles.length === 0 ? (
              <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No LinkedIn accounts created yet.</span>
            ) : (
              linkedinProfiles.map(prof => {
                const isActive = prof.id === activeProfileId;
                const count = clients.filter(c => c.package === 'lead' && c.tasks?.__bd_outreach_parent_client_id === sel.id && (c.tasks?.__bd_outreach_linkedin_profile_id === prof.id || (!c.tasks?.__bd_outreach_linkedin_profile_id && prof.id === linkedinProfiles[0]?.id))).length;

                return (
                  <button
                    key={prof.id}
                    onClick={() => setActiveProfileId(prof.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: isActive ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                      background: isActive ? '#f5f3ff' : '#fff',
                      color: isActive ? '#7c3aed' : '#475569',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: isActive ? '0 2px 4px rgba(124,58,237,0.15)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span>{prof.name}</span>
                    <span style={{ background: isActive ? '#7c3aed' : '#e2e8f0', color: isActive ? '#fff' : '#64748b', fontSize: 10, fontWeight: 900, padding: '1px 6px', borderRadius: 10 }}>
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {isBDOrAdmin && (
            <button
              onClick={() => { setNewProfileName(''); setShowAddProfileModal(true); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid #7c3aed',
                background: '#fff',
                color: '#7c3aed',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Plus size={14} />
              <span>Create LinkedIn Account</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State Banner if no LinkedIn account created yet */}
      {sel && linkedinProfiles.length === 0 && (
        <div style={{ background: '#f5f3ff', border: '1.5px dashed #c4b5fd', borderRadius: 16, padding: '24px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
            <User size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 800, color: '#4c1d95' }}>No LinkedIn Account Created for {sel.name}</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#6d28d9' }}>Create your first LinkedIn account profile to start adding and organizing leads for {sel.name}.</p>
          </div>
          {isBDOrAdmin && (
            <button
              onClick={() => { setNewProfileName(''); setShowAddProfileModal(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)', marginTop: 4 }}
            >
              <Plus size={16} />
              <span>Create LinkedIn Account</span>
            </button>
          )}
        </div>
      )}

      {/* Kanban Board Container */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        overflowX: 'auto', 
        paddingBottom: 16, 
        flex: 1, 
        alignItems: 'stretch',
        minHeight: 500
      }}>
        {COLUMNS.map(col => {
          const colClients = groupedClients[col.id] || [];
          return (
            <div 
              key={col.id} 
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col.id);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={async (e) => {
                e.preventDefault();
                setDragOverCol(null);
                const clientId = e.dataTransfer.getData('text/plain');
                const draggedClient = clients.find(c => c.id === clientId);
                if (draggedClient && draggedClient.tasks?.__bd_outreach_stage !== col.id) {
                  const nowStr = new Date().toISOString();
                  const updatedTasks = {
                    ...(draggedClient.tasks || {}),
                    __bd_outreach_stage: col.id,
                    __bd_outreach_date: nowStr,
                    __meta_updated_at: nowStr
                  };
                  const updatedClient = {
                    ...draggedClient,
                    tasks: updatedTasks,
                    updatedAt: nowStr
                  };

                  setClients(prev => prev.map(c => c.id === draggedClient.id ? updatedClient : c));
                  try {
                    await upsertClient(updatedClient);
                    toast.success(`Moved ${draggedClient.name} → ${col.label}`);
                  } catch (err) {
                    toast.error('Failed to move: ' + err.message);
                    setClients(prev => prev.map(c => c.id === draggedClient.id ? draggedClient : c));
                  }
                }
              }}
              style={{
                width: 300,
                minWidth: 280,
                background: dragOverCol === col.id ? col.color : '#ffffff',
                borderRadius: 16,
                border: dragOverCol === col.id ? `2px dashed ${col.borderColor}` : '1px solid #eef1f5',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 210px)',
                transition: 'background 0.15s, border 0.15s',
                overflow: 'hidden'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '11px 14px',
                borderBottom: '1px solid #f1f5f9',
                borderLeft: `4px solid ${col.textColor}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#ffffff'
              }}>
                <span style={{ fontWeight: 800, fontSize: 12, color: col.textColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{col.label}</span>
                <span style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: col.color,
                  color: col.textColor,
                  border: `1px solid ${col.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 900
                }}>
                  {colClients.length}
                </span>
              </div>

              {/* Column Cards List */}
              <div style={{ 
                padding: 12, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 10, 
                overflowY: 'auto',
                flex: 1
              }}>
                {colClients.length === 0 ? (
                  <div style={{ 
                    padding: 24, 
                    textAlign: 'center', 
                    color: '#94a3b8', 
                    fontSize: 12,
                    border: '2px dashed #e2e8f0',
                    borderRadius: 10,
                    marginTop: 4
                  }}>
                    No clients in this stage
                  </div>
                ) : (
                  colClients.map((client) => {
                    const score = client.tasks?.__bd_outreach_score;
                    const company = client.tasks?.__bd_outreach_company;
                    const headline = client.tasks?.__bd_outreach_headline;
                    const notes = client.tasks?.__bd_outreach_notes;
                    const assignedBd = client.tasks?.__assigned_bd;
                    const parentId = client.tasks?.__bd_outreach_parent_client_id;
                    const parentName = parentId ? clientMap[parentId] : null;
                    const scoreColor = getScoreColor(score);

                    const initials = (client.name || '?').trim().slice(0, 2).toUpperCase();

                    return (
                      <div
                        key={client.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', client.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        style={{
                          background: '#fff',
                          borderRadius: 14,
                          border: '1px solid #eef1f5',
                          borderTop: `3px solid ${col.textColor}`,
                          padding: 13,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          cursor: 'grab',
                          transition: 'all 0.15s'
                        }}
                        onClick={() => openLead(client)}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = col.borderColor; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#eef1f5'; }}
                      >
                        {/* Avatar + Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: col.color, color: col.textColor, border: `1px solid ${col.borderColor}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900
                          }}>
                            {initials}
                          </div>
                          <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', lineHeight: 1.3, flex: 1 }}>{client.name}</span>
                        </div>

                        {/* Company & Headline Chips */}
                        {(headline || company) && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {headline && <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', background: '#f8fafc', border: '1px solid #eef1f5', padding: '3px 8px', borderRadius: 20 }}>💼 {headline}</span>}
                            {company && <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', background: '#f8fafc', border: '1px solid #eef1f5', padding: '3px 8px', borderRadius: 20 }}>🏢 {company}</span>}
                          </div>
                        )}

                        {/* Assigned BD Badge */}
                        {assignedBd && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '2px 7px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <UserCheck size={10} /> BD: {assignedBd}
                            </span>
                          </div>
                        )}

                        {/* Notes snippet */}
                        {notes && (
                          <div style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '5px 8px', borderRadius: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            💬 {notes}
                          </div>
                        )}

                        {/* LinkedIn Profile Direct Link */}
                        {(() => {
                          const cardUrl = client.tasks?.__bd_outreach_linkedin_url || extractOrGenerateLinkedinUrl(client.tasks?.__bd_outreach_raw_profile || client.tasks?.__bd_outreach_notes, client.name, company);
                          if (!cardUrl) return null;
                          return (
                            <a
                              href={cardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: '#0284c7',
                                background: '#e0f2fe',
                                border: '1px solid #bae6fd',
                                padding: '3px 8px',
                                borderRadius: 6,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                width: 'fit-content'
                              }}
                            >
                              <ExternalLink size={10} /> LinkedIn Profile ↗
                            </a>
                          );
                        })()}

                        {/* Card Footer */}
                        <div 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginTop: 2,
                            borderTop: '1px solid #f1f5f9',
                            paddingTop: 6
                          }}
                        >
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>
                            {client.tasks?.__bd_outreach_date
                              ? new Date(client.tasks.__bd_outreach_date).toLocaleDateString()
                              : 'No date'}
                          </span>
                          {(score !== undefined && score !== null && score !== '') ? (
                            <span style={{ fontSize: 10, fontWeight: 900, color: scoreColor, background: scoreColor + '18', padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>
                              {Math.round(Number(score) / 10)}/10
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>Edit →</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Lead Edit / Create Modal ─── */}
      {selectedLead && (() => {
        const colMeta = COLUMNS.find(c => c.id === editStage);
        const isNew = selectedLead.isNew;
        return (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={closeLead}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 20, width: 'min(680px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                    BD Hub — {isNew ? 'New Lead Creation' : 'Lead Details'}
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {isNew ? (editName || 'Untitled Lead') : selectedLead.name}
                  </h2>
                  {colMeta && (
                    <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 800, color: colMeta.textColor, background: colMeta.color, border: `1px solid ${colMeta.borderColor}`, padding: '3px 12px', borderRadius: 20 }}>
                      {colMeta.label}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {!isNew && (
                    <>
                      <button
                        onClick={() => { closeLead(); onOpenAiScorer(selectedLead); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #7c3aed', background: '#f5f3ff', color: '#7c3aed', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                      >
                        <Sparkles size={13} /> AI Scorer
                      </button>
                      <button
                        onClick={() => { closeLead(); onEditLead(selectedLead); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                      >
                        <ExternalLink size={12} /> Full Edit
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => setConfirmingDelete(true)} 
                          style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #fed7aa', background: '#fff7ed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}
                          title="Delete Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </>
                  )}
                  <button onClick={closeLead} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Target LinkedIn Profile Section */}
                <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ ...FIELD_LABEL, color: '#7c3aed', margin: 0 }}>
                      <User size={14} color="#7c3aed" /> Target LinkedIn Account *
                    </div>
                    {isBDOrAdmin && (
                      <button
                        type="button"
                        onClick={() => { setNewProfileName(''); setShowAddProfileModal(true); }}
                        style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
                      >
                        <Plus size={12} /> + Create New Account
                      </button>
                    )}
                  </div>
                  {linkedinProfiles.length > 0 ? (
                    <select
                      value={editLinkedinProfileId}
                      onChange={e => setEditLinkedinProfileId(e.target.value)}
                      style={{ ...INPUT_STYLE, background: '#fff', borderColor: '#c4b5fd', fontWeight: 700, color: '#6d28d9', cursor: 'pointer' }}
                    >
                      {linkedinProfiles.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (LinkedIn Account)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#7c3aed', fontStyle: 'italic' }}>
                        No LinkedIn account created for {sel?.name || 'this client'} yet.
                      </span>
                      <button
                        type="button"
                        onClick={() => { setNewProfileName(''); setShowAddProfileModal(true); }}
                        style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                      >
                        Create Account Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Name + Stage */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ ...FIELD_LABEL, color: '#475569' }}><User size={12} color="#94a3b8" /> Lead Name *</div>
                    <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Lead name..." style={INPUT_STYLE} />
                  </div>
                  <div>
                    <div style={{ ...FIELD_LABEL, color: '#475569' }}><TrendingUp size={12} color="#94a3b8" /> Pipeline Stage</div>
                    <select value={editStage} onChange={e => setEditStage(e.target.value)} style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
                      {COLUMNS.map(col => <option key={col.id} value={col.id}>{col.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Company + Headline */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ ...FIELD_LABEL, color: '#475569' }}><Building2 size={12} color="#94a3b8" /> Company</div>
                    <input value={editCompany} onChange={e => setEditCompany(e.target.value)} placeholder="e.g. Acme Corp" style={INPUT_STYLE} />
                  </div>
                  <div>
                    <div style={{ ...FIELD_LABEL, color: '#475569' }}><Briefcase size={12} color="#94a3b8" /> Job Title / Headline</div>
                    <input value={editHeadline} onChange={e => setEditHeadline(e.target.value)} placeholder="e.g. CEO at TechCo" style={INPUT_STYLE} />
                  </div>
                </div>

                {/* LinkedIn Profile Link */}
                <div>
                  <div style={{ ...FIELD_LABEL, color: '#0284c7' }}>
                    <ExternalLink size={12} color="#0284c7" /> Person's LinkedIn Profile Link
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      value={editLinkedinUrl}
                      onChange={e => setEditLinkedinUrl(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/... or auto-generated search link"
                      style={{ ...INPUT_STYLE, flex: 1 }}
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

                {/* Assigned BD + Parent Client */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ ...FIELD_LABEL, color: '#3b82f6' }}><UserCheck size={12} color="#3b82f6" /> Assigned BD Team Member</div>
                    <input value={editAssignedBD} onChange={e => setEditAssignedBD(e.target.value)} placeholder="e.g. Abdullah" style={INPUT_STYLE} />
                  </div>
                  <div>
                    <div style={{ ...FIELD_LABEL, color: '#7c3aed' }}><Layers size={12} color="#7c3aed" /> Associated Client Pipeline</div>
                    <select value={editParentClientId} onChange={e => setEditParentClientId(e.target.value)} style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
                      <option value="">General BD Lead (None)</option>
                      {clients.filter(c => c.package !== 'lead').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ICP Score */}
                <div>
                  <div style={{ ...FIELD_LABEL, color: '#7c3aed' }}><Bot size={12} color="#7c3aed" /> ICP Match Score (0–100)</div>
                  <div style={{ display: 'flex', items: 'center', gap: 12 }}>
                    <input type="number" min={0} max={100} value={editScore} onChange={e => setEditScore(e.target.value)} placeholder="e.g. 85" style={{ ...INPUT_STYLE, width: 110 }} />
                    {editScore !== '' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                        <div style={{ flex: 1, height: 8, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, Number(editScore))}%`, height: '100%', borderRadius: 99, background: getScoreColor(Number(editScore)), transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: 16, color: getScoreColor(Number(editScore)), minWidth: 40 }}>
                          {Math.round(Number(editScore) / 10)}/10
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Target ICP */}
                <div>
                  <div style={{ ...FIELD_LABEL, color: '#7c3aed' }}><Target size={12} color="#7c3aed" /> Target ICP Description</div>
                  <textarea value={editIcp} onChange={e => setEditIcp(e.target.value)} rows={3} placeholder="e.g. Founders or CEOs of B2B SaaS companies..." style={{ ...INPUT_STYLE, resize: 'none', height: 80, lineHeight: 1.6 }} />
                </div>

                {/* Outreach Notes */}
                <div>
                  <div style={{ ...FIELD_LABEL, color: '#475569' }}><MessageSquare size={12} color="#94a3b8" /> Outreach Notes</div>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={4} placeholder="Jot down what happened — connection accepted, message sent, follow-up pending..." style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 96, lineHeight: 1.6 }} />
                </div>

                {/* AI Explanation */}
                {editExplanation && (
                  <div style={{ background: '#faf5ff', border: '1.5px solid #ddd6fe', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ ...FIELD_LABEL, color: '#7c3aed', marginBottom: 8 }}><Sparkles size={12} color="#7c3aed" /> AI Analysis Summary</div>
                    <p style={{ fontSize: 12, color: '#4c1d95', margin: 0, lineHeight: 1.7 }}>{editExplanation}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 12, borderTop: '1px solid #f1f5f9' }}>
                <button onClick={closeLead} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                <button
                  onClick={saveLead}
                  disabled={saving}
                  style={{ flex: 3, padding: '11px 0', borderRadius: 12, border: 'none', background: saving ? '#94a3b8' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: saving ? 'none' : '0 4px 14px rgba(124,58,237,0.35)', transition: 'all 0.2s' }}
                >
                  <Save size={15} />
                  {saving ? 'Saving...' : (isNew ? 'Create Lead' : 'Save Lead Changes')}
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal Overlay */}
            {confirmingDelete && (
              <div 
                style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.7)', borderRadius: 20, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(3px)' }}
                onClick={(e) => { e.stopPropagation(); setConfirmingDelete(false); }}
              >
                <div 
                  onClick={e => e.stopPropagation()}
                  style={{ background: '#fff', borderRadius: 16, width: 'min(400px, 100%)', padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', textAlign: 'center' }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 28, background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', margin: '0 auto 16px' }}>
                    <Trash2 size={24} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Delete Lead?</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                    Are you sure you want to delete <b>{selectedLead.name}</b>? This action is permanent and cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={() => setConfirmingDelete(false)} 
                      disabled={deleting}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteLead}
                      disabled={deleting}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 13, cursor: deleting ? 'not-allowed' : 'pointer' }}
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── Add LinkedIn Account Modal ─── */}
      {showAddProfileModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowAddProfileModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, width: 'min(440px, 100%)', padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                  {sel?.name}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>Create LinkedIn Account</h3>
              </div>
              <button onClick={() => setShowAddProfileModal(false)} style={{ width: 32, height: 32, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', marginBottom: 6 }}>LinkedIn Account Name *</div>
              <input
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                placeholder="e.g. Bilal Ahmad LinkedIn, Haseeb Sales..."
                style={INPUT_STYLE}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleAddLinkedinProfile(); }}
              />
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 1.4 }}>
                Leads created under this LinkedIn account will be stored and isolated separately from other accounts for {sel?.name}.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setShowAddProfileModal(false)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={handleAddLinkedinProfile}
                disabled={addingProfile}
                style={{ flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', background: addingProfile ? '#94a3b8' : '#7c3aed', color: '#fff', fontWeight: 800, fontSize: 13, cursor: addingProfile ? 'not-allowed' : 'pointer' }}
              >
                {addingProfile ? 'Creating...' : 'Create LinkedIn Account'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
