const redis = require('redis')
const config = require('config')

const redisConfig = config.get('redis')
const client = redis.createClient({
    host : redisConfig['host'] || 'localhost',
    port : redisConfig['port'] || 6379
})

module.exports = client