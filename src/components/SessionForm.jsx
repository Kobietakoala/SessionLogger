import { useState } from 'react';

export default function SessionForm({ students, onSave }) {
  const [form, setForm] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    understanding: 3,
    engagement: 3,
    concentration: 3,
    practical: 3,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.studentId) {
      alert('Wybierz ucznia');
      return;
    }

    const student = students.find(s => s.id === parseInt(form.studentId));
    
    onSave({
      studentId: form.studentId,
      studentName: student.name,
      date: form.date,
      understanding: form.understanding,
      engagement: form.engagement,
      concentration: form.concentration,
      practical: form.practical,
      notes: form.notes,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    });

    // Reset
    setForm({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      understanding: 3,
      engagement: 3,
      concentration: 3,
      practical: 3,
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="student">👤 Uczeń:</label>
        <select 
          id="student"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
        >
          <option value="">-- Wybierz ucznia --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.class})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">📅 Data:</label>
        <input 
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <h3 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px' }}>📊 Oceny (1-5):</h3>

      {/* Zrozumienie */}
      <div className="form-group">
        <label>🧠 Zrozumienie</label>
        <div className="slider-container">
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={form.understanding}
            onChange={(e) => setForm({ ...form, understanding: parseInt(e.target.value) })}
          />
          <div className="slider-value">{form.understanding}/5</div>
        </div>
      </div>

      {/* Zaangażowanie */}
      <div className="form-group">
        <label>⚡ Zaangażowanie</label>
        <div className="slider-container">
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={form.engagement}
            onChange={(e) => setForm({ ...form, engagement: parseInt(e.target.value) })}
          />
          <div className="slider-value">{form.engagement}/5</div>
        </div>
      </div>

      {/* Koncentracja */}
      <div className="form-group">
        <label>🎯 Koncentracja</label>
        <div className="slider-container">
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={form.concentration}
            onChange={(e) => setForm({ ...form, concentration: parseInt(e.target.value) })}
          />
          <div className="slider-value">{form.concentration}/5</div>
        </div>
      </div>

      {/* Praktyka */}
      <div className="form-group">
        <label>🛠️ Umiejętność praktyczna</label>
        <div className="slider-container">
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={form.practical}
            onChange={(e) => setForm({ ...form, practical: parseInt(e.target.value) })}
          />
          <div className="slider-value">{form.practical}/5</div>
        </div>
      </div>

      {/* Notatki */}
      <div className="form-group">
        <label htmlFor="notes">📝 Notatki (co poszło dobrze, obszary do poprawy, itd.):</label>
        <textarea 
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Wpisz swoje obserwacje..."
        />
      </div>

      <button type="submit" className="btn">💾 Zapisz sesję</button>
    </form>
  );
}
