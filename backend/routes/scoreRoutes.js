import express from "express";
import Score from "../models/Score.js";

const router = express.Router();

// POST /api/score - Save a score
router.post("/", async (req, res) => {
  try {
    const { name, wpm, accuracy, mode, charactersTyped, errors } = req.body;
    
    const score = new Score({
      name,
      wpm,
      accuracy,
      mode: mode || "single",
      charactersTyped,
      errors
    });
    
    await score.save();
    res.status(201).json(score);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/leaderboard - Get top scores
router.get("/leaderboard", async (req, res) => {
  try {
    const { mode, limit = 10, sortBy = "wpm" } = req.query;
    
    const query = mode ? { mode } : {};
    const sort = { [sortBy]: -1 };
    
    const scores = await Score.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .exec();
    
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
