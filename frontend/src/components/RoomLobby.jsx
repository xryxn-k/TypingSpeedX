import { motion } from 'framer-motion'
import { useState } from 'react'

export default function RoomLobby({ roomCode, players, onToggleReady, isReady, canStart }) {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8 mb-6"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-neon-cyan">Room Code</h2>
        <div className="text-6xl font-bold text-center mb-6 font-mono tracking-wider text-neon-pink neon-text">
          {roomCode}
        </div>
        <p className="text-center text-gray-400">Share this code with your friends to join!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6 mb-6"
      >
        <h3 className="text-xl font-bold mb-4 text-neon-green">Players ({players.length})</h3>
        <div className="space-y-3">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink flex items-center justify-center font-bold">
                  {player.name[0].toUpperCase()}
                </div>
                <span className="font-bold">{player.name}</span>
              </div>
              {player.ready ? (
                <span className="text-neon-green">✓ Ready</span>
              ) : (
                <span className="text-gray-500">Waiting...</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {players.length < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mb-6"
        >
          Waiting for more players... (Need at least 2 players)
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleReady}
        disabled={players.length < 2}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          isReady
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-r from-neon-green to-neon-cyan hover:shadow-lg'
        } ${players.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isReady ? 'Not Ready' : 'Ready'}
      </motion.button>

      {canStart && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-neon-green mt-4"
        >
          All players ready! Game starting in 3 seconds...
        </motion.p>
      )}
    </div>
  )
}
