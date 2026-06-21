import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProgramSelector from './components/ProgramSelector'
import AcademicSection from './components/AcademicSection'
import PredictiveSection from './components/PredictiveSection'
import Header from './components/Header'
import SaveBar from './components/SaveBar'
import { useStudentStore } from './hooks/useStudentStore'
import './App.css'

export default function App() {
  const { state, loadFromServer } = useStudentStore()
  const [activeSection, setActiveSection] = useState('academico')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFromServer().finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">UdeA</div>
      <p>Cargando planeador académico...</p>
    </div>
  )

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <SaveBar />

        <ProgramSelector />

        {state.progId && (
          <>
            <div className="section-tabs">
              <button
                className={`section-tab ${activeSection === 'academico' ? 'active' : ''}`}
                onClick={() => setActiveSection('academico')}
              >
                Académico
              </button>
              <button
                className={`section-tab ${activeSection === 'predictivo' ? 'active' : ''}`}
                onClick={() => setActiveSection('predictivo')}
              >
                Predictivo IA
              </button>
            </div>

            {activeSection === 'academico' && <AcademicSection />}
            {activeSection === 'predictivo' && <PredictiveSection />}
          </>
        )}
      </div>
    </BrowserRouter>
  )
}
