const { updateTable, refactorResultData } = require('./RefactorLib')

const config = require('config')
const redis = require('redis')
const promisifyRedis = require('promisify-redis')
const redisConfig = config.get('redis')
const redisClient = promisifyRedis(redis.createClient({
    host: redisConfig['host'] || 'localhost',
    port: redisConfig['port'] || 6379
}))


const getAllChats = async (req=null, res=null) => {
    var result = {}
    var emptyData = false
    await redisClient.get("chats.id")
        .then((res) => {
            if (res == null) {
                emptyData = true;
            }
        })

    const fields = [
        "chats.id", "chats.name", "chats.owner",
        "chats.members", "chats.key"
    ];


    if (emptyData) {
        for (var field of fields) {
            await redisClient.set(field, JSON.stringify([])).then(() => {
                console.log("Initialized or cleaned " + field)
            });
        }
    }

    for (var field of fields) {
        await redisClient.get(field).then((res) => {
            result[field.split('.')[1]] = JSON.parse(res)
        })
    }

    return result
}

const signInChat = async (props) => {
    const data = await getAllChats()
    var index = data.id.indexOf(props.chat_id)
    
    if (!data.members[index].includes(props.username)) {
        data.members[index].push(props.username)
        updateTable(data, 'chats')
    }
}


module.exports.getAllChats = getAllChats
module.exports.signInChat = signInChat
