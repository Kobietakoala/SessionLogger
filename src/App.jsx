import { useState, useEffect } from 'react';
import './App.css';
import { STUDENTS } from './data/students';
import SessionForm from './components/SessionForm';
import SessionHistory from './components/SessionHistory';
import StudentStats from './components/StudentStats';
import StudentForm from './components/StudenForm';

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [sessions, setSessions] = useState([]);

  // Załaduj z localStorage przy starcie
  useEffect(() => {
    const saved = localStorage.getItem('sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  // Zapisz do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleAddSession = (newSession) => {
    setSessions([...sessions, { ...newSession, id: Date.now() }]);
    setActiveTab('history');
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <>
      <header>
        <h1>📝 Session Logger</h1>
        <p>Loguj sesje, śledź postęp uczniów</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            ➕ Nowa sesja
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 Historia ({sessions.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statystyki
          </button>
          <button 
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            📊 Uczniowie
          </button>
        </div>

        {activeTab === 'form' && (
          <SessionForm students={STUDENTS} onSave={handleAddSession} />
        )}

        {activeTab === 'history' && (
          <SessionHistory 
            sessions={sessions} 
            students={STUDENTS}
            onDelete={handleDeleteSession}
          />
        )}

        {activeTab === 'stats' && (
          <StudentStats sessions={sessions} students={STUDENTS} />
        )}

        {activeTab === 'students' && (
          <StudentForm sessions={sessions} students={STUDENTS} />
        )}
      </div>
    </>
  );
}
