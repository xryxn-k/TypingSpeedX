import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { io } from 'socket.io-client'
import TypingBox from '../components/TypingBox'
import RoomLobby from '../components/RoomLobby'
import ProgressBar from '../components/ProgressBar'
import GameResultModal from '../components/GameResultModal'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export default function Multiplayer() {
  const [socket, setSocket] = useState(null)
  const [screen, setScreen] = useState('menu') // menu, lobby, game, result
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState([])
  const [gameText, setGameText] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(null)
  const [countdown, setCountdown] = useState(null)
  const [myReady, setMyReady] = useState(false)
  const [allPlayersProgress, setAllPlayersProgress] = useState([])
  const [gameResults, setGameResults] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Get player name from localStorage or prompt
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      setPlayerName(savedName)
    } else {
      const name = prompt('Enter your name:') || 'Player' + Math.floor(Math.random() * 1000)
      setPlayerName(name)
      localStorage.setItem('playerName', name)
    }

    // Initialize socket
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    // Socket event listeners
    newSocket.on('roomCreated', ({ roomCode, players }) => {
      setRoomCode(roomCode)
      setPlayers(players)
      setScreen('lobby')
    })

    newSocket.on('playerJoined', (players) => {
      setPlayers(players)
    })

    newSocket.on('playerLeft', (players) => {
      setPlayers(players)
    })

    newSocket.on('playerReadyUpdate', (players) => {
      setPlayers(players)
    })

    newSocket.on('countdown', (number) => {
      setCountdown(number)
    })

    newSocket.on('gameStarted', ({ text, startTime }) => {
      // Small delay to show "GO!" before switching to game screen
      setCountdown(0)
      setTimeout(() => {
        setGameText(text)
        setGameStartTime(startTime)
        setScreen('game')
        setGameStarted(true)
        setCountdown(null)
      }, 500)
    })

    newSocket.on('progressUpdate', (players) => {
      setAllPlayersProgress(players)
    })

    newSocket.on('gameOver', (results) => {
      setGameResults(results)
      setGameStarted(false)
      setScreen('result')
      setShowModal(true)

      // Save scores
      results.players.forEach(async (player) => {
        try {
          await axios.post(`${API_URL}/api/score`, {
            name: player.name,
            wpm: player.wpm,
            accuracy: player.accuracy,
            mode: 'multi',
            charactersTyped: player.charactersTyped,
            errors: player.errors
          })
        } catch (error) {
          console.error('Error saving score:', error)
        }
      })
    })

    newSocket.on('error', ({ message }) => {
      alert(message)
    })

    newSocket.on('newMessage', ({ playerName, message, timestamp }) => {
      setMessages(prev => [...prev, { playerName, message, timestamp }])
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }
    socket.emit('createRoom', { name: playerName })
  }

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      alert('Please enter your name')
      return
    }
    if (!joinCode.trim()) {
      alert('Please enter a room code')
      return
    }
    socket.emit('joinRoom', { roomCode: joinCode.toUpperCase(), name: playerName })
    setRoomCode(joinCode.toUpperCase())
    setScreen('lobby')
  }

  const handleToggleReady = () => {
    socket.emit('toggleReady', { roomCode })
    setMyReady(!myReady)
  }

  const handleProgressUpdate = (progress) => {
    socket.emit('updateProgress', {
      roomCode,
      ...progress
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (chatInput.trim() && socket) {
      socket.emit('sendMessage', {
        roomCode,
        message: chatInput,
        playerName
      })
      setChatInput('')
    }
  }

  const handlePlayAgain = () => {
    setScreen('menu')
    setRoomCode('')
    setPlayers([])
    setGameText('')
    setGameStarted(false)
    setGameResults(null)
    setShowModal(false)
    setAllPlayersProgress([])
    setMyReady(false)
    setMessages([])
  }

  if (screen === 'menu') {
    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-2xl mx-auto">
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
              Multiplayer Mode
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-xl p-8 mb-6"
          >
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-neon-cyan">Your Name</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value)
                  localStorage.setItem('playerName', e.target.value)
                }}
                className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-neon-cyan focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateRoom}
              className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg font-bold text-lg hover:shadow-lg transition-all mb-4"
            >
              Create Room
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-bg text-gray-400">OR</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-neon-pink">Room Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none font-mono text-center text-2xl"
                placeholder="ABCDEF"
                maxLength={6}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinRoom}
              className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-green rounded-lg font-bold text-lg hover:shadow-lg transition-all"
            >
              Join Room
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (screen === 'lobby') {
    const allReady = players.length >= 2 && players.every(p => p.ready)
    const myPlayer = players.find(p => p.id === socket?.id)

    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/multiplayer"
              onClick={() => {
                setScreen('menu')
                setRoomCode('')
              }}
              className="text-neon-cyan hover:text-neon-pink transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Room Lobby
            </h1>
          </div>

          <RoomLobby
            roomCode={roomCode}
            players={players}
            onToggleReady={handleToggleReady}
            isReady={myPlayer?.ready || false}
            canStart={allReady}
          />

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 mt-6"
          >
            <h3 className="text-xl font-bold mb-4 text-neon-green">Chat</h3>
            <div className="h-32 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-bold text-neon-cyan">{msg.playerName}:</span>{' '}
                  <span className="text-gray-300">{msg.message}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 p-2 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-neon-cyan focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neon-cyan text-dark-bg rounded-lg font-bold hover:bg-neon-pink transition-colors"
              >
                Send
              </button>
            </form>
          </motion.div>

          {/* Countdown */}
          <AnimatePresence mode="wait">
            {countdown !== null && countdown > 0 && (
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-9xl font-bold text-neon-cyan neon-text drop-shadow-2xl"
                >
                  {countdown}
                </motion.div>
              </motion.div>
            )}
            {countdown === 0 && (
              <motion.div
                key="go"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-9xl font-bold text-neon-green neon-text drop-shadow-2xl"
                >
                  GO!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (screen === 'game') {
    const myProgress = allPlayersProgress.find(p => p.id === socket?.id) || {
      progress: 0,
      wpm: 0,
      accuracy: 100
    }

    return (
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center mb-4 text-neon-cyan">Multiplayer Battle</h2>
            
            {/* Other Players Progress */}
            <div className="mb-6">
              {allPlayersProgress
                .filter(p => p.id !== socket?.id)
                .map((player) => (
                  <ProgressBar
                    key={player.id}
                    progress={player.progress}
                    wpm={player.wpm}
                    accuracy={player.accuracy}
                    playerName={player.name}
                  />
                ))}
            </div>
          </div>

          {/* Your Typing Box */}
          {gameText && (
            <TypingBox
              text={gameText}
              started={gameStarted}
              onComplete={(stats) => {
                handleProgressUpdate({ ...stats, finished: true })
              }}
              onProgressUpdate={handleProgressUpdate}
              timer={60}
            />
          )}
        </div>
      </div>
    )
  }

  if (screen === 'result') {
    const myPlayer = gameResults?.players.find(p => p.id === socket?.id)
    const winner = gameResults?.winner

    return (
      <div className="min-h-screen p-4 py-8">
        <GameResultModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          results={myPlayer ? {
            wpm: myPlayer.wpm,
            accuracy: myPlayer.accuracy,
            charactersTyped: myPlayer.charactersTyped,
            errors: myPlayer.errors
          } : null}
          onPlayAgain={handlePlayAgain}
        />

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-neon-cyan">Game Results</h2>
          
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-neon-green">
              Winner: {winner?.name} 🏆
            </h3>
            <div className="text-xl text-neon-cyan">
              {winner?.wpm} WPM • {winner?.accuracy}% Accuracy
            </div>
          </div>

          <div className="space-y-4">
            {gameResults?.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-lg p-4 border-2 ${
                  player.id === winner?.id
                    ? 'border-neon-green shadow-lg shadow-neon-green/50'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold w-8">#{index + 1}</div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink flex items-center justify-center font-bold">
                      {player.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{player.name}</div>
                      {player.id === socket?.id && (
                        <div className="text-sm text-neon-cyan">You</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-neon-cyan">{player.wpm} WPM</div>
                    <div className="text-sm text-gray-400">{player.accuracy}% accuracy</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAgain}
            className="w-full mt-6 py-4 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Play Again
          </motion.button>
        </div>
      </div>
    )
  }

  return null
}
