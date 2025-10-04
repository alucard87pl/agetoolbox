import axios from 'axios'

const API_BASE_URL = '/api' // Use proxy in development, absolute URL in production

const apiService = {
  // Test API connection
  async test() {
    const response = await axios.get(`${API_BASE_URL}/test`)
    return response.data
  },

  // Roll dice
  async rollDice(bonus = 0, target = null) {
    const response = await axios.post(`${API_BASE_URL}/roll_dice`, {
      bonus,
      target
    })
    return response.data
  },

        // Get stunts data
        async getStunts() {
            const response = await axios.get(`${API_BASE_URL}/stunts`)
            return response.data
        },

        // Add new stunt
        async addStunt(stuntData) {
            const response = await axios.post(`${API_BASE_URL}/stunts`, stuntData)
            return response.data
        },

        // Update existing stunt
        async updateStunt(stuntId, stuntData) {
            const response = await axios.put(`${API_BASE_URL}/stunts/${stuntId}`, stuntData)
            return response.data
        },

        // Delete stunt
        async deleteStunt(stuntId) {
            const response = await axios.delete(`${API_BASE_URL}/stunts/${stuntId}`)
            return response.data
        }
}

export { apiService }
