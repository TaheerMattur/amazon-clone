import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBAAUGcFu7azUhmU1wD_7RvGonaXJosn8k",
  authDomain: "clone-e74d0.firebaseapp.com",
  projectId: "clone-e74d0",
  storageBucket: "clone-e74d0.appspot.com",
  messagingSenderId: "198605537294",
  appId: "1:198605537294:web:63d386225dbeb1bd247c5f"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db =firebaseApp.firestore();

  const auth = firebase.auth();

  export {db , auth };