import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2, AlertCircle, Loader2, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
    backdropFilter: 'blur(8px)', zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
  },
  box: {
    background: '#fffbf7', borderRadius: 32, width: 'min(500px, 100%)',
    border: '1px solid rgba(234,88,12,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
    overflow: 'hidden'
  },
  header: {
    padding: '32px 40px 24px', borderBottom: '1px solid rgba(234,88,12,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  body: { padding: '32px 40px', maxHeight: '60vh', overflowY: 'auto' },
  footer: {
    padding: '24px 40px', borderTop: '1px solid rgba(234,88,12,0.08)',
    display: 'flex', gap: 12
  },
  input: {
    width: '100%', padding: '12px 16px', background: '#fff5ed',
    border: '1px solid rgba(234,88,12,0.12)', borderRadius: 12,
    fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box'
  },
  label: { fontSize: 11, fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 },
  btn: (active, color = '#ea580c') => ({
    padding: '12px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: active ? color : '#fff5ed', color: active ? '#fff' : '#64748b',
    border: active ? 'none' : '1px solid rgba(234,88,12,0.08)', cursor: 'pointer',
    transition: 'all 0.2s', flex: 1
  })
};

export default function InviteModal({ clients, user, onClose }) {
  const [email, setEmail] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [errorMsg, setErrorMsg] = useState('');

  const toggleClient = (id) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(c => c !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setStatus('loading');
    setErrorMsg('');
    try {
      // 1. Send Request to Backend (Handles both DB update and Email gracefully)
      const res = await fetch('/api/auth/send-invite-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          selectedClients: selectedClients, 
          inviterName: user?.name 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invite.');

      setStatus('done');
      toast.success("Invitation Sent! An email has been sent to " + email);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error('[INVITE ERROR]', err);
      toast.error(err.message || 'Failed to send invite.');
      setStatus('idle');
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <motion.div
        style={S.box}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
      >
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: '#ffedd5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={22} color="#ea580c" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>Invite Team Member</h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 2 }}>Assign specific client access</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={S.body} className="invite-scroll">
          {status === 'done' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={32} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Invitation Sent!</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>An email has been sent to {email} with their secure access link.</p>
              <button onClick={onClose} style={{ ...S.btn(false), width: '100%' }}>Close Window</button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={S.label}>MEMBER EMAIL</div>
                <input
                  type="email"
                  style={S.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                />
              </div>

              <div>
                <div style={S.label}>ASSIGN CLIENT ACCESS ({selectedClients.length} Selected)</div>
                <div style={{ 
                  background: '#fff5ed', border: '1px solid rgba(234,88,12,0.12)', borderRadius: 12, 
                  maxHeight: 200, overflowY: 'auto', padding: 8 
                }}>
                  {clients.filter(c => c.package !== 'lead').map(c => {
                    const isSelected = selectedClients.includes(c.id);
                    return (
                      <div 
                        key={c.id}
                        onClick={() => toggleClient(c.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                          borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                          background: isSelected ? '#ffedd5' : 'transparent'
                        }}
                      >
                        {isSelected ? <CheckSquare size={18} color="#ea580c" /> : <Square size={18} color="#94a3b8" />}
                        <span style={{ fontSize: 14, fontWeight: isSelected ? 600 : 500, color: isSelected ? '#ea580c' : '#334155' }}>
                          {c.name}
                        </span>
                      </div>
                    );
                  })}
                  {clients.length === 0 && (
                    <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No clients available.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {status !== 'done' && (
          <div style={S.footer}>
            <button onClick={onClose} style={S.btn(false)}>Cancel</button>
            <button
              onClick={handleInvite}
              disabled={status === 'loading'}
              style={{ ...S.btn(true), flex: 2 }}
            >
              {status === 'loading'
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                : 'Send Invitation Email'
              }
            </button>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .invite-scroll::-webkit-scrollbar { width: 6px; }
          .invite-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        `}</style>
      </motion.div>
    </div>
  );
}
