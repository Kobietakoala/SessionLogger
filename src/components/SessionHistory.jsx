export default function SessionHistory({ sessions, students, onDelete }) {
  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p>Brak zapisanych sesji. Zacznij od "Nowa sesja".</p>
      </div>
    );
  }

  // Posortuj sesje od najnowszych
  const sorted = [...sessions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="sessions-list">
      {sorted.map(session => {
        const student = students.find(s => s.id === parseInt(session.studentId));
        const avgRating = (
          (session.understanding + session.engagement + session.concentration + session.practical) / 4
        ).toFixed(1);

        return (
          <div key={session.id} className="session-item">
            <div className="session-header">
              <div>
                <span className="session-date">👤 {session.studentName}</span>
                <span style={{ marginLeft: '16px', color: '#666' }}>
                  📅 {new Date(session.date).toLocaleDateString('pl-PL')}
                </span>
              </div>
              <button 
                className="btn-delete"
                onClick={() => {
                  if (confirm('Czy na pewno usunąć tę sesję?')) {
                    onDelete(session.id);
                  }
                }}
              >
                ✕ Usuń
              </button>
            </div>

            <div className="session-ratings">
              <div className="rating-card">
                <div className="rating-label">Zrozumienie</div>
                <div className="rating-value">{session.understanding}/5</div>
              </div>
              <div className="rating-card">
                <div className="rating-label">Zaangażowanie</div>
                <div className="rating-value">{session.engagement}/5</div>
              </div>
              <div className="rating-card">
                <div className="rating-label">Koncentracja</div>
                <div className="rating-value">{session.concentration}/5</div>
              </div>
              <div className="rating-card">
                <div className="rating-label">Praktyka</div>
                <div className="rating-value">{session.practical}/5</div>
              </div>
              <div className="rating-card" style={{ background: 'rgba(45, 122, 136, 0.1)' }}>
                <div className="rating-label">Średnia</div>
                <div className="rating-value">{avgRating}/5</div>
              </div>
            </div>

            {session.notes && (
              <div className="session-notes">
                <strong>Notatki:</strong><br />
                {session.notes}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
