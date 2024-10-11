const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK with your service account key
const serviceAccount = require('./stitch-index-d792a-firebase-adminsdk-417ek-d08bc2b69e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load the JSON data
const data = require('./paitents.json');

// Function to import data
async function importData() {
    const batch = db.batch();
    const patientsRef = db.collection('Patients');

    for (const [id, patient] of Object.entries(data.patients)) {
        const docRef = patientsRef.doc(id);
        batch.set(docRef, patient);
    }

    await batch.commit();
    console.log('Data successfully imported!');
}

importData();
