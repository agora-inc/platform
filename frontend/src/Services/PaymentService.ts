// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";
import { StreamingProductService } from "./StreamingProductService";

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
    userId: number,
    quantity: number = 1, 
    channelId: number, 
    callback: any) => {
    if (quantity < 0){
        quantity = 1
    }
    // get product_id
    StreamingProductService.getStreamingProductIdByFeatures(
        tier, audSize, productType, (res : {product_id : string}) => {
            createCheckoutSessionFromId(
                Number(res.product_id), userId, quantity, channelId, () => {}
            )

        }
    )
};

const createCheckoutSessionFromId = (
    productId: number,
    userId: number,
    quantity: number = 1, 
    channelId: number, 
    callback: any) => {
    // TODO: generalisation for later:
    // productClass = products.getProductlassFromId(product_id)
    var productClass = "channelSubscription"
    if (productClass == "channelSubscription"){
        if (quantity < 0){
            quantity = 1
        }
        get(
            `payment/create-checkout-session?productId=${productId}&quantity=${quantity}&channelId=${channelId}&userId=${userId}`, 
            callback);
        }
};

const storeCheckoutSessionId = (
    productId: number,
    userId: number,
    checkoutSessionId: number,
    data: any,
    callback: any) => {
    // if its a subscription, we create a line in DB. Else, nothing
    post("payment/handlecheckout",
            {   productId: productId,
                userId: userId,
                checkoutSessionId: checkoutSessionId,
                data: data
            }, () => {
                callback()
            }
        )
};


export const PaymentService = {
    // checkout sessions
    storeCheckoutSessionId,
    createCheckoutSessionFromId,
    createCheckoutSessionFromStreamingFeatures,
}
