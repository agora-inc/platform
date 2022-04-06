import { get, post, del } from "../Middleware/httpMiddleware";

export interface ChannelSubscription {
  channelId: string;
  product_id: string;
  status: "active" | "checkout" | "cancelled" | "unpaid" | "interrupted";
  user_id: string;
}

const getActiveSubscriptionForChannel = (
  channelId: number,
  productId: number,
  callback: any
) => {
  get(
    `subscriptions/channel?channelId=${channelId}&productId=${productId}`,
    "",
    callback
  );
};

const getAllActiveSubscriptionsForChannel = (
  channelId: number,
  callback: any
) => {
  get(`subscriptions/channel/all?channelId=${channelId}`, "", callback);
};

// TODO: make POST or DELETE
const cancelSubscriptionForChannel = (
  channelId: number,
  productId: number,
  callback: any,
  token: string
) => {
  get(
    `subscriptions/channel/cancel?channelId=${channelId}&productId=${productId}`,
    token,
    callback
  );
};

// TODO: make POST or DELETE
const cancelAllSubscriptionsForChannel = (
  channelId: number,
  callback: any,
  token: string
) => {
  get(
    `subscriptions/channel/cancelall?channelId=${channelId}`,
    token,
    callback
  );
};

const ChannelSubscriptionIsActiveForChannel = (
  channelId: number,
  productId: number,
  callback: any
) => {
  getActiveSubscriptionForChannel(channelId, productId, (data: any) => {
    if (data.isArray()) {
      if (data.length > 0) {
        return true;
      }
    } else {
      return false;
    }
    callback();
  });
};

export const ChannelSubscriptionService = {
  getActiveSubscriptionForChannel,
  getAllActiveSubscriptionsForChannel,
  cancelSubscriptionForChannel,
  cancelAllSubscriptionsForChannel,
  ChannelSubscriptionIsActiveForChannel,
};
