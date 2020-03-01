const express = require('express')
const mongodb = require('../librairies/mongodb')
const encryption = require('../librairies/encryption')

const router = express.Router()

router.post('/', (req, res) => {
    if (req.body === undefined) {
        res.json({ error: 'Body not valid' })
        return
    }
    if (req.body.username === undefined || req.body.password === undefined) {
        res.json({ error: 'User informations not valid' })
        return
    }
    if (req.body.username === null || req.body.password === null) {
        res.json({ error: 'User informations not valid' })
        return
    }
    if (req.body.username.length <= 0 || req.body.password.length <= 0) {
        res.json({ error: 'Cannot work with empty credentials' })
        return
    }
    mongodb
        .authentication(req.body.username, req.body.password)
        .then(token => {
            res.json({ authenticated: true, token: token })
        })
        .catch(error => {
            if (error === true) {
                res.json({ authenticated: null, token: null })
                return
            }
            res.json({ authenticated: false, token: null })
        })
})

router.post('/check-token', (req, res) => {
    let token = req.headers.authorization
    if (token === undefined) {
        res.json({ valid: false })
        return
    }
    try {
        let decryptedToken = encryption.decrypt(token, process.env.ENCRYPTION_KEY)
        let user = JSON.parse(decryptedToken)
        if (user.token === undefined) {
            res.json({ valid: false })
            return
        }
        let username = user.token.username
        let password = encryption.decrypt(user.token.password, process.env.ENCRYPTION_KEY)
        if (username === undefined || password === undefined) {
            res.json({ valid: false })
            return
        }
        mongodb
            .authentication(username, password)
            .then(() => {
                res.json({ valid: true })
            })
            .catch(() => {
                res.json({ valid: false })
            })
    } catch (error) {
        res.json({ valid: false })
        return
    }
})

module.exports = router
