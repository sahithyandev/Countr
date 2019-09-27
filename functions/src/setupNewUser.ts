import * as functions from 'firebase-functions'

export const setupNewUser = functions.auth.user().onCreate((user) => {
    console.log('setup new user started')
    
    const admin = require('firebase-admin')
    
    admin.firestore().doc(`/users/${user.uid}`).set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        accept_sharing: true
    })
    
})