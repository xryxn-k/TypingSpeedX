import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Leaderboard() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('wpm')
  const [mode, setMode] = useState('') // '' for all, 'single', 'multi'

  useEffect(() => {
    fetchLeaderboard()
  }, [sortBy, mode])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ sortBy, limit: '50' })
      if (mode) params.append('mode', mode)
      
      const response = await axios.get(`${API_URL}/api/score/leaderboard?${params}`)
      setScores(response.data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Use mock data if API fails
      setScores([
        { name: 'Player1', wpm: 120, accuracy: 98, mode: 'single', date: new Date() },
        { name: 'Player2', wpm: 115, accuracy: 95, mode: 'multi', date: new Date() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (index) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600'
    if (index === 1) return 'from-gray-300 to-gray-500'
    if (index === 2) return 'from-orange-400 to-orange-600'
    return 'from-neon-cyan to-neon-pink'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            to="/"
            className="text-neon-cyan hover:text-neon-pink transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <div className="w-24" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-bold mb-2 text-neon-cyan">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-neon-cyan focus:outline-none"
              >
                <option value="wpm">WPM</option>
                <option value="accuracy">Accuracy</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-neon-pink">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="p-2 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none"
              >
                <option value="">All Modes</option>
                <option value="single">Single Player</option>
                <option value="multi">Multiplayer</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto"
            />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No scores yet. Be the first to set a record!
          </div>
        ) : (
          <div className="space-y-4">
            {scores.map((score, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass rounded-lg p-6 border-2 ${
                  index < 3
                    ? `border-gradient-to-r bg-gradient-to-r ${getRankColor(index)}`
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`text-4xl font-bold w-12 text-center ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-neon-cyan'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{score.name}</div>
                      <div className="text-sm text-gray-400">
                        {score.mode === 'single' ? 'Single Player' : 'Multiplayer'} • {formatDate(score.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-neon-cyan">{score.wpm} WPM</div>
                    <div className="text-lg text-neon-green">{score.accuracy}% accuracy</div>
                    {score.charactersTyped && (
                      <div className="text-sm text-gray-400">{score.charactersTyped} chars</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
