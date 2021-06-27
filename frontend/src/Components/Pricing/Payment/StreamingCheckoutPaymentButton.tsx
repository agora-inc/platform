import React, { useEffect, useState, FunctionComponent } from "react"
import { PaymentData } from "../../../Services/PaymentService";
import { ProductService, StreamingProduct, StreamingProductFeatures } from "../../../Services/ProductService"
import CheckoutPaymentButton from "./CheckoutPaymentButton";

interface Props extends StreamingProductFeatures{
    channelId: number;
    text?: string;
}

const StreamingCheckoutPaymentButton:FunctionComponent<Props> = (props) => {    
    const [tier,] = useState<Props["tier"]>(props.tier);
    const [audienceSize,] = useState<Props["audienceSize"]>(props.audienceSize);
    const [productType,] = useState<Props["productType"]>(props.productType);

    const [quantity,] = useState<PaymentData["quantity"]>(props.quantity);
    const [productId, setProductId] = useState<PaymentData["channelId"]>(0);
    const [channelId,] = useState(props.channelId);

    const [buttonText, setButtonText] = useState("")
    
    useEffect(() => {
        if (props.text){
            setButtonText(props.text)
        }
        ProductService.getStreamingProductIdByFeatures(
            tier, audienceSize, productType, (data: {id: string}) => {
                console.log("Here is the answer to getStreamingProductIdByFeatures!", data)
                setProductId(Number(data.id));
                // If no price text, query price text automatically from DB
                if (!props.text){
                    ProductService.getStreamingProductById(Number(data.id), 
                        (data: StreamingProduct) => {
                            if (data.productType == "subscription"){
                                setButtonText(data.priceInDollars + " $ / month")
                            } else if (data.productType == "credit"){
                                setButtonText(data.priceInDollars + " $ / credit")
                            }
                    })
                }
            }
        )
    });

    return (
        <CheckoutPaymentButton
            productId={productId!}
            quantity={quantity}
            channelId={channelId}
            text={buttonText}
        />
    );
}

export default StreamingCheckoutPaymentButton