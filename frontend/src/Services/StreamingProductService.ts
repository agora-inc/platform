// import { baseApiUrl } from "../config";
// import axios from "axios";
// import { Topic } from "../Services/TopicService";
import { get, post } from "../Middleware/httpMiddleware";


export type StreamingProduct =  {
    price_in_dollars: number;
    stripe_product_id: number;
    tier: "tier1" | "tier2";
    product_type: "subscription" | "credit";
    id: number;
    audience_size: "small" | "big";
    quantity: number
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

const getStreamingProductByFeatures = (
    tier: string,
    audienceSize: string,
    product_type: string,
    callback: any) => {
    get(`products/streaming?tier=${tier}&audienceSize=${audienceSize}&productType=${product_type}`, callback);
};

const getAllStreamingProducts = (callback: any) => {
  get(`products/streaming/all`, callback);
}

export const StreamingProductService = {
    getProductById,
    // Streaming products
    getStreamingProductById,
    getStreamingProductByFeatures,
    getAllStreamingProducts,
    // cancelling products
};
