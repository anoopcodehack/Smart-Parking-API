const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Also capture response status
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`[${timestamp}] ${method} ${url} → STATUS: ${res.statusCode}`);
    originalSend.call(this, body);
  };

  next();
};

module.exports = logger;
