import React, { Component, useEffect, useState } from "react";
import { Box, Text } from "grommet";
import { QandAService } from "../../../Services/QandAService";
import { UserService, User } from "../../../Services/UserService";
import { Add, Refresh } from "grommet-icons";
import Loading from "../../Core/Loading";
import LatexInput from "../ChatBox/LatexInput";
import Identicon from "react-identicons";
// Choose other components
// import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import "../../../Styles/q-and-a.css";
import { InlineMath } from "react-katex";
import { useStore } from "../../../store";
import { useAuth0 } from "@auth0/auth0-react";

type Answer = {
  id: number;
  content: string;
  username: string;
  posted_at: Date;
  question_id: number;
  score: number;
  upvoters: string[];
  downvoters: string[];
};

type Question = {
  id: number;
  content: string;
  username: string;
  posted_at: Date;
  stream_id: number;
  score: number;
  answers: Answer[];
  upvoters: string[];
  downvoters: string[];
};

interface Props {
  streamer: boolean;
  streamId?: number;
  videoId?: number;
}

interface State {
  questions: Question[];
  sortBy: string;
  loading: boolean;
  user: User | null;
  writingQuestion: boolean;
  answeringQuestion: Question | null;
}

export const QandA = (props: Props) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState("top");
  const [loading, setLoading] = useState(true);
  const [writingQuestion, setWritingQuestion] = useState(false);
  const [answeringQuestion, setAnsweringQuestion] = useState<Question | null>(
    null
  );

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (writingQuestion || answeringQuestion) {
      document
        .getElementById("latex-input")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [writingQuestion, answeringQuestion]);

  const fetchQuestions = () => {
    setLoading(true);
    if (props.streamId) {
      QandAService.getAllQuestionsForStream({
        callback: (questions: Question[]) => {
          setQuestions(questions);
          setLoading(false);
        },
        streamId: props.streamId,
      });
    } else {
      QandAService.getAllQuestionsForStream({
        callback: (questions: Question[]) => {
          setQuestions(questions);
          setLoading(false);
        },
        videoId: props.videoId,
      });
    }
  };

  const onNewClicked = () => {
    setWritingQuestion(true);
  };

  const onAnswerClicked = (question: Question) => {
    setWritingQuestion(false);
    setAnsweringQuestion(question);
  };

  const compareQuestionsByDate = (a: Question, b: Question) => {
    if (a.posted_at < b.posted_at) {
      return 1;
    }
    if (a.posted_at > b.posted_at) {
      return -1;
    }
    return 0;
  };

  const compareQuestionsByScore = (a: Question, b: Question) => {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  };

  const sortQuestions = () => {
    return sortBy === "top"
      ? questions.sort(compareQuestionsByScore)
      : questions.sort(compareQuestionsByDate);
  };

  const onUpvoteQuestionClicked = async (question: Question) => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    question.downvoters.includes(user.username)
      ? QandAService.removeQuestionDownvote(
          user.id,
          question.id,
          setQuestions,
          token
        )
      : question.upvoters.includes(user.username)
      ? QandAService.removeQuestionUpvote(
          user.id,
          question.id,
          setQuestions,
          token
        )
      : QandAService.upvoteQuestion(user.id, question.id, setQuestions, token);
  };

  const onDownVoteQuestionClicked = async (question: Question) => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    question.upvoters.includes(user.username)
      ? QandAService.removeQuestionUpvote(
          user.id,
          question.id,
          setQuestions,
          token
        )
      : question.downvoters.includes(user.username)
      ? QandAService.removeQuestionDownvote(
          user.id,
          question.id,
          setQuestions,
          token
        )
      : QandAService.downvoteQuestion(
          user.id,
          question.id,
          setQuestions,
          token
        );
  };

  const onUpvoteAnswerClicked = async (answer: Answer) => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    answer.downvoters.includes(user.username)
      ? QandAService.removeAnswerDownvote(
          user.id,
          answer.id,
          setQuestions,
          token
        )
      : answer.upvoters.includes(user.username)
      ? QandAService.removeAnswerUpvote(user.id, answer.id, setQuestions, token)
      : QandAService.upvoteAnswer(user.id, answer.id, setQuestions, token);
  };

  const onDownVoteAnswerClicked = async (answer: Answer) => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    answer.upvoters.includes(user.username)
      ? QandAService.removeAnswerUpvote(user.id, answer.id, setQuestions, token)
      : answer.downvoters.includes(user.username)
      ? QandAService.removeAnswerDownvote(
          user.id,
          answer.id,
          setQuestions,
          token
        )
      : QandAService.downvoteAnswer(user.id, answer.id, setQuestions, token);
  };

  const onSubmitClicked = async (content: string) => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    const params = props.streamId
      ? {
          userId: user.id,
          content: content,
          streamId: props.streamId,
        }
      : {
          userId: user.id,
          content: content,
          videoId: props.videoId,
        };
    writingQuestion
      ? QandAService.askQuestion(
          params,
          (questions: Question[]) => {
            setQuestions(questions);
            setWritingQuestion(false);
            setAnsweringQuestion(null);
          },
          token
        )
      : QandAService.answerQuestion(
          user.id,
          answeringQuestion!.id,
          content,
          (questions: Question[]) => {
            setQuestions(questions);
            setWritingQuestion(false);
            setAnsweringQuestion(null);
          },
          token
        );
  };

  const renderQuestionOrAnswerContent = (content: string) => {
    if (!content.includes("$")) {
      return (
        <Text size="18px" weight="bold">
          {content}
        </Text>
      );
    } else {
      const textArr = content.split("$");
      return (
        <Box
          //   height="100%"
          direction="row"
          wrap
          align="center"
          style={{
            overflowWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          {textArr.map((textElement: string, index) => {
            if (index % 2 == 0) {
              return (
                <Text
                  color="black"
                  style={{
                    marginLeft: 3,
                    marginRight: 3,
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                  size="18px"
                >
                  {textElement}
                </Text>
              );
            } else {
              if (textElement != "" && index != textArr.length - 1) {
                return <InlineMath math={textElement} />;
              }
            }
          })}
        </Box>
      );
    }
  };

  const renderQuestion = (question: Question) => {
    const upvoteColor =
      user && question.upvoters.includes(user.username) ? "#61EC9F" : "black";
    const downvoteColor =
      user && question.downvoters.includes(user.username) ? "#61EC9F" : "black";
    return (
      <Box>
        <Box direction="row" justify="between" align="center" id="question">
          <Box direction="row" gap="small">
            {user && (
              <Box
                height="100%"
                justify="between"
                align="center"
                pad="none"
                margin="none"
              >
                {/*
                <CaretUpOutlined
                  style={{
                    fontSize: 35,
                    marginTop: -5,
                    marginBottom: 5,
                    color: upvoteColor,
                  }}
                  onClick={() => onUpvoteQuestionClicked(question)}
                />
                <CaretDownOutlined
                  style={{ fontSize: 35, color: downvoteColor }}
                  onClick={() => onDownVoteQuestionClicked(question)}
                /> */}
              </Box>
            )}
            <Box>
              <Box direction="row" gap="small">
                <Box align="center" height="100%" justify="between">
                  <Text size="20px" weight="bold" margin="none">
                    {question.score}
                  </Text>
                  <Text size="14px" color="#979797" margin="none">
                    votes
                  </Text>
                </Box>
                <Box align="center" height="100%" justify="between">
                  <Text size="20px" weight="bold" margin="none">
                    {question.answers.length}
                  </Text>
                  <Text size="14px" color="#979797" margin="none">
                    answers
                  </Text>
                </Box>
                <Box height="100%" justify="between">
                  <Identicon string={question.username} size={22} />
                  <Text size="14px" weight="bold">
                    {question.username}
                  </Text>
                </Box>
              </Box>
              <Box>{renderQuestionOrAnswerContent(question.content)}</Box>
            </Box>
          </Box>
          {user && (
            <Box
              className="hides"
              direction="row"
              width="100px"
              height="40px"
              round="small"
              background="#61EC9F"
              margin="none"
              justify="center"
              align="center"
              gap="small"
              onClick={() => onAnswerClicked(question)}
              focusIndicator={false}
            >
              <Text color="white" weight="bold">
                Answer
              </Text>
            </Box>
          )}
        </Box>
        <Box
          margin={{ left: "xlarge", top: "small" }}
          direction="column"
          gap="small"
        >
          {question.answers.map((answer) => renderAnswer(answer))}
        </Box>
      </Box>
    );
  };

  const renderAnswer = (answer: Answer) => {
    const upvoteColor =
      user && answer.upvoters.includes(user.username) ? "#61EC9F" : "black";
    const downvoteColor =
      user && answer.downvoters.includes(user.username) ? "#61EC9F" : "black";
    return (
      <Box direction="row" gap="small">
        {user && (
          <Box
            height="100%"
            justify="between"
            align="center"
            pad="none"
            margin="none"
          >
            {/* 
            <CaretUpOutlined
              style={{
                fontSize: 35,
                marginTop: -5,
                marginBottom: 5,
                color: upvoteColor,
              }}
              onClick={() => onUpvoteAnswerClicked(answer)}
            />
            <CaretDownOutlined
              style={{ fontSize: 35, color: downvoteColor }}
              onClick={() => onDownVoteAnswerClicked(answer)}
            /> */}
          </Box>
        )}
        <Box>
          <Box direction="row" gap="small">
            <Box align="center" height="100%" justify="between">
              <Text size="20px" weight="bold" margin="none">
                {answer.score}
              </Text>
              <Text size="14px" color="#979797" margin="none">
                votes
              </Text>
            </Box>
            <Box height="100%" justify="between">
              <Identicon string={answer.username} size={22} />
              <Text size="14px" weight="bold">
                {answer.username}
              </Text>
            </Box>
          </Box>
          <Box>{renderQuestionOrAnswerContent(answer.content)}</Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      height="100%"
      background="white"
      round="small"
      style={{
        minWidth: "100%",
      }}
      pad="small"
    >
      <Box direction="row" justify="between" align="start">
        <Box direction="row" margin="small" gap="small">
          <Text
            size="20px"
            weight="bold"
            color={sortBy === "top" ? "black" : "grey"}
            onClick={() => setSortBy("top")}
            style={{ cursor: "pointer" }}
          >
            Top
          </Text>
          <Text
            size="20px"
            weight="bold"
            color={sortBy === "new" ? "black" : "grey"}
            onClick={() => setSortBy("new")}
            style={{ cursor: "pointer" }}
          >
            New
          </Text>
        </Box>
        <Box direction="row" align="center" margin="small" gap="xsmall">
          {!props.streamer && user && (
            <Box
              direction="row"
              width="100px"
              height="40px"
              round="small"
              background="#606EEB"
              // margin="small"
              justify="center"
              align="center"
              gap="small"
              onClick={onNewClicked}
              focusIndicator={false}
            >
              <Text color="white" weight="bold">
                New
              </Text>
              <Add color="white" size="16px" fontWeight="bold" />
            </Box>
          )}
          <Box
            onClick={fetchQuestions}
            focusIndicator={false}
            margin="none"
            pad="none"
          >
            <Refresh size="40px" />
          </Box>
        </Box>
      </Box>
      {loading && (
        <Box width="100%" height="100%" align="center" justify="center">
          <Loading size={50} color="black" />
        </Box>
      )}
      {!loading && (
        <Box margin="small" gap="medium">
          {sortQuestions().map((question) => renderQuestion(question))}
        </Box>
      )}
      {(writingQuestion || answeringQuestion) && (
        <LatexInput
          title={
            writingQuestion
              ? "New question"
              : `Answering @${answeringQuestion?.username}`
          }
          callback={(content: string) => {
            onSubmitClicked(content);
          }}
        />
      )}
    </Box>
  );
};
