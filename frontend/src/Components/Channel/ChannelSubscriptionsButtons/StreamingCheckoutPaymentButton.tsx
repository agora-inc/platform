import React, { useEffect, useState, FunctionComponent } from "react"
import { PaymentData } from "../../../Services/PaymentService";
import { User } from "../../../Services/UserService";
import { StreamingProductService, StreamingProduct } from "../../../Services/StreamingProductService"
import { CheckoutPaymentButton } from "./CheckoutPaymentButton";

interface Props {
    price_in_dollars: number;
    stripe_product_id: number;
    tier: "tier1" | "tier2";
    product_type: "subscription" | "credit";
    audience_size: "small" | "big";
    quantity: number
    channelId: number;
    user: User
    text?: string;
}

const StreamingCheckoutPaymentButton:FunctionComponent<Props> = (props) => {    
    const [tier,] = useState<Props["tier"]>(props.tier);
    const [audienceSize,] = useState<Props["audience_size"]>(props.audience_size);
    const [productType,] = useState<Props["product_type"]>(props.product_type);

    const [quantity,] = useState<PaymentData["quantity"]>(props.quantity);
    const [productId, setProductId] = useState<PaymentData["channelId"]>(0);
    const [channelId,] = useState(props.channelId);

    const [buttonText, setButtonText] = useState("")
    
    useEffect(() => {
        if (props.text){
            setButtonText(props.text)
        }
        StreamingProductService.getStreamingProductByFeatures(
            tier, audienceSize, productType, (data: {id: string}) => {
                console.log("Here is the answer to getStreamingProductByFeatures!", data)
                setProductId(Number(data.id));
                // If no price text, query price text automatically from DB
                if (!props.text){
                    StreamingProductService.getStreamingProductById(Number(data.id), 
                        (data: StreamingProduct) => {
                            if (data.product_type == "subscription"){
                                setButtonText(data.price_in_dollars + " $ / month")
                            } else if (data.product_type == "credit"){
                                setButtonText(data.price_in_dollars + " $ / credit")
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