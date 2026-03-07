const rateLimiter = (maxRequests, windowMs) => {
    const clients = new Map();

    return (req, res, next) => {
        const clientIp = req.ip;
        const currentTime = Date.now();
        const client = clients.get(clientIp);

        if (!client || currentTime > client.resetTime) {
            clients.set(clientIp, { count: 1, resetTime: currentTime + windowMs });
            return next();
        }

        if (client.count >= maxRequests) {
            return res.status(429).send({ message: 'Too many requests, please try again later.' });
        }

        client.count += 1;
        next();
    };
}

module.exports = rateLimiter;