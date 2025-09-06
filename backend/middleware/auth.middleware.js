const jwt = require('jsonwebtoken');

async function authenticate(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Authentication required: No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    request.user = decoded;

  } catch (error) {
    reply.status(401).send({ message: 'Authentication failed: Invalid token.' });
  }
}

module.exports = { authenticate };
