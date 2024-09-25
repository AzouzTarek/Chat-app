import { useContext } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from 'react-bootstrap';
import { ChatContext } from "../../context/ChatContext";  // Import du contexte pour mettre à jour currentChat
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import { useFetchLatestMessage } from "../../hooks/useFetchLatesMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);  
    const { onlineUsers, notifications, markThisUserNotificationsAsRead, setCurrentChat } = useContext(ChatContext);  // Ajout de setCurrentChat
    const { latestMessage } = useFetchLatestMessage(chat);
    
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications?.filter(n => n.senderId === recipientUser?._id);
    const isOnline = onlineUsers?.some(u => u?.userId === recipientUser?._id);

    const handleClick = () => {
        setCurrentChat(chat);  // Met à jour le chat actuel dans ChatContext
        if (thisUserNotifications?.length) {
            markThisUserNotificationsAsRead(thisUserNotifications, notifications);
        }
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    
    return (
        <div className="user-chat-container">
            <Stack
                direction="horizontal"
                gap={3}
                className="user-card align-items-center p-2 justify-content-between hover-effect"
                role="button"
                onClick={handleClick}  // Appel de la fonction de mise à jour du chat
            >
                <div className="d-flex">
                    <div className="me-2 position-relative">
                        {/* Avatar utilisateur */}
                        <img
                            src="https://static.vecteezy.com/ti/vecteur-libre/p3/5419157-profil-utilisateur-femme-avatar-est-une-femme-un-personnage-pour-un-economiseur-d-ecran-avec-emotions-illustrationle-sur-fond-blanc-isole-vectoriel.jpg"
                            alt="Profile Avatar"
                            height="35px"
                            style={{ borderRadius: "50%" }}
                        />
                        {/* Point vert pour indiquer l'utilisateur en ligne */}
                        {isOnline && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "0",  // Place the point at the top
                                    right: "0",  // Align the point to the right
                                    width: "12px",
                                   height: "12px",
                                    backgroundColor: "green",
                                    borderRadius: "50%",
                                    border: "2px solid white"
                                }}
                            ></span>
                        )}
                    </div>
                    <div className="text-content">
                        <div className="name">{recipientUser?.name}</div>
                        <div className="text">
                            {latestMessage?.text && <span>{truncateText(latestMessage?.text, 20)}</span>}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="date">
                        {latestMessage?.createdAt ? moment(latestMessage?.createdAt).calendar() : ""}
                    </div>
                    <div className={thisUserNotifications?.length ? "this-user-notifications" : ""}>
                        {thisUserNotifications?.length || ""}
                    </div>
                </div>
            </Stack>
        </div>
    );
};

export default UserChat;
