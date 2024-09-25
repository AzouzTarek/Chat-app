import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { getRequest, baseUrl } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);
  

    useEffect(() => {
        const getMessages = async () => {
        
                    const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
                     
                    if (response.error) {
                        return   console.log("Error getting messages...", error);
                       
                    }
                    
                    const lastMessage = response[response.length - 1];  // Dernier message
                    setLatestMessage(lastMessage);
              
            }
    

        getMessages();
    }, [ newMessage, notifications]);  // Ajout de `chat?.id` dans les dépendances

    return { latestMessage };
    
};

