import { useState } from 'react';

export default function StudentForm({ students, onSave }) {
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    fromType: '',
    bukischoolLink: '',
    boardLink: '',
    startDate: new Date().toISOString().split('T')[0],
    startRating: 1,
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
      fromType: form.fromType,
      bukischoolLink: form.bukischoolLink,
      boardLink: form.boardLink,
      startDate: form.startDate,
      startRating: form.startRating,
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    });

    // Reset
    setForm({
      studentId: '',
      studentName: '',
      fromType: '',
      bukischoolLink: '',
      boardLink: '',
      startDate: new Date().toISOString().split('T')[0],
      startRating: 1,
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="student">👤 Uczeń:</label>
        <input 
          type="text"
          value={form.studentName || ''}
          onChange={(e) => setForm({ ...form, studentName: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="fromType">📅 Typ zgłoszenia:</label>
        <select
          id="fromType"
          value={form.fromType || ''}
          onChange={(e) => setForm({ ...form, fromType: e.target.value })}
        >
          <option value="">-- Wybierz typ zgłoszenia --</option>
          <option value="private">Prywatnie</option>
          <option value="bukischool">BukiSchool</option>
        </select>
      </div>
    
        {form.fromType === 'bukischool' && (
          <div className="form-group">
            <label htmlFor="student">👤 Link do zgłoszenia:</label>
            <input 
              type="text"
              value={form.bukischoolLink || ''}
              onChange={(e) => setForm({ ...form, bukischoolLink: e.target.value })}
            />
          </div>
        )}

        <div className="form-group">
            <label htmlFor="student">👤 Link do tablicy:</label>
            <input 
              type="text"
              value={form.boardLink || ''}
              onChange={(e) => setForm({ ...form, boardLink: e.target.value })}
            />
          </div>

      <div className="form-group">
        <label htmlFor="date">📅 Data rozpoczęcia:</label>
        <input 
          id="date"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
      </div>

      <h3 style={{ marginTop: '24px', marginBottom: '16px', fontSize: '16px' }}>📊 Oceny (1-5):</h3>

      {/* Ocena wstępna */}
      <div className="form-group">
        <label>🧠 Ocena wstępna</label>
        <div className="slider-container">
          <input 
            type="range" 
            min="1" 
            max="6" 
            value={form.startRating}
            onChange={(e) => setForm({ ...form, startRating: parseInt(e.target.value) })}
          />
          <div className="slider-value">{form.startRating}/5</div>
        </div>
      </div>

        
      

      {/* Notatki */}
      <div className="form-group">
        <label htmlFor="notes">📝 Notatki:</label>
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
