// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5RpiWnBRLplw7IxoSTYJh9AMidFHXpVM",
    authDomain: "encodexa.firebaseapp.com",
    databaseURL: "https://encodexa-default-rtdb.firebaseio.com",
    projectId: "encodexa",
    storageBucket: "encodexa.appspot.com",
    messagingSenderId: "575353833546",
    appId: "1:575353833546:web:00e0f11b788ab801eebeb3"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase Database
  const database = firebase.database();
  