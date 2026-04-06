import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

import ForestData from './pages/ForestData'
import HealthIndex from './pages/HealthIndex'
import Home from './pages/Home'
import Login from './pages/Login'
import MapPage from './pages/MapPage'
import Register from './pages/Register'
import ReportIssue from './pages/ReportIssue'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          
          <Route path="register" element={<Register />} />
          <Route path="map" element={<MapPage />} />
          <Route path="forest-data" element={<ForestData />} />
          <Route path="report-issue" element={<ReportIssue />} />
          <Route path="health-index" element={<HealthIndex />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App