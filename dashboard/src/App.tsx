import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import FormsListPage from './pages/FormsListPage'
import FormBuilderPage from './pages/FormBuilderPage'
import FormResponsesPage from './pages/FormResponsesPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/formularios" replace />} />
          <Route path="/formularios" element={<FormsListPage />} />
          <Route path="/formularios/nuevo" element={<FormBuilderPage />} />
          <Route path="/formularios/:id/editar" element={<FormBuilderPage />} />
          <Route path="/formularios/:id/respuestas" element={<FormResponsesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/formularios" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
