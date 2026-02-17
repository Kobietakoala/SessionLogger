export default function StudentStats({ sessions, students }) {
  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📈</div>
        <p>Brak danych. Dodaj sesje, aby zobaczyć statystyki.</p>
      </div>
    );
  }

  // Policz statystyki per ucznia
  const stats = students.map(student => {
    const studentSessions = sessions.filter(s => s.studentId === student.id.toString());
    
    if (studentSessions.length === 0) {
      return { ...student, count: 0 };
    }

    const avgUnderstanding = (
      studentSessions.reduce((sum, s) => sum + s.understanding, 0) / studentSessions.length
    ).toFixed(1);

    const avgEngagement = (
      studentSessions.reduce((sum, s) => sum + s.engagement, 0) / studentSessions.length
    ).toFixed(1);

    const avgConcentration = (
      studentSessions.reduce((sum, s) => sum + s.concentration, 0) / studentSessions.length
    ).toFixed(1);

    const avgPractical = (
      studentSessions.reduce((sum, s) => sum + s.practical, 0) / studentSessions.length
    ).toFixed(1);

    const overall = (
      (parseFloat(avgUnderstanding) + parseFloat(avgEngagement) + parseFloat(avgConcentration) + parseFloat(avgPractical)) / 4
    ).toFixed(1);

    return {
      ...student,
      count: studentSessions.length,
      avgUnderstanding,
      avgEngagement,
      avgConcentration,
      avgPractical,
      overall
    };
  }).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  // Ogólne statystyki
  const totalSessions = sessions.length;
  const avgRating = (
    sessions.reduce((sum, s) => sum + (s.understanding + s.engagement + s.concentration + s.practical) / 4, 0) / sessions.length
  ).toFixed(1);

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>📊 Ogólne statystyki</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalSessions}</div>
          <div className="stat-label">Sesji razem</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.length}</div>
          <div className="stat-label">Uczniów</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgRating}/5</div>
          <div className="stat-label">Średnia ocena</div>
        </div>
      </div>

      <h2 style={{ marginTop: '32px', marginBottom: '20px', fontSize: '20px' }}>👥 Szczegóły per ucznia</h2>

      <div className="sessions-list">
        {stats.map(student => (
          <div key={student.id} className="session-item">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>
                {student.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#666' }}>
                {student.class} • 💰 {student.price} zł/h
              </p>
            </div>

            <div className="session-ratings">
              <div className="rating-card">
                <div className="rating-label">Zrozumienie</div>
                <div className="rating-value">{student.avgUnderstanding}/5</div>
              </div>
              <div className="rating-card">
                <div className="rating-label">Zaangażowanie</div>
                <div className="rating-value">{student.avgEngagement}/5</div>
              </div>
              <div className="rating-card">
                <div className="rating-label">Koncentracja</div>
                <div className="rating-value">{student.avgConcentration}/5</div>
              </div>
              <div className="rating-card">
                <div className="rating-label">Praktyka</div>
                <div className="rating-value">{student.avgPractical}/5</div>
              </div>
              <div className="rating-card" style={{ background: 'rgba(45, 122, 136, 0.1)' }}>
                <div className="rating-label">Średnia</div>
                <div className="rating-value">{student.overall}/5</div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#2d7a88', marginTop: '12px' }}>
              <strong>Sesji: {student.count}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
