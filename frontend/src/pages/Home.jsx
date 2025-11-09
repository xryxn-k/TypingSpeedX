import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [hovered, setHovered] = useState(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl w-full"
      >
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green bg-clip-text text-transparent neon-text"
        >
          TypingSpeedX
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-300 mb-12"
        >
          Competitive Typing Arena
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Link
            to="/single"
            onMouseEnter={() => setHovered('single')}
            onMouseLeave={() => setHovered(null)}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-2xl p-8 cursor-pointer border-2 transition-all duration-300"
              style={{
                borderColor: hovered === 'single' ? '#00f0ff' : 'rgba(255,255,255,0.1)',
                boxShadow: hovered === 'single' ? '0 0 30px rgba(0,240,255,0.5)' : 'none'
              }}
            >
              <div className="text-4xl mb-4">⌨️</div>
              <h3 className="text-2xl font-bold mb-2 text-neon-cyan">Single Player</h3>
              <p className="text-gray-400">Practice your typing speed solo</p>
            </motion.div>
          </Link>

          <Link
            to="/multiplayer"
            onMouseEnter={() => setHovered('multi')}
            onMouseLeave={() => setHovered(null)}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-2xl p-8 cursor-pointer border-2 transition-all duration-300"
              style={{
                borderColor: hovered === 'multi' ? '#ff00ff' : 'rgba(255,255,255,0.1)',
                boxShadow: hovered === 'multi' ? '0 0 30px rgba(255,0,255,0.5)' : 'none'
              }}
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2 text-neon-pink">Multiplayer</h3>
              <p className="text-gray-400">Battle against friends in real-time</p>
            </motion.div>
          </Link>

          <Link
            to="/leaderboard"
            onMouseEnter={() => setHovered('leaderboard')}
            onMouseLeave={() => setHovered(null)}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-2xl p-8 cursor-pointer border-2 transition-all duration-300"
              style={{
                borderColor: hovered === 'leaderboard' ? '#00ff00' : 'rgba(255,255,255,0.1)',
                boxShadow: hovered === 'leaderboard' ? '0 0 30px rgba(0,255,0,0.5)' : 'none'
              }}
            >
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2 text-neon-green">Leaderboard</h3>
              <p className="text-gray-400">See top players worldwide</p>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass rounded-xl p-6 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-4 text-neon-cyan">How to Play</h3>
          <ul className="text-left text-gray-300 space-y-2">
            <li>• Type the displayed text as fast and accurately as possible</li>
            <li>• You have 60 seconds to complete the test</li>
            <li>• Your WPM (Words Per Minute) and accuracy are tracked in real-time</li>
            <li>• In multiplayer mode, compete against friends in the same room</li>
            <li>• Check the leaderboard to see how you rank globally</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
