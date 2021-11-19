const { Router } = require('express')
const bcrypt = require('bcryptjs')

const config = require('config')
const redis = require('redis')
const promisifyRedis = require('promisify-redis')
const redisConfig = config.get('redis')

const redisClient = promisifyRedis(redis.createClient({
    host: redisConfig['host'] || 'localhost',
    port: redisConfig['port'] || 6379
}))


const router = Router()

const refactorResultData = (data) => {
    var result = []
    for (var [i, v] of data['id'].entries()) {
        var tmpData = {}
        for (var k in data) {
            tmpData[k] = data[k][i]
        }
        result.push(tmpData)
    }

    return result
}

async function updateTable(data, tableName) {

    for (var k in data) {
        await redisClient.set(tableName + '.' + k, JSON.stringify(data[k])).then(() => {
            console.log("Field " + k + " update")
        });
    }
}

async function getAllMessages(req, resp) {
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
            "messages.time_send", "messages.chat_id", "messages.ttl"
        ];


        if (emptyData) {
            for (var field of fields) {
                await redisClient.set(field, JSON.stringify([])).then(() => {
                    console.log("Initialized or cleaned" + field)
                });
            }
        }

        for (var field of fields) {
            await redisClient.get(field).then((resul) => {
                result[field.split(".")[1]] = JSON.parse(resul)
            })
        }

        return result
}

async function getAllChats(req, res) {
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


// api/message/get_all_messages
router.post(
    '/get_all_messages',
    async (req, resp) => {
        var result = await getAllMessages(req, resp)
        resp.status(201).json(refactorResultData(result))
    })



// api/message/get_all_chats
router.post(
    '/get_all_chats',
    async (req, resp) => {
        var result = await getAllChats(req, resp)
        resp.status(201).json(refactorResultData(result))
    })


//api/message/send_message
router.post(
    '/send_message',
    async (req, res) => {
        var messages = await getAllMessages(req, res)
        console.log(messages)
        // var newId = 1;
        // if (messages['id'].length > 0) {
        //     newId = Math.max.apply(null, messages['id']) + 1
        // }

        // const { text, owner, chat_id, ttl } = req.body


        // messages['id'].push(newId)
        // messages['text'].push(text)
        // messages['owner'].push(owner)
        // messages['time_send'].push(new Date().toISOString())
        // messages['chat_id'].push(chat_id)
        // messages['ttl'].push(ttl)

        // await updateTable(messages, 'messages')

        res.status(201).json()
    }
)


//api/message/create_chat
router.post(
    '/create_chat',
    async (req, res) => {
        var chats = await getAllChats(req, res)
        var newId = 1;
        if (chats['id'].length > 0) {
            newId = Math.max.apply(null, chats['id']) + 1
        }

        const { chatName, chatOwner } = req.body

        chats['id'].push(newId)
        chats['name'].push(chatName)
        chats['owner'].push(chatOwner)
        chats['members'].push([chatOwner])
        chats['key'].push(
            bcrypt.hashSync(chatName + chatOwner + new Date().toISOString(), 12)
        )

        await updateTable(chats, 'chats')

        res.status(201).json()
    }
)

module.exports = router