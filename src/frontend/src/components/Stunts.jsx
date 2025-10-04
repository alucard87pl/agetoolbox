import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Form, Table, Badge, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap'
import { apiService } from '../services/api'
import StuntModal from './StuntModal'

const Stunts = () => {
  const [stunts, setStunts] = useState([])
  const [filteredStunts, setFilteredStunts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [costFilter, setCostFilter] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSettings, setSelectedSettings] = useState([])
  const [searchFilter, setSearchFilter] = useState('')

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingStunt, setEditingStunt] = useState(null)

  // Edit mode state
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Load stunts data on component mount
  useEffect(() => {
    loadStunts()
  }, [])

  // Filter stunts based on current filter values
  useEffect(() => {
    let filtered = [...stunts]

    // Filter by cost
    if (costFilter) {
      filtered = filtered.filter(stunt => {
        const cost = stunt.cost.toString()
        
        if (costFilter === '1') return cost === '1'
        
        // For <=2, <=3, <=4, <=5, <=6, check if the stunt cost is within range
        const maxCost = parseInt(costFilter)
        
        // Handle single values (1, 2, 3, etc.)
        if (!isNaN(parseInt(cost))) {
          return parseInt(cost) <= maxCost
        }
        
        // Handle ranges like "1-3", "2+", etc.
        if (cost.includes('-')) {
          const minCost = parseInt(cost.split('-')[0])
          return minCost <= maxCost
        } else if (cost.includes('+')) {
          const minCost = parseInt(cost.replace('+', ''))
          return minCost <= maxCost
        }
        
        return true
      })
    }

    // Filter by categories (if any are selected)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(stunt => selectedCategories.includes(stunt.category))
    }

    // Filter by settings (if any are selected)
    if (selectedSettings.length > 0) {
      filtered = filtered.filter(stunt => {
        return stunt.setting && selectedSettings.includes(stunt.setting)
      })
    }

    // Filter by search term
    if (searchFilter) {
      const search = searchFilter.toLowerCase()
      filtered = filtered.filter(stunt => 
        stunt.name.toLowerCase().includes(search) ||
        stunt.description.toLowerCase().includes(search)
      )
    }

    setFilteredStunts(filtered)
  }, [stunts, costFilter, selectedCategories, selectedSettings, searchFilter])

  const getSettingBadgeVariant = (setting) => {
    if (!setting) return 'secondary'
    switch (setting) {
      case 'Gritty': return 'danger'
      case 'Pulpy': return 'warning'
      case 'Cinematic': return 'success'
      default: return 'secondary'
    }
  }


  const handleAddStunt = () => {
    setEditingStunt(null)
    setShowModal(true)
  }

  const handleEditStunt = (stunt) => {
    setEditingStunt(stunt)
    setShowModal(true)
  }

  const handleDeleteStunt = async (stuntId) => {
    if (window.confirm('Are you sure you want to delete this stunt?')) {
      try {
        await apiService.deleteStunt(stuntId)
        await loadStunts() // Reload data
      } catch (err) {
        console.error('Error deleting stunt:', err)
        setError('Failed to delete stunt')
      }
    }
  }

  const handleModalSuccess = async () => {
    await loadStunts() // Reload data after add/edit
  }

  const toggleLock = () => {
    setIsUnlocked(!isUnlocked)
  }

  // Helper functions for checkbox filters
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSettingChange = (setting) => {
    setSelectedSettings(prev => 
      prev.includes(setting) 
        ? prev.filter(s => s !== setting)
        : [...prev, setting]
    )
  }

  // Extract unique categories and settings from data
  const getUniqueCategories = () => {
    return [...new Set(stunts.map(stunt => stunt.category))].sort()
  }

  const getUniqueSettings = () => {
    const settings = stunts.map(stunt => stunt.setting).filter(setting => setting !== null && setting !== undefined)
    return [...new Set(settings)].sort()
  }

  const loadStunts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getStunts()
      setStunts(data)
      setFilteredStunts(data)
    } catch (err) {
      console.error('Error loading stunts:', err)
      setError('Failed to load stunts data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading stunts data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Stunts</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  return (
    <div className="content-area">
      <div className="content-header">
        <div className="mb-3">
          <h2>
            <i className="ra ra-scroll-unfurled me-2"></i>Stunts Reference
          </h2>
        </div>

        {/* Filters */}
        <Card className="mb-3">
        <Card.Header>
          <Card.Title className="mb-0">
            <i className="ra ra-filter me-2"></i>Filters
          </Card.Title>
        </Card.Header>
        <Card.Body className="py-3">
          {/* Cost and Search on same row */}
          <Row className="g-2 mb-3 align-items-end">
            <Col md={4}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Form.Label className="mb-0">SP Cost:</Form.Label>
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-1"
                  label="=1"
                  value="1"
                  checked={costFilter === "1"}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-2"
                  label="≤2"
                  value="2"
                  checked={costFilter === "2"}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-3"
                  label="≤3"
                  value="3"
                  checked={costFilter === "3"}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-4"
                  label="≤4"
                  value="4"
                  checked={costFilter === "4"}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-5"
                  label="≤5"
                  value="5"
                  checked={costFilter === "5"}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-6"
                  label="≤6"
                  value="6"
                  checked={costFilter === "6"}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  name="costFilter"
                  id="cost-all"
                  label="All"
                  value=""
                  checked={costFilter === ""}
                  onChange={(e) => setCostFilter(e.target.value)}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="d-flex align-items-center gap-2">
                <Form.Label className="mb-0">Search:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search stunts..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
            </Col>
          </Row>

          {/* Category Filters */}
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Form.Label className="fw-bold mb-0">Categories:</Form.Label>
              {getUniqueCategories().map(category => (
                <Form.Check
                  key={category}
                  type="checkbox"
                  id={`category-${category}`}
                  label={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              ))}
            </div>
          </div>

          {/* Setting Filters */}
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Form.Label className="fw-bold mb-0">Settings:</Form.Label>
              {getUniqueSettings().map(setting => (
                <Form.Check
                  key={setting}
                  type="checkbox"
                  id={`setting-${setting}`}
                  label={
                    <span>
                      <Badge 
                        bg={getSettingBadgeVariant(setting)} 
                        className="me-1"
                        style={{fontSize: '0.7em'}}
                      >
                        {setting}
                      </Badge>
                    </span>
                  }
                  checked={selectedSettings.includes(setting)}
                  onChange={() => handleSettingChange(setting)}
                />
              ))}
            </div>
          </div>

          <div className="mt-2">
            <small className="text-muted">
              Showing {filteredStunts.length} of {stunts.length} stunts
            </small>
          </div>
        </Card.Body>
      </Card>
      </div>

      <div className="content-body">
        {/* Stunts Table */}
        <Card className="stunts-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="mb-0">
              <i className="ra ra-scroll-unfurled me-2"></i>Stunts ({filteredStunts.length})
            </Card.Title>
            <div className="d-flex gap-2">
              {isUnlocked && (
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={handleAddStunt}
                  title="Add new stunt"
                >
                  <i className="ra ra-plus me-1"></i>Add Stunt
                </Button>
              )}
              <Button 
                variant={isUnlocked ? "warning" : "outline-secondary"}
                size="sm"
                onClick={toggleLock}
                title={isUnlocked ? "Lock editing" : "Unlock editing"}
              >
                <i className={`ra ${isUnlocked ? 'ra-locked-heart' : 'ra-unlocked-heart'} me-1`}></i>
                {isUnlocked ? 'Lock' : 'Unlock'}
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="stunts-table-container">
            <Table striped hover className="w-100">
              <thead>
                <tr>
                        <th className="text-center" style={{width: '12%'}}>Category</th>
                        <th className="text-center" style={{width: '12%'}}>Setting</th>
                        <th style={{width: '18%'}}>Name</th>
                        <th className="text-center" style={{width: '10%'}}>SP Cost</th>
                        <th style={{width: '38%'}}>Description</th>
                        {isUnlocked && <th className="text-center" style={{width: '10%'}}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredStunts.map((stunt) => (
                  <tr key={stunt.id}>
                    <td className="text-center" style={{width: '12%'}}>
                      {stunt.category}
                    </td>
                    <td className="text-center" style={{width: '12%'}}>
                      {stunt.setting && (
                        <Badge bg={getSettingBadgeVariant(stunt.setting)} className="fs-6 px-3 py-2">
                          {stunt.setting}
                        </Badge>
                      )}
                    </td>
                    <td style={{width: '18%'}}>
                      <strong>{stunt.name}</strong>
                    </td>
                    <td className="text-center" style={{width: '10%'}}>
                      <Badge bg="primary" className="fs-6 px-3 py-2">
                        <i className="ra ra-lightning-bolt me-1"></i>
                        {typeof stunt.cost === 'string' ? stunt.cost : stunt.cost} SP
                      </Badge>
                    </td>
                    <td style={{width: '38%', wordWrap: 'break-word', whiteSpace: 'normal'}}>{stunt.description}</td>
                    
                    {/* Actions Column - only show when unlocked */}
                    {isUnlocked && (
                      <td className="text-center" style={{width: '10%'}}>
                        <ButtonGroup size="sm">
                          <Button 
                            variant="outline-primary" 
                            onClick={() => handleEditStunt(stunt)}
                            title="Edit stunt"
                          >
                            <i className="ra ra-quill-ink"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            onClick={() => handleDeleteStunt(stunt.id)}
                            title="Delete stunt"
                          >
                            <i className="ra ra-skull"></i>
                          </Button>
                        </ButtonGroup>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          {filteredStunts.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No stunts match your current filters.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      </div>

      {/* Stunt Modal */}
      <StuntModal
        show={showModal}
        onHide={() => setShowModal(false)}
        stunt={editingStunt}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default Stunts
