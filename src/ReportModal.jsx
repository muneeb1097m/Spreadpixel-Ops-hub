import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileDown, Calendar, Clock, BarChart3, Loader2, CheckCircle2, Search, ChevronDown } from 'lucide-react';
import { generateReport } from './reportGenerator';
import { DEFAULT_TASKS } from './constants';
import { toast } from 'sonner';

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
    backdropFilter: 'blur(8px)', zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
  },
  box: {
    background: '#fffbf7', borderRadius: 32, width: 'min(560px, 100%)',
    border: '1px solid rgba(234,88,12,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
    overflow: 'hidden'
  },
  header: {
    padding: '32px 40px 24px', borderBottom: '1px solid rgba(234,88,12,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  body: { padding: '32px 40px', maxHeight: '70vh', overflowY: 'auto' },
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
  }),
  quickBtn: (active) => ({
    padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
    background: active ? '#ffedd5' : '#fff5ed', color: active ? '#ea580c' : '#64748b',
    border: `1px solid ${active ? '#fed7aa' : 'rgba(234,88,12,0.12)'}`,
    cursor: 'pointer', transition: 'all 0.15s'
  }),
  dropdown: {
    position: 'relative', width: '100%', marginBottom: 24
  },
  dropdownMenu: {
    position: 'absolute', top: '100%', left: 0, right: 0, 
    background: '#fffbf7', border: '1px solid rgba(234,88,12,0.12)', 
    borderRadius: 16, marginTop: 8, zIndex: 10, 
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
    maxHeight: 240, overflowY: 'auto', padding: 8
  },
  dropdownItem: (active) => ({
    padding: '10px 16px', borderRadius: 10, cursor: 'pointer', 
    background: active ? '#ffedd5' : 'transparent', 
    color: active ? '#ea580c' : '#0f172a', 
    fontSize: 14, fontWeight: active ? 700 : 500, 
    display: 'flex', alignItems: 'center', gap: 10, 
    transition: 'all 0.2s'
  })
};

const QUICK_RANGES = [
  { label: 'Today',       key: 'today' },
  { label: 'This Week',   key: 'week' },
  { label: 'This Month',  key: 'month' },
  { label: 'All Time',    key: 'all' },
];

const tzFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Karachi',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function getQuickRange(key) {
  const todayStr = tzFormatter.format(new Date());
  const today = new Date(todayStr + 'T00:00:00Z');
  const fmt = d => d.toISOString().split('T')[0];
  
  if (key === 'today') return { from: fmt(today), to: fmt(today) };
  if (key === 'week') {
    const mon = new Date(today); 
    mon.setUTCDate(today.getUTCDate() - today.getUTCDay() + 1);
    return { from: fmt(mon), to: fmt(today) };
  }
  if (key === 'month') {
    const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    return { from: fmt(first), to: fmt(today) };
  }
  return { from: '', to: '' }; // all time
}

