// import * as functions from 'firebase-functions'
import { sendMail } from "./sendMail"
import { setupNewUser } from './setupNewUser'

// exports.sendMail = functions.https.onRequest((request, response) => {
//     sendMail.handler(request, response)
// })
// // Check this function before deploying
// exports.setupNewUser = functions.auth.user().onCreate((user, context) => {
//     setupNewUser.handler(user)
// })

module.exports = {
    sendMail,
    setupNewUser
}