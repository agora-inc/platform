import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDf4pkxr-uZUQuuQvU3uGmvFdEt4q3a2io",
    authDomain: "chat-socket-3ccd0.firebaseapp.com",
    projectId: "chat-socket-3ccd0",
    storageBucket: "chat-socket-3ccd0.appspot.com",
    messagingSenderId: "141045185794",
    appId: "1:141045185794:web:93457507b92051b8c1961b",
    measurementId: "G-J1Z8VWQ391"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const API = {
    startSeminar: async (talk_id:string, data:any) => {
        // NOT_STARTED/STARTED/ENDED
        let doc = await db.collection('talk').doc(talk_id).get()
        if(!doc.exists){
            data.status = 'NOT_STARTED'
            data.isClapping = false
            await db.collection('talk').doc(talk_id).set(data);
            doc = await db.collection('talk').doc(talk_id).get()
        }
        let r = await db.collection('talk').doc(talk_id).update({status: 'STARTED'});
        return true
    },
    endSeminar: async (talk_id:string) => {
        let doc = await db.collection('talk').doc(talk_id).get()
        if(!doc.exists){
            return
        }
        let r = await db.collection('talk').doc(talk_id).update({status: 'ENDED'});
        return true
    },
    thankTheSpeaker: async (talk_id:string, value=true) =>{
        let r = await db.collection('talk').doc(talk_id).update({isClapping: value, clapping_status: Math.floor(10000 + Math.random()*10000)});
    },
    requestMic: async (talk_id:string, user_id:string, user_name:string) => {
        let req = await db.collection('requests').where('requester_id', '==', user_id).get()
        if(req.size > 0) {
            return false
        }
        let data = {
            type: 'mic',
            talk_id,
            requester_id: user_id,
            requester_name: user_name,
            status: 'REQUESTED'
        }
        let r = await db.collection('requests').add(data);
        return true
    },
    grantRequest: async (id:string, value:boolean) => {
        if(value){
            await db.collection('requests').doc(id).update({status: 'GRANTED'});
            return
        }
        await db.collection('requests').doc(id).update({status: 'DENIED'});
        setTimeout(()=>{
            API.removeRequest(id)
        }, 5000)
    },
    removeRequest(id:string){
        console.log(id, 'rem')
        db.collection('requests').doc(id).delete();
    }
}

export { firebase, db, API };