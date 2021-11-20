const { checkMessages } = require('./RefactorLib')

const config = require('config')
const redis = require('redis')
const promisifyRedis = require('promisify-redis')
const redisConfig = config.get('redis')

const redisClient = promisifyRedis(redis.createClient({
    host: redisConfig['host'] || 'localhost',
    port: redisConfig['port'] || 6379
}))

const getAllMessages = async (req, resp) => {
    var result = {}
        var emptyData = false
        await redisClient.get("messages.id")
            .then((res) => {
                if (res == null) {
                    emptyData = true;
                }
            })

        const fields = [
            "messages.id", "messages.text", "messages.owner",
            "messages.time_end", "messages.chat_id"
        ];


        if (emptyData) {
            for (var field of fields) {
                await redisClient.set(field, JSON.stringify([])).then(() => {
                    console.log("Initialized or cleaned " + field)
                });
            }
        }

        for (var field of fields) {
            await redisClient.get(field).then((resul) => {
                result[field.split(".")[1]] = JSON.parse(resul)
            })
        }

        return checkMessages(result)
}

module.exports.getAllMessages = getAllMessages