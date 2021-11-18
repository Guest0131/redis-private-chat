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

// api/message/get_all_messages
router.get(
    '/get_all_messages',
    async (req, resp) => {

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
                await redisClient.set(field, JSON.stringify([])).then(()=> { 
                    console.log("Initialized or cleaned" + field) 
                });
            }
        } 
        
        for (var field of fields) {
            await redisClient.get(field).then((res) => {
                result[field.split(".")[1]] = JSON.parse(res)
            })
        }
        
        resp.status(201).json(refactorResultData(result))
    })

// api/message/get_all_chats
router.post(
    '/get_all_chats',
    async (req, res) => {

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
            "chats.members", "chats.keys"
        ];


        if (emptyData) {
            for (var field of fields) {
                await redisClient.set(field, JSON.stringify([])).then(()=> { 
                    console.log("Initialized or cleaned" + field) 
                });
            }
        } 
        
        for (var field of fields) {
            await redisClient.get(field).then((res) => {
                result[field.split('.')[1]] = res
            })
        }
        
        resp.status(201).json(refactorResultData(result))
    })


module.exports = router