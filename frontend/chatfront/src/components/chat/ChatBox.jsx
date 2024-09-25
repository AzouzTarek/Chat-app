import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack, Button, Form, Modal, Dropdown } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import {
  FaPalette,
  FaUserCircle,
  FaPhone,
  FaVideo,
  FaCircle,
  FaEllipsisV,
} from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const emojis = ["😊", "👍", "❤️", "😂", "🔥"];

const ChatBox = () => {
  const navigate = useNavigate();

  const handleVideoCall = () => {
    if (recipientUser?._id) {
      navigate(`/video-chat/${recipientUser._id}`);
    }
  };
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    updateNicknameInChat,
  } = useContext(ChatContext);
  const { recipientUser, error } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const [messageEmojis, setMessageEmojis] = useState({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [theme, setTheme] = useState("black"); // Par défaut, bleu
  const [nickname, setNickname] = useState(recipientUser?.name || "");
  const [newNickname, setNewNickname] = useState(nickname);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const scroll = useRef();
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const {
    onlineUsers,
    notifications,
    markThisUserNotificationsAsRead,
    setCurrentChat,
  } = useContext(ChatContext);
  const isOnline = onlineUsers?.some((u) => u?.userId === recipientUser?._id);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (recipientUser) {
      setNickname(recipientUser.name);
    }
  }, [recipientUser]);

  const handleEmojiSelect = (messageId, emoji) => {
    setMessageEmojis((prevEmojis) => ({
      ...prevEmojis,
      [messageId]: emoji,
    }));
  };

  const handleMouseEnter = (messageId) => {
    setHoveredMessage(messageId);
  };

  const handleMouseLeave = () => {
    setHoveredMessage(null);
  };

  const handleBlock = () => {
    setIsBlocked(true);
  };

  const handleUnblock = () => {
    setIsBlocked(false);
  };

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === "blue" ? "pink" : "blue")); // Alterner entre bleu et rose
  };

  const handleNicknameChange = () => {
    setShowNicknameModal(true);
  };

  const handleNicknameUpdate = async () => {
    if (newNickname.trim() && newNickname !== nickname) {
      try {
        await updateNicknameInChat(currentChat._id, newNickname);
        setNickname(newNickname);
      } catch (error) {
        console.error("Failed to update nickname:", error);
      }
    }
    setShowNicknameModal(false);
  };

  if (!currentChat) {
    return (
      <p style={{ textAlign: "center" }}>No conversation selected yet...</p>
    );
  }

  if (!recipientUser && !error) {
    return (
      <p style={{ textAlign: "center" }}>Loading recipient information...</p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Error fetching recipient: {error}
      </p>
    );
  }

  if (isMessagesLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading chat...</p>
    );
  }

  return (
    <Stack gap={4} className={`chat-box ${theme}`}>
      {" "}
      {/* Utilisation de la variable 'theme' */}
      <div className="chat-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center position-relative">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src="https://static.vecteezy.com/ti/vecteur-libre/p3/5419157-profil-utilisateur-femme-avatar-est-une-femme-un-personnage-pour-un-economiseur-d-ecran-avec-emotions-illustrationle-sur-fond-blanc-isole-vectoriel.jpg"
              alt="Profile Avatar"
              height="50px"
              style={{ borderRadius: "50%" }}
            />
            {isOnline && (
              <FaCircle
                className="text-success"
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "green",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            )}
          </div>
          <strong className="mx-2">{nickname}</strong>
        </div>

        <div className="d-flex align-items-center">
          <Button variant="link" onClick={handleVideoCall}>
            <FaVideo />
          </Button>
          <Button variant="link">
            <FaPhone />
          </Button>

          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic">
              <FaEllipsisV />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleThemeChange}>
                {theme === "blue"
                  ? "Changer en thème rose"
                  : "Changer en thème bleu"}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleNicknameChange}>
                Changer le surnom
              </Dropdown.Item>
              <Dropdown.Item onClick={isBlocked ? handleUnblock : handleBlock}>
                {isBlocked ? "Débloquer" : "Bloquer"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Stack gap={3} className="messages">
        {messages.map((message, index) => (
          <Stack
            key={index}
            className={`message ${
              message.senderId === user._id ? "self" : "other"
            }`}
            ref={scroll}
            onMouseEnter={() => handleMouseEnter(message._id)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="message-text">{message.text}</span>
            <span className="message-footer">
              {moment(message.createdAt).calendar()}
            </span>
            {messageEmojis[message._id] && (
              <span className="message-emoji">
                {messageEmojis[message._id]}
              </span>
            )}
            {hoveredMessage === message._id && (
              <div className="emoji-bar d-flex justify-content-center">
                {emojis.map((emoji, idx) => (
                  <Button
                    key={idx}
                    variant="link"
                    className="emoji-button"
                    onClick={() => handleEmojiSelect(message._id, emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            )}
          </Stack>
        ))}
      </Stack>
      {!isBlocked && (
        <Stack
          direction="horizontal"
          gap={3}
          className="chat-input flex-grow-0"
        >
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            fontFamily="nunito"
            borderColor="rgba(72,112,223,0.2)"
            placeholder="Type a message"
          />
          <button
            onClick={() =>
              sendTextMessage(
                textMessage,
                user,
                currentChat._id,
                setTextMessage
              )
            }
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="blue"
              className="bi bi-send-arrow-up-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15.854.146a.5.5 0 0 1 .11.54L13.026 8.03A4.5 4.5 0 0 0 8 12.5c0 .5 0 1.5-.773.36l-1.59-2.498L.644 7.184l-.002-.001-.41-.261a.5.5 0 0 1 .083-.886l.452-.18.001-.001L15.314.035a.5.5 0 0 1 .54.111M6.637 10.07l7.494-7.494.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154z"
              />
              <path
                fillRule="evenodd"
                d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.354a.5.5 0 0 0-.722.016l-1.149 1.25a.5.5 0 1 0 .737.676l.28-.305V14a.5.5 0 0 0 1 0v-1.793l.396.397a.5.5 0 0 0 .708-.708z"
              />
            </svg>
          </button>
        </Stack>
      )}
      {/* Modal for nickname change */}
      <Modal
        show={showNicknameModal}
        onHide={() => setShowNicknameModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Changer le surnom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formNickname">
            <Form.Label>Nouveau surnom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le surnom"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowNicknameModal(false)}
          >
            Fermer
          </Button>
          <Button variant="primary" onClick={handleNicknameUpdate}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </Stack>
  );
};

export default ChatBox;
