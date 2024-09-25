import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import moment from "moment";
const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const { notifications, userChats, allUsers,markAllNotificationsAsRead , markNotificationsAsRead } = useContext(ChatContext);

    const unreadNotifications = unreadNotificationsFunc(notifications);
    const modifiedNotifications = notifications.map((n) => {
        const sender = allUsers.find(user => user._id === n.senderId);
        return {
            ...n,
            senderName: sender?.name,
        };
    });

    console.log("un", unreadNotifications);
    console.log("an", modifiedNotifications);

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-chat-heart"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M2.965 12.695a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2m-.8 3.108.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125M8 5.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"
                    />
                </svg>
                {unreadNotifications?.length === 0 ? null : (
                    <span className="notification-count">
                        {unreadNotifications?.length}
                    </span>
                )}
            </div>
            {isOpen ? (
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div className="mark-as-read" onClick={()=>markAllNotificationsAsRead(notifications)} >Mark all as read</div>
                    </div>
                    {modifiedNotifications?.length === 0 ? <span className="notification"> no notification yet .. </span> :

                        null}
                    {modifiedNotifications && 
                    modifiedNotifications.map((n, index) => {
                        return <div
                            key={index}
                            className={n.isRead ? 'notification' : 'notification not-read'}
                            onClick={()=>{
                                markNotificationsAsRead(n,userChats,user , notifications)
                          setIsOpen(false);
                            }}
                            >
                            <span> {`${n.senderName} sent you a new message`}</span>
                            <span className="notification-time">{moment(n.date).calendar()}</span>
                        </div>

                    })}
                </div>
            ) : null}
        </div>
    );
};

export default Notification;
