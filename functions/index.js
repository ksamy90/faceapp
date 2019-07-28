const functions = require('firebase-functions');
const admin = require('firebase-admin');

const app = require('express')();
admin.initializeApp();

const config = {
    apiKey: "AIzaSyBMZqMrjfew3khbjyRLdtmmCNKFLYDiTtM",
    authDomain: "design-6729e.firebaseapp.com",
    databaseURL: "https://design-6729e.firebaseio.com",
    projectId: "design-6729e",
    storageBucket: "design-6729e.appspot.com",
    messagingSenderId: "614975923009",
    appId: "1:614975923009:web:76d5b63eb6b6420a"
};

const firebase = require('firebase/app');
require('firebase/auth');
firebase.initializeApp(config);

app.get('/screams', (req, res) => {
    admin.firestore()
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(screams);
        })
        .catch(err => console.log(err));
});

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong' });
            console.log(err);
        });
});

// Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    // TODO: validate data
    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            return res
                .status(201)
                .json({ message: `user ${data.user.uid} signed up successfully`});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

exports.api = functions.https.onRequest(app);

// exports.api = functions.region('europe-west1').https.onRequest(app);
