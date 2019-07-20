import * as functions from 'firebase-functions'

export const setupNewUser = functions.auth.user().onCreate((user) => {
    console.log("function started")
    const moment = require('moment')
    const admin = require('firebase-admin')
    admin.initializeApp()
        
        admin.firestore().collection('countdowns').doc().set({
            owner: user.uid,
            title: "This is a Countdown",
            description: "Its a automated countdown",
            datetime: moment().minute(moment().minute() + 30).format(),
            category: '__default__'
        }).then(() => {
            console.log("countdown added")
        })

        admin.firestore().collection('notes').doc().set({
            addedTime: moment().format(),
            text: "This is a Note",
            owner: user.uid,
            isStarred: false,
        }).then(() => {
            console.log("note added")
        })
})