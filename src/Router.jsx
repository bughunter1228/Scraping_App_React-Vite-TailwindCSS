import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import ScrapingPage from './pages/ScrapingPage'
import DatabasePage from './pages/DatabasePage'
import LogPage from './pages/LogPage'

const Routers = () =>{
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ScrapingPage />} />
                <Route path='/database' element={<DatabasePage />} />
                <Route path='/log' element={<LogPage />} />
            </Routes>
        </Router>
    )
}

export default Routers