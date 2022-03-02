import { callbackify } from "util";
import { baseApiUrl } from "../config";
import { get, post, del } from "../Middleware/httpMiddleware";

const getAllQuestionsForStream = (args: {
  callback: any;
  streamId?: number;
  videoId?: number;
}) => {
  const url =
    args.streamId === undefined
      ? baseApiUrl + "/questions?videoId=" + args.videoId!.toString()
      : baseApiUrl + "/questions?streamId=" + args.streamId.toString();
  get(url, "", args.callback);
};

const askQuestion = (params: any, callback: any, token: string) => {
  post("/questions/ask", params, token, callback);
};

const answerQuestion = (
  userId: number,
  questionId: number,
  content: string,
  callback: any,
  token: string
) => {
  post("/questions/answer", { userId, questionId, content }, token, callback);
};

const upvoteQuestion = (
  userId: number,
  questionId: number,
  callback: any,
  token: string
) => {
  post("/questions/upvote", { userId, questionId }, token, callback);
};

const downvoteQuestion = (
  userId: number,
  questionId: number,
  callback: any,
  token: string
) => {
  post("/questions/downvote", { userId, questionId }, token, callback);
};

const upvoteAnswer = (
  userId: number,
  answerId: number,
  callback: any,
  token: string
) => {
  post("/questions/answer/upvote", { userId, answerId }, token, callback);
};

const downvoteAnswer = (
  userId: number,
  answerId: number,
  callback: any,
  token: string
) => {
  post("/questions/answer/downvote", { userId, answerId }, token, callback);
};

const removeQuestionUpvote = (
  userId: number,
  questionId: number,
  callback: any,
  token: string
) => {
  post("/questions/upvote/remove", { userId, questionId }, token, callback);
};

const removeQuestionDownvote = (
  userId: number,
  questionId: number,
  callback: any,
  token: string
) => {
  post("/questions/downvote/remove", { userId, questionId }, token, callback);
};

const removeAnswerUpvote = (
  userId: number,
  answerId: number,
  callback: any,
  token: string
) => {
  post(
    "/questions/answer/upvote/remove",
    { userId, answerId },
    token,
    callback
  );
};

const removeAnswerDownvote = (
  userId: number,
  answerId: number,
  callback: any,
  token: string
) => {
  post(
    "/questions/answer/downvote/remove",
    { userId, answerId },
    token,
    callback
  );
};

export const QandAService = {
  getAllQuestionsForStream,
  askQuestion,
  answerQuestion,
  upvoteQuestion,
  downvoteQuestion,
  upvoteAnswer,
  downvoteAnswer,
  removeQuestionUpvote,
  removeQuestionDownvote,
  removeAnswerUpvote,
  removeAnswerDownvote,
};
