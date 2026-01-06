// Require Firebase SDK
const firebase = require("firebase/app");
require("firebase/firestore");

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOrQCkN2KmbPvaBqH8cq0FbzelJcRDLyM",
  authDomain: "sawit-website.firebaseapp.com",
  projectId: "sawit-website",
  storageBucket: "sawit-website.appspot.com",
  messagingSenderId: "83313894601",
  appId: "1:83313894601:web:e244f4377fbe7ee1895918",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to Firestore
const db = firebase.firestore();

// Function to count and save visitors
function countAndSaveVisitor() {
  const currentDate = new Date().toISOString().split("T")[0];
  const countViewersCollection = db.collection("countViewers");
  const todayDocument = countViewersCollection.doc(currentDate);

  return db.runTransaction(async (transaction) => {
    const docSnapshot = await transaction.get(todayDocument);

    if (!docSnapshot.exists) {
      transaction.set(todayDocument, { count: 1, date: currentDate });
    } else {
      const newCount = docSnapshot.data().count + 1;
      transaction.update(todayDocument, { count: newCount });
    }

    return Promise.resolve();
  });
}

// Call the function to count and save visitors
countAndSaveVisitor()
  .then(() => {
    console.log("Visitor counted and saved.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
