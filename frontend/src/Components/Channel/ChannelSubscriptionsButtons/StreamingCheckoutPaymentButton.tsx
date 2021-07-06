import React, { useEffect, useState, FunctionComponent } from "react"
import { PaymentData } from "../../../Services/PaymentService";
import { User } from "../../../Services/UserService";
import { StreamingProductService, StreamingProduct, StreamingProductFeatures } from "../../../Services/StreamingProductService"
import CheckoutPaymentButton from "./CheckoutPaymentButton";

interface Props extends StreamingProductFeatures{
    channelId: number;
    user: User
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
        StreamingProductService.getStreamingProductIdByFeatures(
            tier, audienceSize, productType, (data: {id: string}) => {
                console.log("Here is the answer to getStreamingProductIdByFeatures!", data)
                setProductId(Number(data.id));
                // If no price text, query price text automatically from DB
                if (!props.text){
                    StreamingProductService.getStreamingProductById(Number(data.id), 
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
            userId={props.user.id}
            productId={productId!}
            quantity={quantity}
            channelId={channelId}
            text={buttonText}
        />
    );
}

export default StreamingCheckoutPaymentButton