export default function ReportModal({ clients, initialClient, onClose }) {
  const today = tzFormatter.format(new Date());
  const [fromDate, setFromDate]     = useState('');
  const [toDate, setToDate]         = useState(today);
  const [reportTitle, setReportTitle] = useState('Operations Report');
  const [quickRange, setQuickRange] = useState('all');
  const [status, setStatus]         = useState('idle'); // idle | loading | done | error
  const [errorMsg, setErrorMsg]     = useState('');
  const [summary, setSummary]       = useState(null);
  
  const [selectedClient, setSelectedClient] = useState(initialClient || clients[0] || null);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [search, setSearch]                 = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const applyQuick = (key) => {
    setQuickRange(key);
    const r = getQuickRange(key);
    setFromDate(r.from);
    setToDate(r.to);
  };

  const handleGenerate = async () => {
    if (!selectedClient) {
      toast.error("Please select a client first.");
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await generateReport({
        clients: [selectedClient],
        fromDate: fromDate || null,
        toDate:   toDate   || null,
        reportTitle: `${reportTitle} - ${selectedClient.name}`,
        DEFAULT_TASKS,
        isSingleClient: true
      });
      setSummary(result);
      setStatus('done');
      toast.success("Report generated successfully");
    } catch (err) {
      console.error('[REPORT ERROR]', err);
      toast.error(err.message || 'Failed to generate report.');
      setStatus('idle');
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <motion.div
        style={S.box}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: '#ffedd5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileDown size={22} color="#ea580c" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>Download Report</h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 2 }}>{selectedClient ? `For ${selectedClient.name}` : 'Select a client to begin'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={S.body} className="modal-body-scroll">
          {status === 'done' && summary ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={32} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Report Downloaded!</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Your .docx file has been saved to your downloads folder.</p>
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Progress', `${summary.reportClients[0]?.progress || 0}%`],
                  ['Tasks Completed', summary.reportClients[0]?.completedCount || 0],
                  ['Tasks Pending', summary.reportClients[0]?.pendingCount || 0],
                  ['Notes Included', summary.reportClients[0]?.tasksWithNotes?.length || 0],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{value}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setStatus('idle'); setSummary(null); }}
                style={{ ...S.btn(false), marginTop: 20, flex: 'none', width: '100%' }}
              >
                Generate Another Report
              </button>
            </div>
          ) : (
            /* Config Form */
            <>
              {/* Client Selection */}
              <div style={S.dropdown}>
                <div style={S.label}>Select Client</div>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ ...S.input, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <span style={{ color: selectedClient ? '#0f172a' : '#94a3b8' }}>{selectedClient ? selectedClient.name : 'Choose a client...'}</span>
                  <ChevronDown size={18} color="#94a3b8" />
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      style={S.dropdownMenu}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div style={{ position: 'relative', marginBottom: 8, padding: '0 4px' }}>
                        <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                          autoFocus
                          placeholder="Search clients..."
                          style={{ ...S.input, paddingLeft: 34, paddingRight: 12, height: 40, fontSize: 13 }}
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                        />
                      </div>
                      <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                        {filteredClients.length > 0 ? (
                          filteredClients.map(c => (
                            <div 
                              key={c.id} 
                              style={S.dropdownItem(selectedClient?.id === c.id)}
                              onClick={() => { setSelectedClient(c); setShowDropdown(false); setSearch(''); }}
                            >
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedClient?.id === c.id ? '#ea580c' : '#e2e8f0' }} />
                              {c.name}
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No clients found</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Report Title */}
              <div style={{ marginBottom: 24 }}>
                <div style={S.label}>Report Title</div>
                <input
                  style={S.input}
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  placeholder="e.g. Weekly Operations Report"
                />
              </div>

              {/* Quick Range */}
              <div style={{ marginBottom: 20 }}>
                <div style={S.label}>Quick Select</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {QUICK_RANGES.map(r => (
                    <button key={r.key} style={S.quickBtn(quickRange === r.key)} onClick={() => applyQuick(r.key)}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date Range */}
              <div style={{ marginBottom: 24 }}>
                <div style={S.label}>Custom Date Range</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>FROM</div>
                    <input
                      type="date"
                      style={S.input}
                      value={fromDate}
                      onChange={e => { setFromDate(e.target.value); setQuickRange(''); }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>TO</div>
                    <input
                      type="date"
                      style={S.input}
                      value={toDate}
                      onChange={e => { setToDate(e.target.value); setQuickRange(''); }}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <BarChart3 size={16} color="#ea580c" style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: '#9a3412', lineHeight: 1.6 }}>
                  <strong>Dynamic Report:</strong> Select a client to generate a branded .docx report with real-time task status, progress bars, and team logs.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {status !== 'done' && (
          <div style={S.footer}>
            <button onClick={onClose} style={S.btn(false)}>Cancel</button>
            <button
              onClick={handleGenerate}
              disabled={status === 'loading'}
              style={{ ...S.btn(true), flex: 2 }}
            >
              {status === 'loading'
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                : <><FileDown size={16} /> Download .docx Report</>
              }
            </button>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .modal-body-scroll::-webkit-scrollbar { width: 6px; }
          .modal-body-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        `}</style>
      </motion.div>
    </div>
  );
}

