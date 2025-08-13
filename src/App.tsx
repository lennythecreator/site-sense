import { HashRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import './App.css'
import Login from './pages/login'
import Saved from './pages/saved'
import { ViolationDetails } from './pages/violationDetails'
import ReportView from './pages/reportView'
import DataGrid from './pages/datagrid'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/saved' element={<Saved/>}></Route>
        <Route path="/report" element={<ReportView/>}/>
        <Route path='/datagrid' element={<DataGrid site={""} gridData={[]}/>}/>
        <Route path='/violations/:id' element={<ViolationDetails/>}/>
      </Routes>
    </HashRouter>
  )
}
