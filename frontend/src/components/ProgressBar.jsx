import { motion } from 'framer-motion'

export default function ProgressBar({ progress, wpm, accuracy, playerName, isWinner = false }) {
  const getColor = () => {
    if (wpm >= 60) return 'from-neon-green to-green-400'
    if (wpm >= 40) return 'from-neon-cyan to-cyan-400'
    if (wpm >= 20) return 'from-yellow-400 to-orange-400'
    return 'from-red-400 to-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass rounded-lg p-4 mb-4 border-2 ${isWinner ? 'border-neon-green shadow-lg shadow-neon-green/50' : 'border-gray-700'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg">{playerName}</div>
        <div className="flex gap-4 text-sm">
          <span className="text-neon-cyan">{wpm} WPM</span>
          <span className="text-neon-green">{accuracy}%</span>
        </div>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}
