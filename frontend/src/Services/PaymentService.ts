// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get } from "../Middleware/httpMiddleware";
import { ProductService } from "./ProductService";

export interface PaymentData {
    productId: number;
    quantity: number;
    channelId?: number;
    userId?: number
}

const createCheckoutSessionFromStreamingFeatures = (
    tier: "tier1" | "tier2", 
    productType: "subscription" | "credit",
    audSize: "small" | "big",
    quantity: number = 1, 
    channelId: number, 
    callback: any) => {
    if (quantity < 0){
        quantity = 1
    }
    // get product_id
    ProductService.getStreamingProductIdByFeatures(
        tier, audSize, productType, (res : {product_id : string}) => {
            createCheckoutSessionFromId(
                Number(res.product_id), quantity, channelId, () => {}
            )

        }
    )
};

const createCheckoutSessionFromId = (
    productId: number,
    quantity: number = 1, 
    channelId: number, 
    callback: any) => {
    if (quantity < 0){
        quantity = 1
    }
    get(
        `payment/create-checkout-session?productId=${productId}&quantity=${quantity}&channelId=${channelId}`, 
        callback);
};



const handleSuccessfulTransaction = (
    tier: string, 
    productType: "subscription" | "credit",
    audSize: "small" | "big", 
    quantity: number = 1, 
    channelId: number,
    checkoutSessionId: string
    ) => {
    
}

const handleFailedTransaction = (
    tier: string, 
    productType: "subscription" | "credit",
    audSize: "small" | "big", 
    quantity: number = 1, 
    channelId: number,
    checkoutSessionId: string
    ) => {
}


export const PaymentService = {
    // checkout sessions
    createCheckoutSessionFromId,
    createCheckoutSessionFromStreamingFeatures,

    // Post-transactions
    handleSuccessfulTransaction,
    handleFailedTransaction
};
