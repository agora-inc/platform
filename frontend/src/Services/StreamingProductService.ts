// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";

export interface StreamingProductFeatures {
    tier: "tier1" | "tier2";
    productType: "subscription" | "credit";
    audienceSize: "small" | "big";
    quantity: number
  }

export interface StreamingProduct extends StreamingProductFeatures {
    priceInDollars: number;
    description: "tier1" | "tier2";
    stripeProductId: number;
}

const getProductById = (
    productId: number,
    callback: any) => {
  get(`products?id=${productId}`, callback);
};

const getStreamingProductById = (
    productId: number,
    callback: any) => {
  get(`products/streaming?id=${productId}`, callback);
};

const getStreamingProductIdByFeatures = (
    tier: "tier1" | "tier2",
    audienceSize: "small" | "big",
    product_type: "subscription" | "credit",
    callback: any) => {
  get(`products/streaming?tier=${tier}&audienceSize=${audienceSize}&productType=${product_type}`, callback);
};


export const StreamingProductService = {
    getProductById,
    // Streaming products
    getStreamingProductById,
    getStreamingProductIdByFeatures,

    // cancelling products
};
