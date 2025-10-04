import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { apiService } from '../services/api'

const StuntModal = ({ show, onHide, stunt, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    category: 'Combat',
    description: '',
    setting: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Combat', 'Movement', 'Social', 'Mental']
  const settings = ['Universal', 'Gritty', 'Pulpy', 'Cinematic']

  useEffect(() => {
    if (stunt) {
      // Editing existing stunt
      setFormData({
        name: stunt.name || '',
        cost: stunt.cost || '',
        category: stunt.category || 'Combat',
        description: stunt.description || '',
        setting: stunt.setting || ''
      })
    } else {
      // Adding new stunt
      setFormData({
        name: '',
        cost: '',
        category: 'Combat',
        description: '',
        setting: ''
      })
    }
    setError('')
  }, [stunt, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const stuntData = {
        ...formData,
        setting: formData.setting || null
      }

      if (stunt) {
        // Update existing stunt
        await apiService.updateStunt(stunt.id, stuntData)
      } else {
        // Add new stunt
        await apiService.addStunt(stuntData)
      }

      onSuccess()
      onHide()
    } catch (err) {
      console.error('Error saving stunt:', err)
      setError(err.response?.data?.error || 'Failed to save stunt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="ra ra-scroll-unfurled me-2"></i>
          {stunt ? 'Edit Stunt' : 'Add New Stunt'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter stunt name"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-3">
              <Form.Group>
                <Form.Label>SP Cost *</Form.Label>
                <Form.Control
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g., 2, 1-3, 2+"
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-12">
              <Form.Group>
                <Form.Label>Setting</Form.Label>
                <Form.Select
                  name="setting"
                  value={formData.setting}
                  onChange={handleChange}
                >
                  <option value="">Universal</option>
                  {settings.slice(1).map(setting => (
                    <option key={setting} value={setting}>{setting}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-12">
              <Form.Group>
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter stunt description"
                  required
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Saving...' : (stunt ? 'Update Stunt' : 'Add Stunt')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default StuntModal
