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

////////////////////////////
// Streaming services
////////////////////////////
const StreamingService = {
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
    }
}

const ClappingService = {
    thankTheSpeaker: async (talk_id:string) =>{
        // Event triggered by updating isClapping to "true"
        let r1 = await db.collection('talk').doc(talk_id).update({isClapping: true, clapping_status: Math.floor(10000 + Math.random()*10000)});
        
        // 5sec later, back to "false" to clean event
        let r2 = setTimeout(
            () => {
                db.collection('talk').doc(talk_id).update({isClapping: false, clapping_status: Math.floor(10000 + Math.random()*10000)})
            }, 5000);
        },
    }

////////////////////////////
// Mic API calls
////////////////////////////
const MicRequestService = {
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
            MicRequestService.removeRequest(id)
        }, 5000)
    },
    removeRequest(id:string) {
        db.collection('requests').doc(id).delete();
    },
}

////////////////////////////
// SLIDES API CALLs
////////////////////////////
const SlidesService = {
    // (For presenter only: updates userId of presenter)
    slideShare: async(user_id:string, talk_id:string) => {
        let req = await db.collection('slide').where('talk_id', '==', talk_id).get()
        console.log(req)
        // if there is a slide sharing
        if(req.size > 0) {
            // @ts-ignore
            if(req.docs[0].user_id !== user_id){
                await db.collection('slide').doc(req.docs[0].id).update({pageNumber: 1,user_id});
                req = await db.collection('slide').where('talk_id', '==', talk_id).get()
                return req.docs[0]
            }
            return req.docs[0]
        }
        return await db.collection('slide').add({pageNumber: 1, talk_id, user_id});
    },

    // (For other people)
    slideNavigate: async (slide_id:string, pageNumber:number=1) => {
        await db.collection('slide').doc(slide_id).update({pageNumber});
    },
    slideStop: async (id:string) => {
        await db.collection('slide').doc(id).delete();
    },
}

export { firebase, db, StreamingService, MicRequestService, SlidesService, ClappingService };