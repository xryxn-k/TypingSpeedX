import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function GameResultModal({ isOpen, onClose, results, onPlayAgain, onShare }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !results) return null

  const shareText = `I just scored ${results.wpm} WPM with ${results.accuracy}% accuracy on TypingSpeedX! 🚀`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TypingSpeedX Result',
          text: shareText,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    if (onShare) onShare()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl p-8 max-w-2xl w-full border-2 border-neon-cyan shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Game Over! 🎉
          </h2>

          <div className="space-y-4 mb-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-neon-cyan mb-2">{results.wpm}</div>
              <div className="text-gray-400">Words Per Minute</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-neon-green">{results.accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-neon-pink">{results.charactersTyped}</div>
                <div className="text-sm text-gray-400">Characters</div>
              </div>
            </div>

            {results.errors !== undefined && (
              <div className="glass rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-red-400">{results.errors}</div>
                <div className="text-sm text-gray-400">Errors</div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex-1 py-3 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg font-bold hover:shadow-lg transition-all"
            >
              {copied ? 'Copied!' : 'Share'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgain}
              className="flex-1 py-3 bg-gradient-to-r from-neon-green to-neon-cyan rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 rounded-lg font-bold hover:bg-gray-600 transition-all"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
