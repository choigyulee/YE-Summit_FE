import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import themeGet from "../utils/themeGet";

import NavigationBar from "../components/NavigationBar";
import CommentInputWithSubmit from "../components/PT/CommentInputWithSubmit";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import CommentItem from "../components/PT/CommentItem";
import EditDelete from "../components/PT/EditDelete";
import { ModalMessage } from "../constants/ModalMessage";

import { BiLink } from "react-icons/bi";
import { BsFillHeartFill } from "react-icons/bs";
import NoneThumbnail from '../../src/assets/img/noneThumbnail.svg';

import { saveComment } from "../apis/Comment/saveComment";
import { updateComment } from "../apis/Comment/updateComment";
import { deleteComment } from "../apis/Comment/deleteComment";
import { useParams } from "react-router-dom";

import { SummitMapTest } from "../constants/SummitMapTest";

// API로부터 받아올 데이터 목(mock) 설정
const mockPTData = {
  title: "의사와 환자를 연결하는 원격 진료 서비스, 닥터나우",
  description: `닥터나우는 현대인들이 언제 어디서나 쉽게 의료 서비스를 받을 수 있도록 돕기 위해 만들어졌습니다.
                 원격 진료를 통해 의료 접근성을 높이고, 환자와 의사 간의 소통을 간편하게 만들고자 했습니다.
                 우리 서비스는 특히 바쁜 일상 속에서 의료를 필요로 하는 많은 사람들에게 큰 도움을 주고 있습니다.
                 앞으로도 더욱 발전하여 더 많은 분들에게 신뢰받는 헬스케어 솔루션을 제공하겠습니다.`,
  presenter: "최재형 대표님",
  company: "닥터 나우",
  date: "2024.10.28",
  optional_url:'https://www.naver.com/',
};

