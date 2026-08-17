export function processReportData(clients, fromDate, toDate, DEFAULT_TASKS) {
  const from = fromDate ? new Date(fromDate + 'T00:00:00Z') : null;
  const to = toDate ? new Date(toDate + 'T23:59:59.999Z') : null;

  const reportClients = clients.map(client => {
    const cTasks = client.tasks?.__defs || DEFAULT_TASKS;
    const startDate = client.startDate ? new Date(client.startDate + 'T00:00:00Z') : null;

    // Filter clients: if date range is set, skip clients that started after the range ends
    if (from && to && startDate && startDate > to) return null;

    const completedTasks = cTasks.filter(t => client.tasks?.[t.id]?.done);
    const pendingTasks   = cTasks.filter(t => !client.tasks?.[t.id]?.done);
    const progress = cTasks.length > 0
      ? Math.round((completedTasks.length / cTasks.length) * 100)
      : 0;

    const sprintDone  = completedTasks.filter(t => t.phase === 'sprint');
    const ongoingDone = completedTasks.filter(t => t.phase === 'ongoing');

    const tasksWithNotes = cTasks
      .map(t => ({ ...t, noteText: client.tasks?.[t.id]?.notes?.trim() }))
      .filter(t => t.noteText);

    return {
      name: client.name,
      package: client.package,
      startDate: client.startDate || 'N/A',
      progress,
      totalTasks: cTasks.length,
      completedCount: completedTasks.length,
      pendingCount: pendingTasks.length,
      sprintDone,
      ongoingDone,
      completedTasks,
      pendingTasks,
      tasksWithNotes,
    };
  }).filter(Boolean);

  const totalClients   = reportClients.length;
  const avgProgress    = totalClients > 0
    ? Math.round(reportClients.reduce((s, c) => s + c.progress, 0) / totalClients)
    : 0;
  const totalCompleted = reportClients.reduce((s, c) => s + c.completedCount, 0);
  const totalPending   = reportClients.reduce((s, c) => s + c.pendingCount, 0);

  return { reportClients, totalClients, avgProgress, totalCompleted, totalPending };
}
