import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyB0rv0QDGWy7Gno284IybZVNB9BDJzSEPs",
    authDomain: "chatgpt-messenger-687ca.firebaseapp.com",
    projectId: "chatgpt-messenger-687ca",
    storageBucket: "chatgpt-messenger-687ca.appspot.com",
    messagingSenderId: "849840061781",
    appId: "1:849840061781:web:24cefb4f85027cf46643dc"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };