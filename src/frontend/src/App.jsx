import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'
import './App.css'

// Components
import Home from './components/Home'
import DiceRoller from './components/DiceRoller'
import Stunts from './components/Stunts'

function Navigation() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-0">
      <Container fluid>
        <Navbar.Brand className="fw-bold">
          <i className="ra ra-dice-six me-2"></i>AGE Toolbox
        </Navbar.Brand>
        
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <i className="bi bi-circle-fill text-success me-1"></i>Ready
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', label: 'Home', icon: 'ra ra-tower' },
    { path: '/dice', label: 'Dice Roller', icon: 'ra ra-dice-six' },
    { path: '/stunts', label: 'Stunts Reference', icon: 'ra ra-scroll-unfurled' }
  ]
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h6 className="text-muted mb-3">Navigation</h6>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={`${item.icon} me-2`}></i>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

function App() {
  return (
    <div className="app-container">
      <Navigation />
      
      <div className="app-content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="main-content">
          <Container fluid>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dice" element={<DiceRoller />} />
              <Route path="/stunts" element={<Stunts />} />
            </Routes>
          </Container>
        </div>
      </div>
      
      <footer className="app-footer">
        <div className="footer-content text-center py-3 bg-light">
          <p className="mb-0">&copy; 2024 AGE Toolbox - Modern AGE RPG System Support</p>
          <p className="mb-0">Built with React + Flask API</p>
        </div>
      </footer>
    </div>
  )
}

export default App
