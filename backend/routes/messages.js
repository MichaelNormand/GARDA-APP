const axios = require('axios').default
const express = require('express')
const encryption = require('../librairies/encryption')
const mongodb = require('../librairies/mongodb')
const router = express.Router()

router.post('/send', (req, res) => {
    if (req.body === undefined || req.body === null) {
        res.json({ error: true })
        return
    }
    let token = req.headers.authorization
    if (token === undefined) {
        res.json({ error: true })
        return
    }
    try {
        let decryptedToken = encryption.decrypt(token, process.env.ENCRYPTION_KEY)
        let user = JSON.parse(decryptedToken)
        if (user.token === undefined) {
            res.json({ error: true })
            return
        }
        let username = user.token.username
        let password = encryption.decrypt(user.token.password, process.env.ENCRYPTION_KEY)
        if (username === undefined || password === undefined) {
            res.json({ error: true })
            return
        }
        mongodb
            .authentication(username, password)
            .then(() => {
                let origin = req.body.origin
                let targets = req.body.target
                let message = req.body.message
                if (origin === undefined || targets === undefined || message === undefined || targets.length <= 0) {
                    res.json({ error: true })
                    return
                }
                let body = undefined
                if (targets.length > 1) {
                    let destinations = targets.map((target, index) => {
                        return { '@id': 'target-' + index, '@dest': target.value }
                    })
                    body = {
                        '@id': 'Michael001',
                        from: '+' + origin,
                        broadcast: {
                            dest: destinations
                        },
                        content: {
                            '@media': 'SMS',
                            '@type': 'text',
                            '#text': message
                        }
                    }
                } else {
                    body = {
                        '@id': 'Michael001',
                        from: '+' + origin,
                        to: '+' + targets[0].value,
                        content: {
                            '@media': 'SMS',
                            '@type': 'text',
                            '#text': message
                        }
                    }
                }
                axios
                    .post('https://api.somum.com/client_test/api/v1/messaging', body, {
                        headers: {
                            Authorization: 'Basic ' + Buffer.from(`${process.env.GARDA_USERNAME}:${process.env.GARDA_PASSWORD}`).toString('base64'),
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if ((response.data.broadcastrc !== undefined && response.data.broadcastrc.length <= 0) || (response.data.result !== undefined && response.data.result['@statustext'] === 'errError')) {
                            res.json({ error: true })
                            return
                        }
                        res.json({ error: false })
                    })
                    .catch(error => {
                        res.json({ error: true })
                    })
            })
            .catch(() => {
                res.json({ error: true, tokenValid: false })
            })
    } catch (error) {
        res.json({ error: true })
        return
    }
})

router.post('/', (req, res) => {
    if (req.body === undefined || req.body === null) {
        res.json({ error: true })
        return
    }
    let token = req.headers.authorization
    if (token === undefined) {
        res.json({ error: true })
        return
    }
    try {
        let decryptedToken = encryption.decrypt(token, process.env.ENCRYPTION_KEY)
        let user = JSON.parse(decryptedToken)
        if (user.token === undefined) {
            res.json({ error: true })
            return
        }
        let username = user.token.username
        let password = encryption.decrypt(user.token.password, process.env.ENCRYPTION_KEY)
        if (username === undefined || password === undefined) {
            res.json({ error: true })
            return
        }
        mongodb
            .authentication(username, password)
            .then(() => {
                // Getting messages
                let date = req.body.date.split('-')
                let id = req.body.id
                let phone = req.body.phone
                let dateString = date[0] + date[1].padStart(2, '0') + date[2].padStart(2, '0')
                if (date === undefined || id === undefined || phone === undefined) {
                    res.json({ error: true })
                    return
                }
                axios
                    .get(`https://api.somum.com/client_test/api/v1/messaging?utc=${dateString}&id=${id}&nbr=%2b${phone}`, {
                        headers: {
                            Authorization: 'Basic ' + Buffer.from(`${process.env.GARDA_USERNAME}:${process.env.GARDA_PASSWORD}`).toString('base64')
                        }
                    })
                    .then(response => {
                        if (response.data !== undefined && response.data.activityrpt !== undefined) {
                            if (!Array.isArray(response.data.activityrpt)) {
                                res.json([response.data.activityrpt])
                                return
                            }
                            res.json(response.data.activityrpt)
                            return
                        }
                        if (response.status === 200) {
                            res.json([])
                            return
                        }
                        res.json({ error: true })
                    })
                    .catch(error => {
                        res.json({ error: true })
                    })
            })
            .catch(() => {
                res.json({ error: true, tokenValid: false })
            })
    } catch (error) {
        res.json({ error: true })
        return
    }
})

module.exports = router
