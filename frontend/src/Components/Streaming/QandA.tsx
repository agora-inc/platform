import React, { Component } from "react";
import { Box, Text } from "grommet";
import { QandAService } from "../../Services/QandAService";
import { UserService, User } from "../../Services/UserService";
import { Add, Refresh } from "grommet-icons";
import Loading from "../Core/Loading";
import LatexInput from "./LatexInput";
import Identicon from "react-identicons";
// Choose other components
// import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import "../../Styles/q-and-a.css";
import { InlineMath } from "react-katex";

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

export default class QandA extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      questions: [],
      sortBy: "top",
      loading: true,
      user: UserService.getCurrentUser(),
      writingQuestion: false,
      answeringQuestion: null,
    };
  }

  componentWillMount() {
    this.fetchQuestions();
  }

  fetchQuestions = () => {
    this.setState({ loading: true });
    if (this.props.streamId) {
      QandAService.getAllQuestionsForStream({
        callback: (questions: Question[]) => {
          this.setState({ questions, loading: false });
        },
        streamId: this.props.streamId,
      });
    } else {
      QandAService.getAllQuestionsForStream({
        callback: (questions: Question[]) => {
          this.setState({ questions, loading: false });
        },
        videoId: this.props.videoId,
      });
    }
  };

  onNewClicked = () => {
    this.setState(
      {
        writingQuestion: true,
      },
      () => {
        document
          .getElementById("latex-input")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  onAnswerClicked = (question: Question) => {
    this.setState(
      { writingQuestion: false, answeringQuestion: question },
      () => {
        document
          .getElementById("latex-input")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    );
  };

  compareQuestionsByDate = (a: Question, b: Question) => {
    if (a.posted_at < b.posted_at) {
      return 1;
    }
    if (a.posted_at > b.posted_at) {
      return -1;
    }
    return 0;
  };

  compareQuestionsByScore = (a: Question, b: Question) => {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  };

  sortQuestions = () => {
    return this.state.sortBy === "top"
      ? this.state.questions.sort(this.compareQuestionsByScore)
      : this.state.questions.sort(this.compareQuestionsByDate);
  };

  onUpvoteQuestionClicked = (question: Question) => {
    if (!this.state.user) {
      return;
    }
    question.downvoters.includes(this.state.user.username)
      ? QandAService.removeQuestionDownvote(
          this.state.user.id,
          question.id,
          (questions: Question[]) => {
            console.log("user included", questions);
            this.setState({ questions });
          }
        )
      : question.upvoters.includes(this.state.user.username)
      ? QandAService.removeQuestionUpvote(
          this.state.user.id,
          question.id,
          (questions: Question[]) => {
            console.log("user included", questions);
            this.setState({ questions });
          }
        )
      : QandAService.upvoteQuestion(
          this.state.user.id,
          question.id,
          (questions: Question[]) => {
            console.log("user not included", questions);
            this.setState({ questions });
          }
        );
  };

  onDownVoteQuestionClicked = (question: Question) => {
    if (!this.state.user) {
      return;
    }
    question.upvoters.includes(this.state.user.username)
      ? QandAService.removeQuestionUpvote(
          this.state.user.id,
          question.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        )
      : question.downvoters.includes(this.state.user.username)
      ? QandAService.removeQuestionDownvote(
          this.state.user.id,
          question.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        )
      : QandAService.downvoteQuestion(
          this.state.user.id,
          question.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        );
  };

  onUpvoteAnswerClicked = (answer: Answer) => {
    if (!this.state.user) {
      return;
    }
    answer.downvoters.includes(this.state.user.username)
      ? QandAService.removeAnswerDownvote(
          this.state.user.id,
          answer.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        )
      : answer.upvoters.includes(this.state.user.username)
      ? QandAService.removeAnswerUpvote(
          this.state.user.id,
          answer.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        )
      : QandAService.upvoteAnswer(
          this.state.user.id,
          answer.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        );
  };

  onDownVoteAnswerClicked = (answer: Answer) => {
    if (!this.state.user) {
      return;
    }
    answer.upvoters.includes(this.state.user.username)
      ? QandAService.removeAnswerUpvote(
          this.state.user.id,
          answer.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        )
      : answer.downvoters.includes(this.state.user.username)
      ? QandAService.removeAnswerDownvote(
          this.state.user.id,
          answer.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        )
      : QandAService.downvoteAnswer(
          this.state.user.id,
          answer.id,
          (questions: Question[]) => {
            this.setState({ questions });
          }
        );
  };

  onSubmitClicked = (content: string) => {
    if (!this.state.user) {
      return;
    }
    const params = this.props.streamId
      ? {
          userId: this.state.user.id,
          content: content,
          streamId: this.props.streamId,
        }
      : {
          userId: this.state.user.id,
          content: content,
          videoId: this.props.videoId,
        };
    console.log("submitted content: ", content);
    this.state.writingQuestion
      ? QandAService.askQuestion(params, (questions: Question[]) => {
          this.setState({
            questions,
            writingQuestion: false,
            answeringQuestion: null,
          });
        })
      : QandAService.answerQuestion(
          this.state.user.id,
          this.state.answeringQuestion!.id,
          content,
          (questions: Question[]) => {
            this.setState({
              questions,
              writingQuestion: false,
              answeringQuestion: null,
            });
          }
        );
  };

  renderQuestionOrAnswerContent = (content: string) => {
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

  renderQuestion = (question: Question) => {
    const upvoteColor =
      this.state.user && question.upvoters.includes(this.state.user.username)
        ? "#61EC9F"
        : "black";
    const downvoteColor =
      this.state.user && question.downvoters.includes(this.state.user.username)
        ? "#61EC9F"
        : "black";
    return (
      <Box>
        <Box direction="row" justify="between" align="center" id="question">
          <Box direction="row" gap="small">
            {this.state.user && (
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
                  onClick={() => this.onUpvoteQuestionClicked(question)}
                />
                <CaretDownOutlined
                  style={{ fontSize: 35, color: downvoteColor }}
                  onClick={() => this.onDownVoteQuestionClicked(question)}
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
              <Box>{this.renderQuestionOrAnswerContent(question.content)}</Box>
            </Box>
          </Box>
          {this.state.user && (
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
              onClick={() => this.onAnswerClicked(question)}
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
          {question.answers.map((answer) => this.renderAnswer(answer))}
        </Box>
      </Box>
    );
  };

  renderAnswer = (answer: Answer) => {
    const upvoteColor =
      this.state.user && answer.upvoters.includes(this.state.user.username)
        ? "#61EC9F"
        : "black";
    const downvoteColor =
      this.state.user && answer.downvoters.includes(this.state.user.username)
        ? "#61EC9F"
        : "black";
    return (
      <Box direction="row" gap="small">
        {this.state.user && (
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
              onClick={() => this.onUpvoteAnswerClicked(answer)}
            />
            <CaretDownOutlined
              style={{ fontSize: 35, color: downvoteColor }}
              onClick={() => this.onDownVoteAnswerClicked(answer)}
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
          <Box>{this.renderQuestionOrAnswerContent(answer.content)}</Box>
        </Box>
      </Box>
    );
  };

  render() {
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
              color={this.state.sortBy === "top" ? "black" : "grey"}
              onClick={() => this.setState({ sortBy: "top" })}
              style={{ cursor: "pointer" }}
            >
              Top
            </Text>
            <Text
              size="20px"
              weight="bold"
              color={this.state.sortBy === "new" ? "black" : "grey"}
              onClick={() => this.setState({ sortBy: "new" })}
              style={{ cursor: "pointer" }}
            >
              New
            </Text>
          </Box>
          <Box direction="row" align="center" margin="small" gap="xsmall">
            {!this.props.streamer && this.state.user && (
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
                onClick={this.onNewClicked}
                focusIndicator={false}
              >
                <Text color="white" weight="bold">
                  New
                </Text>
                <Add color="white" size="16px" fontWeight="bold" />
              </Box>
            )}
            <Box
              onClick={this.fetchQuestions}
              focusIndicator={false}
              margin="none"
              pad="none"
            >
              <Refresh size="40px" />
            </Box>
          </Box>
        </Box>
        {this.state.loading && (
          <Box width="100%" height="100%" align="center" justify="center">
            <Loading size={50} color="black" />
          </Box>
        )}
        {!this.state.loading && (
          <Box margin="small" gap="medium">
            {this.sortQuestions().map((question) =>
              this.renderQuestion(question)
            )}
          </Box>
        )}
        {(this.state.writingQuestion || this.state.answeringQuestion) && (
          <LatexInput
            title={
              this.state.writingQuestion
                ? "New question"
                : `Answering @${this.state.answeringQuestion?.username}`
            }
            callback={(content: string) => {
              this.onSubmitClicked(content);
            }}
          />
        )}
      </Box>
    );
  }
}
