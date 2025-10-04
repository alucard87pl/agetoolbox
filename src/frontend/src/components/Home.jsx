import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="content-area">
      <div className="content-header">
        <h1>Welcome to AGE Toolbox</h1>
        <p className="lead">Your Modern AGE RPG System Support Tool</p>
      </div>

      <div className="content-body">
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <i className="ra ra-dice-six ra-5x text-primary mb-3"></i>
                <Card.Title>Dice Roller</Card.Title>
                <Card.Text>
                  Roll 3d6 with bonus/penalty modifiers and target numbers. 
                  Track stunt points and roll history.
                </Card.Text>
                <Button variant="primary" as={Link} to="/dice">
                  <i className="ra ra-dice-six me-2"></i>Roll Dice
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <i className="ra ra-scroll-unfurled ra-5x text-info mb-3"></i>
                <Card.Title>Stunts Reference</Card.Title>
                <Card.Text>
                  Browse and filter Modern AGE stunts by category, setting, 
                  and SP cost. Quick reference for GMs and players.
                </Card.Text>
                <Button variant="info" as={Link} to="/stunts">
                  <i className="ra ra-scroll-unfurled me-2"></i>View Stunts
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Home