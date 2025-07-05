const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if this is a development token
    if (token.startsWith('dev-token-')) {
      // Create a mock user object for development
      req.user = {
        userId: '685ca558e02c06b3fbc7a193',
        email: 'admin@zip.com'
      };
      return next();
    }

    // Verify token for production
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth; 