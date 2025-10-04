import React, { useState } from 'react'
import { Card, Row, Col, Form, Button, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap'
import { apiService } from '../services/api'

const DiceRoller = () => {
  const [bonus, setBonus] = useState(0)
  const [target, setTarget] = useState('11')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleRoll = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await apiService.rollDice(bonus, target !== '' ? parseInt(target) : null)
      setResult(response)
      setHistory(prev => [response, ...prev].slice(0, 10)) // Keep last 10 rolls
    } catch (error) {
      console.error('Error rolling dice:', error)
      setResult({ error: true, display: 'Error rolling dice.' })
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="content-area">
      <div className="content-header">
        <h2 className="mb-4">
          <i className="ra ra-dice-six me-2"></i>Dice Roller
        </h2>
      </div>

      <div className="content-body dice-roller-container">
        <Row className="g-4">
        {/* Main Dice Roller */}
        <Col lg={8}>
          <Card>
            <Card.Header bg="primary" text="white">
              <Card.Title className="mb-0">
                <i className="ra ra-dice-six me-2"></i>Roll 3d6
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleRoll}>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Bonus/Penalty</Form.Label>
                    <Form.Control
                      type="number"
                      value={bonus}
                      onChange={(e) => setBonus(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="-10"
                      max="10"
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Target</Form.Label>
                    <Form.Control
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="11"
                      min="1"
                      max="30"
                    />
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Rolling...
                        </>
                      ) : (
                        <>
                          <i className="ra ra-dice-six me-2"></i>Roll Dice
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {result && (
                <div className="mt-4">
                  <Alert variant={result.error ? 'danger' : result.has_doubles ? 'warning' : 'info'}>
                    <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                      {/* Dice Display - Fixed width */}
                      <div className="d-flex align-items-center gap-1" style={{ minWidth: '180px', justifyContent: 'center' }}>
                        <i 
                          className={`ra ra-dice-${result.blue_dice[0] === 1 ? 'one' : result.blue_dice[0] === 2 ? 'two' : result.blue_dice[0] === 3 ? 'three' : result.blue_dice[0] === 4 ? 'four' : result.blue_dice[0] === 5 ? 'five' : 'six'} ra-5x`}
                          title="Blue Die 1"
                          style={{ color: '#2563eb' }}
                        ></i>
                        <i 
                          className={`ra ra-dice-${result.blue_dice[1] === 1 ? 'one' : result.blue_dice[1] === 2 ? 'two' : result.blue_dice[1] === 3 ? 'three' : result.blue_dice[1] === 4 ? 'four' : result.blue_dice[1] === 5 ? 'five' : 'six'} ra-5x`}
                          title="Blue Die 2"
                          style={{ color: '#2563eb' }}
                        ></i>
                        <i 
                          className={`ra ra-dice-${result.red_die === 1 ? 'one' : result.red_die === 2 ? 'two' : result.red_die === 3 ? 'three' : result.red_die === 4 ? 'four' : result.red_die === 5 ? 'five' : 'six'} ra-5x`}
                          title="Red Die (Stunt Die)"
                          style={{ color: '#dc2626' }}
                        ></i>
                      </div>

                      {/* Bonus/Penalty - Fixed width, always show space */}
                      <div style={{ minWidth: '50px', textAlign: 'center' }}>
                        {result.bonus !== 0 && (
                          <span className="text-muted fs-4">{result.bonus > 0 ? '+' : ''}{result.bonus}</span>
                        )}
                      </div>

                      {/* Separator - Fixed width */}
                      <div style={{ minWidth: '20px', textAlign: 'center' }}>
                        <span className="text-muted fs-4">=</span>
                      </div>

                      {/* Total - Fixed width */}
                      <div style={{ minWidth: '60px', textAlign: 'center' }}>
                        <strong className="fs-3">{result.total}</strong>
                      </div>

                      {/* Target - Fixed width, always show space */}
                      <div style={{ minWidth: '70px', textAlign: 'center' }}>
                        {result.target && (
                          <span className="text-muted fs-4">vs {result.target}</span>
                        )}
                      </div>

                      {/* Success/Failure - Fixed width, always show space */}
                      <div style={{ minWidth: '120px', textAlign: 'center' }}>
                        {result.target && (
                          <Badge bg={result.success ? 'success' : 'danger'} className="fs-4 px-3 py-2">
                            {result.success ? (
                              <>
                                <i className="ra ra-targeted me-2"></i>Success
                              </>
                            ) : (
                              <>
                                <i className="ra ra-crossed-swords me-2"></i>Failure
                              </>
                            )}
                          </Badge>
                        )}
                      </div>

                      {/* Stunt Points - Fixed width, always show space */}
                      <div style={{ minWidth: '100px', textAlign: 'center' }}>
                        {result.stunt_points > 0 && (
                          <Badge bg="warning" className="fs-4 px-3 py-2">
                            <i className="ra ra-lightning-bolt me-2"></i>
                            {result.stunt_points} SP
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Roll History */}
          {history.length > 0 && (
            <Card className="mt-4">
              <Card.Header bg="secondary" text="white">
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">
                    <i className="ra ra-hourglass me-2"></i>Last 10 Rolls
                  </Card.Title>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={clearHistory}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="text-center">Dice</th>
                        <th className="text-center">Bonus</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Target</th>
                        <th className="text-center">Result</th>
                        <th className="text-center">SP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((roll, index) => (
                        <tr key={index} className="align-middle">
                          {/* Dice Column */}
                          <td className="text-center">
                            <div className="d-flex justify-content-center align-items-center gap-1">
                              <i 
                                className={`ra ra-dice-${roll.blue_dice[0] === 1 ? 'one' : roll.blue_dice[0] === 2 ? 'two' : roll.blue_dice[0] === 3 ? 'three' : roll.blue_dice[0] === 4 ? 'four' : roll.blue_dice[0] === 5 ? 'five' : 'six'} ra-3x`}
                                title="Blue Die 1"
                                style={{ color: '#2563eb' }}
                              ></i>
                              <i 
                                className={`ra ra-dice-${roll.blue_dice[1] === 1 ? 'one' : roll.blue_dice[1] === 2 ? 'two' : roll.blue_dice[1] === 3 ? 'three' : roll.blue_dice[1] === 4 ? 'four' : roll.blue_dice[1] === 5 ? 'five' : 'six'} ra-3x`}
                                title="Blue Die 2"
                                style={{ color: '#2563eb' }}
                              ></i>
                              <i 
                                className={`ra ra-dice-${roll.red_die === 1 ? 'one' : roll.red_die === 2 ? 'two' : roll.red_die === 3 ? 'three' : roll.red_die === 4 ? 'four' : roll.red_die === 5 ? 'five' : 'six'} ra-3x`}
                                title="Red Die (Stunt Die)"
                                style={{ color: '#dc2626' }}
                              ></i>
                            </div>
                          </td>

                          {/* Bonus Column */}
                          <td className="text-center">
                            {roll.bonus !== 0 && (
                              <span className="text-muted fs-6">{roll.bonus > 0 ? '+' : ''}{roll.bonus}</span>
                            )}
                          </td>

                          {/* Total Column */}
                          <td className="text-center">
                            <strong className="fs-5">{roll.total}</strong>
                          </td>

                          {/* Target Column */}
                          <td className="text-center">
                            {roll.target && (
                              <span className="text-muted fs-6">{roll.target}</span>
                            )}
                          </td>

                          {/* Result Column */}
                          <td className="text-center">
                            {roll.target && (
                              <Badge bg={roll.success ? 'success' : 'danger'} className="fs-6 px-2 py-1">
                                {roll.success ? (
                                  <>
                                    <i className="ra ra-targeted me-1"></i>Success
                                  </>
                                ) : (
                                  <>
                                    <i className="ra ra-crossed-swords me-1"></i>Failure
                                  </>
                                )}
                              </Badge>
                            )}
                          </td>

                          {/* SP Column */}
                          <td className="text-center">
                            {roll.stunt_points > 0 && (
                              <Badge bg="warning" className="fs-6 px-2 py-1">
                                <i className="ra ra-lightning-bolt me-1"></i>
                                {roll.stunt_points} SP
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      </div>
    </div>
  )
}

export default DiceRoller
