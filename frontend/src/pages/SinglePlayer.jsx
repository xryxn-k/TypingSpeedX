import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TypingBox from '../components/TypingBox'
import GameResultModal from '../components/GameResultModal'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function SinglePlayer() {
  const [text, setText] = useState('')
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchText()
  }, [])

  const fetchText = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/text`)
      setText(response.data.text)
      setStarted(false)
      setResults(null)
      setShowModal(false)
    } catch (error) {
      console.error('Error fetching text:', error)
      // Fallback text
      setText('The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.')
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    setStarted(true)
    setResults(null)
    setShowModal(false)
  }

  const handleComplete = async (stats) => {
    setResults(stats)
    setShowModal(true)
    setStarted(false)

    // Save score to backend
    try {
      const playerName = localStorage.getItem('playerName') || 'Anonymous'
      await axios.post(`${API_URL}/api/score`, {
        name: playerName,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        mode: 'single',
        charactersTyped: stats.charactersTyped,
        errors: stats.errors
      })
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const handlePlayAgain = () => {
    setStarted(false)
    setResults(null)
    setShowModal(false)
    fetchText()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Single Player Mode
          </h1>
          <div className="w-24" /> {/* Spacer */}
        </motion.div>

        {/* Game Area */}
        {!started && !showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg font-bold text-xl hover:shadow-lg transition-all"
            >
              Start Typing Test
            </motion.button>
          </motion.div>
        )}

        {text && (
          <TypingBox
            text={text}
            started={started}
            onComplete={handleComplete}
            timer={60}
          />
        )}

        {!started && !showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <button
              onClick={fetchText}
              className="text-neon-cyan hover:text-neon-pink transition-colors"
            >
              Get New Text
            </button>
          </motion.div>
        )}

        {/* Result Modal */}
        <GameResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          results={results}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    </div>
  )
}
