import { baseApiUrl } from "../config";
import axios from "axios";

const getAllQuestionsForStream = (args: {
  callback: any;
  streamId?: number;
  videoId?: number;
}) => {
  const url =
    args.streamId === undefined
      ? baseApiUrl + "/questions?videoId=" + args.videoId!.toString()
      : baseApiUrl + "/questions?streamId=" + args.streamId.toString();
  axios
    .get(url, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      args.callback(response.data);
    });
};

const askQuestion = (params: any, callback: any) => {
  axios
    .post(baseApiUrl + "/questions/ask", params, {
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const answerQuestion = (
  userId: number,
  questionId: number,
  content: string,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/questions/answer",
      { userId: userId, questionId: questionId, content: content },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const upvoteQuestion = (userId: number, questionId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/questions/upvote",
      { userId: userId, questionId: questionId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const downvoteQuestion = (
  userId: number,
  questionId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/questions/downvote",
      { userId: userId, questionId: questionId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const upvoteAnswer = (userId: number, answerId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/questions/answer/upvote",
      { userId: userId, answerId: answerId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const downvoteAnswer = (userId: number, answerId: number, callback: any) => {
  axios
    .post(
      baseApiUrl + "/questions/answer/downvote",
      { userId: userId, answerId: answerId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const removeQuestionUpvote = (
  userId: number,
  questionId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/questions/upvote/remove",
      { userId: userId, questionId: questionId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const removeQuestionDownvote = (
  userId: number,
  questionId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/questions/downvote/remove",
      { userId: userId, questionId: questionId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const removeAnswerUpvote = (
  userId: number,
  answerId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/questions/answer/upvote/remove",
      { userId: userId, answerId: answerId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
};

const removeAnswerDownvote = (
  userId: number,
  answerId: number,
  callback: any
) => {
  axios
    .post(
      baseApiUrl + "/questions/answer/downvote/remove",
      { userId: userId, answerId: answerId },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
    .then(function (response) {
      callback(response.data);
    });
  // .catch(function (error) {
  //   callback(false);
  // });
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
