const mongoose = require('mongoose')
const encryption = require('./encryption')

let userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    password: { type: String, required: true }
})
let user = new mongoose.model('user', userSchema)

module.exports = {
    authentication: (username, password) => {
        return new Promise((resolve, reject) => {
            mongoose
                .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    let query = user
                        .findOne({
                            username: username,
                            password: encryption.encrypt(password, process.env.ENCRYPTION_KEY)
                        })
                        .select({ username: 1, password: 1 })
                    query.exec((error, user) => {
                        mongoose.connection.close()
                        if (error) {
                            reject(error)
                            return
                        }
                        if (user === undefined || user === null) {
                            reject('User not found')
                            return
                        }
                        resolve(encryption.encrypt(JSON.stringify({token: {username: user.username, password: user.password}}), process.env.ENCRYPTION_KEY))
                    })
                })
                .catch(error => {
                    reject(true)
                    return
                })
        })
    }
}
