import express from 'express';

const router = express.Router();

// Define your book routes here
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Book API!' });
});

export default router;