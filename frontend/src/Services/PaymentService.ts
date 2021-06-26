// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get } from "../Middleware/httpMiddleware";

export interface PaymentData {
    plan: "tier1" | "tier2";
    mode: "sub";
    audSize: "small" | "big";
    quantity: number;
    channelId: number;
  }

const createCheckoutSession = (
    plan: string, 
    mode: "credits" | "sub", 
    audSize: "small" | "big", 
    quantity: number = 1, 
    channelId: number, 
    callback: any) => {
    if (quantity < 0){
        quantity = 1
    }
    if (plan == "tier1" || plan == "tier2"){
    get(
        `payment/create-checkout-session?plan=${plan}&mode=${mode}&audSize=${audSize}&quantity=${quantity}&channelId=${channelId}`, 
        callback);
    }
    else {
        return "createCheckoutSession: error occured; plan has an invalid format."
    }
};

// const handleSuccessfulTransaction = (
//     plan: string, 
//     mode: "credits" | "sub", 
//     audSize: "small" | "big", 
//     quantity: number = 1, 
//     channelId: number,
//     checkoutSessionId: string
//     ) => {
    
// }

// const handleFailedTransaction = (
//     plan: string, 
//     mode: "credits" | "sub", 
//     audSize: "small" | "big", 
//     quantity: number = 1, 
//     channelId: number,
//     checkoutSessionId: string
//     ) => {

// }


export const PaymentService = {
    // stream credits
    createCheckoutSession,
    // Post-transactions
    // handleSuccessfulTransaction,
    // handleFailedTransaction
};
