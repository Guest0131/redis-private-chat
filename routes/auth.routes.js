const { Router } = require('express')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const redisClient = require('../models/RedisClient');
const router = Router()


// /api/auth/register
router.post(
    '/register',
    [
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при регистрации"
                })
            }


            const { username, password } = req.body

            redisClient.get(username, function (err, reply) {
                if (err) {
                    return res.status(500).json({ message: 'Что пошло не так, попробуйте снова' })
                }
                else {
                    if (reply) return res.status(400).json({ message: "Пользователь с таким именем уже существует" })
                    else {
                        redisClient.set(username, bcrypt.hash(password, 12))

                        res.status(201).json({ message: "Пользователь создан" })
                    }
                }
            })


        } catch (err) {
            res.status(500).json({ message: 'Что пошло не так, попробуйте снова' })
        }
    })


// /api/auth/login
router.post(
    '/login',
    [
        check('username', 'Введите username').exists(),
        check('password', 'Введите пароль').exists(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при авторизации"
                })
            }

            const { username, password } = req.body

            redisClient.get(username, function (err, reply) {
                if (err) {
                    return res.status(500).json({ message: 'Что пошло не так, попробуйте снова' })
                }
                else {
                    if (reply) {
                        const isMatch = bcrypt.compare(password, reply)
                        if (!isMatch) {
                            return res.status(400).json({ message: 'Неверный пароль. Попробуйте снова!'})
                        }

                        const token = jwt.sign(
                            { username : username },
                            config.get('jwtSecret'),
                            { expiresIn : '1h' }
                        )

                        res.json({ token, username })

                    } else {
                        return res.status(400).json({ message: "Пользователь с таким данными не существует" })
                    }
                }
            })



        } catch (err) {
            res.status(500).json({ message: 'Что пошло не так, попробуйте снова' })
        }
    })
module.exports = router