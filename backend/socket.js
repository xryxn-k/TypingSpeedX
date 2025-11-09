import { Server } from "socket.io";

// Store active rooms
let rooms = {};

// Function to clean text - remove numbers and special characters, keep only letters and spaces
function cleanText(text) {
  return text
    .replace(/[^a-zA-Z\s]/g, '') // Remove all non-letters and non-spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing spaces
}

// Pool of typing texts
function getRandomText() {
  const rawTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.",
    "Typing faster requires focus, rhythm, and consistent practice. The more you type, the better you become.",
    "Code, type, repeat — the way to mastery is repetition. Every keystroke brings you closer to perfection.",
    "Programming is an art form that combines logic and creativity. Developers create digital worlds with their keyboards.",
    "The internet connects millions of people worldwide through the power of technology and communication.",
    "Practice makes perfect when it comes to typing speed and accuracy. Consistency is the key to improvement.",
    "Modern web development involves many technologies working together to create seamless user experiences.",
    "Open source software has revolutionized the way we build and share code across the globe.",
    "Learning to code opens doors to endless possibilities in the digital age we live in today.",
    "The best way to predict the future is to invent it through innovation and hard work."
  ];
  const texts = rawTexts.map(cleanText);
  return texts[Math.floor(Math.random() * texts.length)];
}

export function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log(`🟢 Player connected: ${socket.id}`);

    // Create a new room
    socket.on("createRoom", ({ name }) => {
      const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
      rooms[roomCode] = {
        players: [],
        text: getRandomText(),
        started: false,
        timer: null,
        startTime: null,
        countdownStarted: false
      };
      
      socket.join(roomCode);
      rooms[roomCode].players.push({
        id: socket.id,
        name,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        charactersTyped: 0,
        errors: 0,
        ready: false,
        finished: false
      });
      
      io.to(socket.id).emit("roomCreated", { roomCode, players: rooms[roomCode].players });
      console.log(`✨ Room created: ${roomCode} by ${name}`);
    });

    // Join an existing room
    socket.on("joinRoom", ({ roomCode, name }) => {
      if (rooms[roomCode] && !rooms[roomCode].started) {
        socket.join(roomCode);
        rooms[roomCode].players.push({
          id: socket.id,
          name,
          progress: 0,
          wpm: 0,
          accuracy: 100,
          charactersTyped: 0,
          errors: 0,
          ready: false,
          finished: false
        });
        
        io.to(roomCode).emit("playerJoined", rooms[roomCode].players);
        console.log(`👤 ${name} joined room: ${roomCode}`);
      } else {
        io.to(socket.id).emit("error", { message: "Room not found or game already started" });
      }
    });

    // Toggle player ready status
    socket.on("toggleReady", ({ roomCode }) => {
      const room = rooms[roomCode];
      if (room && !room.started && !room.countdownStarted) {
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.ready = !player.ready;
          io.to(roomCode).emit("playerReadyUpdate", room.players);
          
          // Auto-start if all players are ready and at least 2 players
          const allReady = room.players.every(p => p.ready) && room.players.length >= 2;
          if (allReady && !room.countdownStarted) {
            room.countdownStarted = true;
            // Start countdown: 3, 2, 1
            let countdown = 3;
            io.to(roomCode).emit("countdown", countdown);
            
            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown > 0) {
                io.to(roomCode).emit("countdown", countdown);
              } else {
                clearInterval(countdownInterval);
                // Start the game
                if (rooms[roomCode] && rooms[roomCode].players.every(p => p.ready)) {
                  rooms[roomCode].started = true;
                  rooms[roomCode].startTime = Date.now();
                  io.to(roomCode).emit("gameStarted", { text: room.text, startTime: rooms[roomCode].startTime });
                  
                  // End game after 60 seconds
                  rooms[roomCode].timer = setTimeout(() => {
                    endGame(roomCode);
                  }, 60000);
                } else {
                  // Reset countdown if players became unready
                  room.countdownStarted = false;
                }
              }
            }, 1000);
          }
        }
      }
    });

    // Update player progress
    socket.on("updateProgress", ({ roomCode, progress, wpm, accuracy, charactersTyped, errors, finished }) => {
      const room = rooms[roomCode];
      if (room && room.started) {
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.progress = progress;
          player.wpm = wpm;
          player.accuracy = accuracy;
          player.charactersTyped = charactersTyped;
          player.errors = errors;
          player.finished = finished || false;
          
          // Broadcast progress to all players in room
          io.to(roomCode).emit("progressUpdate", room.players);
          
          // Check if all players finished
          if (finished && room.players.every(p => p.finished || p.progress >= 100)) {
            endGame(roomCode);
          }
        }
      }
    });

    // Send chat message
    socket.on("sendMessage", ({ roomCode, message, playerName }) => {
      io.to(roomCode).emit("newMessage", { playerName, message, timestamp: Date.now() });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`🔴 Player disconnected: ${socket.id}`);
      
      for (const code in rooms) {
        const room = rooms[code];
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          
          // If room is empty, delete it
          if (room.players.length === 0) {
            if (room.timer) clearTimeout(room.timer);
            delete rooms[code];
          } else {
            // Notify remaining players
            io.to(code).emit("playerLeft", room.players);
            
            // If game was in progress and only 1 player left, end game
            if (room.started && room.players.length === 1) {
              endGame(code);
            }
          }
        }
      }
    });

    // Helper function to end game
    function endGame(roomCode) {
      const room = rooms[roomCode];
      if (!room) return;
      
      if (room.timer) {
        clearTimeout(room.timer);
      }
      
      // Determine winner
      const sortedPlayers = [...room.players].sort((a, b) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return b.accuracy - a.accuracy;
      });
      
      const winner = sortedPlayers[0];
      const results = {
        winner,
        players: sortedPlayers,
        roomCode
      };
      
      io.to(roomCode).emit("gameOver", results);
      
      // Clean up room after a delay
      setTimeout(() => {
        delete rooms[roomCode];
      }, 30000); // Keep room for 30 seconds after game ends
    }
  });
}
