var redis        = require('redis');
var client       = redis.createClient(6379, process.env.REDIS_PORT_6379_TCP_ADDR);

module.exports = client;
