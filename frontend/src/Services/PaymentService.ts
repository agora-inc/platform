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

const getCheckoutSession = (
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
        `/payment/create-checkout-session?plan=${plan}&mode=${mode}&audSize=${audSize}&quantity=${quantity}&channelId=${channelId}`, 
        callback);
    }
    else {
        return "getCheckoutSession: error occured; plan has an invalid format."
    }
};

export const PaymentService = {
    // stream credits
    getCheckoutSession
};

// plan = request.args.get("plan") # = tier1 and tier2
// mode = request.args.get("mode") # = 'credits' or 'sub'
// aud_size = request.args.get("audienceSize")
// channel_name = request.args.get("channel_name")