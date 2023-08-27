const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(userQuery, [decoded.sub], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      req.user = results[0]; // Attach user data to req.user
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
