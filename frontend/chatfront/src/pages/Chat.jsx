import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap"; // Import Stack
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat"; 
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

    if (!userChats && isUserChatsLoading) {
        return <p>Loading chats...</p>;
    }

    return (
        <Container>
            <PotentialChats />
            {userChats?.length > 0 ? (
                <Stack direction="horizontal" gap={3} className="align-items-start"> {/* Use Stack instead of div */}
                    <Stack className="messages-box flex-grow-0 pe-3"> {/* Stack for chat list */}
                        {userChats.map((chat, index) => (
                            <div key={index} onClick={() => updateCurrentChat(chat)}>
                                <UserChat chat={chat} user={user} />
                            </div>
                        ))}
                    </Stack>
                  <ChatBox/>{/* This can be replaced with your chatbox component */}
                </Stack>
            ) : (
                <p>No chats available</p>
            )}
        </Container>
    );
};

export default Chat;