const PT = () => {
  const navigate = useNavigate();

  const { boardId } = useParams();
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [comments, setComments] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [newComment, setNewComment] = useState("");

  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);


  // 댓글 등록 (saveComment 사용)
  const handleRegisterComment = async (text) => {
    try {
      const commentData = { text }; // 등록할 댓글 데이터
      const response = await saveComment(commentData); // API 호출
      setComments((prevComments) => [...prevComments, response.data]); // 댓글 목록에 추가
      setNewComment(""); // 댓글 입력 필드 초기화
    } catch (error) {
      console.error("댓글 등록 오류:", error);
    }
  };

  // 댓글 수정
  const handleEditComment = async (id, updatedText) => {
    try {
      const updatedComment = { text: updatedText };
      const response = await updateComment(id, updatedComment); // 수정된 댓글 데이터 전송
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, text: updatedText } : comment
        )
      );
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      ); // 삭제 후 목록에서 제거
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  // 댓글 목록

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  const handleInvestButtonClick = () => {
    setIsInvestModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsInvestModalOpen(false);
  };

  const descriptionSentences = mockPTData.description
    .split(".")
    .filter(Boolean);

   // 삭제 버튼 클릭 핸들러
   const handleDeleteButtonClick = (type) => {
    console.log("handleDeleteButtonClick 호출됨, type:", type); // 디버깅 추가
    if (type === "pt") {
      setDeleteMessage("등록된 PT 영상을\n삭제하시겠습니까?");
    } else if (type === "comment") {
      setDeleteMessage("등록된 댓글을\n삭제하시겠습니까?");
    } else {
      console.error("알 수 없는 type:", type); // undefined 문제 확인
    }
  
    setIsDeleteModalOpen(true);
  };


  const ptData = SummitMapTest[boardId]; 

  return (
    <Container>
      <Header>
        <NavigationBar />
        <TitleContainer>
          <Title>{ptData.title}</Title>
          <EditDelete 
            color="white"
            size={36}
            onDelete={handleDeleteButtonClick}
            type='pt'
          />
        </TitleContainer>
        <Description>
          {descriptionSentences.map((sentence, index) => (
            <p key={index}>
              {sentence.trim()}
              {index !== descriptionSentences.length - 1 && "."}
            </p>
          ))}
        </Description>
      </Header>
      <ContentContainer>
        <ContentSection>
          <ContentSectionLeft>
            <VideoCommentWrapper>
              <VideoContainer
                // TODO : api통신으로 받은 이미지 아래에 삽입.
                src={'[]'}
              />
              <CommentInputWithSubmit
                onSubmit={handleRegisterComment}
                author={author}
              />
            </VideoCommentWrapper>

            <CommentsWrapper>
              {error ? (
                <p>{error}</p>
              ) : (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    author={comment.author}
                    text={comment.text}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))
              )}

              {/* CommentItem에서 수정하기 버튼을 누르면
              CommentInputWithSubmit 창이 뜨고 버튼이 '수정'으로 바뀜 */}
              {/* <CommentInputWithSubmit 
                Edit={true}
              /> */}
            </CommentsWrapper>
          </ContentSectionLeft>

          <ContentSectionRight>
            <VideoInfo>
              <DateText>{mockPTData.date}</DateText>

              <PresenterWrapper>
                <Label>발표자</Label>
                <Name>{mockPTData.presenter}</Name>
              </PresenterWrapper>
              <CompanyWrapper>
                <Label>소속</Label>
                <CompanyContainer>
                  <Name>{mockPTData.company}</Name>
                  {mockPTData.optional_url !== '' && (
                    <StyledBiLink onClick={()=>window.open(mockPTData.optional_url)}/>
                  )}
                </CompanyContainer>
              </CompanyWrapper>
              <ButtonWrapper>
                <ButtonContainer>
                  <StyledHeartIcon
                    size={36}
                    filled={isHeartFilled}
                    onClick={handleHeartClick}
                  />
                  <InvestButton onClick={handleInvestButtonClick}>
                    투자 제안하기
                  </InvestButton>
                </ButtonContainer>
              </ButtonWrapper>
            </VideoInfo>
          </ContentSectionRight>
        </ContentSection>
        <Footer />
      </ContentContainer>

      {isInvestModalOpen && (
        <Modal
          icon="check"
          message={"투자 제안이 완료되었습니다.\n 미팅 제안을 기다려주세요."}
          button="확인"
          onClose={handleCloseModal}
        />
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <Modal
          icon="exclamation"
          message={deleteMessage}
          button={ModalMessage.delete.button}
          onClose={() => setIsDeleteModalOpen(false)}
          type="yes_no"
          onClick={() => {
            console.log("PT 삭제 처리");
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </Container>
  );
};

export default PT;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${themeGet("color.main")};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: ${themeGet("color.main")};
  text-align: center;
  color: white;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  padding: 40px 10vw 0 10vw;
  margin: 40px 0;
`;

const Title = styled.h1`
  font-size: ${themeGet("fonts.h1.size")};
  font-weight: bold;
`;

const Description = styled.div`
  font-size: ${themeGet("fonts.body1.size")};
  line-height: 1.6;
  padding: 40px 10vw;
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  text-align: left;
`;

const ContentContainer = styled.section`
  border-top-right-radius: 200px;
  background-color: ${themeGet("color.100")};
  width: 100%;
`;

const ContentSection = styled.div`
  width: 80vw;
  margin: 80px auto;
  background: ${themeGet("color.white")};
  border-radius: 10px;

  /* box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.1); */
  box-shadow: 5px 5px 20px 2px #00000040;

  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const ContentSectionLeft = styled.div`
  width: 65vw;
  margin: 40px;
  background: ${themeGet("color.white")};
`;

const ContentSectionRight = styled.div`
  width: 35vw;
  padding: 5vh 0 5vh 3vw;
  background: ${themeGet("color.100")};
  display: flex;
  flex-direction: column;
`;

const VideoCommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background-color: ${themeGet("color.200")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  border-radius: 5px;

  /* 조건에 따른 배경 이미지 설정 */
  background-image: ${({ src }) =>
  src === '[]' ? `url(${NoneThumbnail})` : `url(${src})`};
`;
const VideoInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateText = styled.div`
  color: ${themeGet("color.500")};
  font-size: ${themeGet("fonts.sub_head.size")};
  font-weight: bold;
  margin-bottom: 20px;
`;

const PresenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${themeGet("fonts.body1.size")};
  background-color: ${themeGet("color.white")};
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  margin-bottom: 20px;
  position: relative;
  width: 300px;
  height: 60px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${themeGet("color.main")};
  color: ${themeGet("color.white")};
  font-weight: bold;
  border: none;
  border-radius: 50px;
  position: absolute;
  left: 0;
  width: 93px;
  height: 60px;
  z-index: 0;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  border: none;
  color: ${themeGet("color.500")};
  margin-left: 16px;
`;

const CompanyWrapper = styled(PresenterWrapper)``;

const CompanyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 20px;
  margin-left: 93px;
`;
const StyledBiLink = styled(BiLink)`
  width: 24px;
  height: 24px;

  cursor: pointer;
  color: ${themeGet("color.400")};

  &:active {
    color: ${themeGet("color.500")};
    transition: all 0.3s;
  }
  &:hover {
    color: ${themeGet("color.500")};
    transition: all 0.3s;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
`;
const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: none;
  cursor: pointer;
  background: none;
  margin-top: 40px;
`;
const StyledHeartIcon = styled(BsFillHeartFill)`
  color: ${(props) => (props.filled ? "#F25454" : themeGet("color.300"))};
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
`;
const InvestButton = styled.button`
  width: 224px;
  height: 60px;
  margin-left: 20px;
  border: 1px solid ${themeGet("color.main")};
  color: ${themeGet("color.main")};
  background: ${themeGet("color.white")};
  border-radius: 10px;
  font-size: ${themeGet("fonts.body1.size")};
  cursor: pointer;

  &:hover {
    color: ${themeGet("color.white")};
    background-color: ${themeGet("color.salmon")};
    border: none;
    transition: all 0.3s;
  }
  &:active {
    color: ${themeGet("color.white")};
    background-color: ${themeGet("color.main")};

    font-weight: 700;

    transition: all 0.3s;
  }
`;
const CommentInput = styled.div`
  display: flex;
  gap: 1rem;
`;

const CommentsWrapper = styled.div`
  margin-top: 40px;
`;
