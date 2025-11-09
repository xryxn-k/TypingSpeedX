import express from "express";

const router = express.Router();

// Function to clean text - remove numbers and special characters, keep only letters and spaces
function cleanText(text) {
  return text
    .replace(/[^a-zA-Z\s]/g, '') // Remove all non-letters and non-spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing spaces
}

// Pool of typing texts (will be cleaned)
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

// Clean all texts
const typingTexts = rawTexts.map(cleanText);

// GET /api/text - Get random typing text
router.get("/", (req, res) => {
  const randomText = typingTexts[Math.floor(Math.random() * typingTexts.length)];
  res.json({ text: randomText });
});

export default router;
