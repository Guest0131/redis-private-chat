const { Router } = require('express')

const { getAllChats } = require('../libs/ChatsLib')
const { getAllMessages } = require('../libs/MessageLib')
const { refactorResultData, updateTable } = require('../libs/RefactorLib')

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
       
        var newId = 1;
        if (messages['id'].length > 0) {
            newId = Math.max.apply(null, messages['id']) + 1
        }

        const { text, owner, chat_id, ttl } = req.body

        console.log(messages)
        messages['id'].push(newId)
        messages['text'].push(text)
        messages['owner'].push(owner)
        messages['time_end'].push(Math.round(new Date().getTime() / 1000) + parseInt(ttl))
        messages['chat_id'].push(chat_id)

        await updateTable(messages, 'messages')

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