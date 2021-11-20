const config = require('config')
const redis = require('redis')
const promisifyRedis = require('promisify-redis')
const redisConfig = config.get('redis')

const redisClient = promisifyRedis(redis.createClient({
    host: redisConfig['host'] || 'localhost',
    port: redisConfig['port'] || 6379
}))

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

const updateTable = async (data, tableName) => {

    for (var k in data) {
        await redisClient.set(tableName + '.' + k, JSON.stringify(data[k])).then(() => {
            //console.log("Field " + k + " update")
        });
    }
}

const checkMessages = async (data) => {
    data = refactorResultData(data)

    var fields = [
        "id", "text", "owner",
        "time_end", "chat_id", "ttl"
    ]

    var result = {}
    for (var f of fields) {result[f] = []}

    for (var v of data) {
        if (v.time_end > Math.round(new Date().getTime() / 1000)) {
            for (var f of fields) { result[f].push(v[f]) }
        }
    }

    await updateTable(result, "messages")
    
    return result
}

module.exports.refactorResultData = refactorResultData
module.exports.updateTable        = updateTable
module.exports.checkMessages      = checkMessages