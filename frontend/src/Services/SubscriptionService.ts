// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";


export interface SubscriptionService {
    priceInDollars: number;
    description: "tier1" | "tier2";
    stripeProductId: number;
}


const addInitiatedSubscription = (
    productId: number,
    userId: number,
    checkoutSessionId: number,
    quantity: number,
    callback: any) => {

    };
    

const getActiveSubscription = (

    ) => {
        
    };

const upgradeSubscription = (

    ) => {
        
    };

const cancelSubscription = (

) => {
    
}



// const getProductById = (
//     productId: number,
//     callback: any) => {
//   get(`/products?id=${productId}`, callback);
// };

// const getStreamingProductById = (
//     productId: number,
//     callback: any) => {
//   get(`products/streaming?id=${productId}`, callback);
// };

// const getStreamingProductIdByFeatures = (
//     tier: "tier1" | "tier2",
//     audienceSize: "small" | "big",
//     product_type: "subscription" | "credit",
//     callback: any) => {
//   get(`products/streaming?tier=${tier}&audienceSize=${audienceSize}&productType=${product_type}`, callback);
// };
    
export const SubscriptionService = {
    // Backend method creation
    addInitiatedSubscription,
    // subscription handling
    getActiveSubscription,
    upgradeSubscription,
    cancelSubscription
};
