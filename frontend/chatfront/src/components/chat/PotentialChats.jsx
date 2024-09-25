import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const [openedChats, setOpenedChats] = useState(new Set()); // Suivre les utilisateurs dont le chat est déjà ouvert
  const { potentialChats = [], currentChats = [], onlineUsers = [] } = useContext(ChatContext);

  // Combiner les utilisateurs potentiels et ceux avec qui il y a déjà un chat
  const combinedUserList = [
    ...potentialChats,
    ...(Array.isArray(currentChats)
      ? currentChats.filter((chat) => !potentialChats.some((u) => u._id === chat._id))
      : [])
  ];

  // Si potentialChats ET currentChats sont vides, alors afficher le message
  if (combinedUserList.length === 0 && currentChats.length === 0) {
    return <div>Aucun utilisateur disponible pour discuter</div>;
  }

  const handleUserClick = (u) => {
    if (!openedChats.has(u._id)) {
      createChat(user._id, u._id); // Appel pour créer un chat
      setOpenedChats((prev) => new Set(prev).add(u._id)); // Ajoute l'utilisateur aux chats ouverts
    }
  };

  return (
    <div className="all-users">
      {/* Afficher tous les utilisateurs disponibles, potentiels ou en cours de discussion */}
      {combinedUserList.map((u) => (
        <div
          className="single-user"
          key={u._id}
          onClick={() => handleUserClick(u)} // Ouvre le chat uniquement si ce n'est pas déjà fait
          style={{
            cursor: openedChats.has(u._id) ? 'not-allowed' : 'pointer',
            opacity: openedChats.has(u._id) ? 0.5 : 1
          }}
        >
          {u.name || "Utilisateur sans nom"}
          {/* Vérifier que onlineUsers est bien défini et est un tableau avant d'utiliser .some() */}
          <span className={Array.isArray(onlineUsers) && onlineUsers.some((onlineUser) => onlineUser?.userId === u?._id) ? "user-online" : ""}></span>
        </div>
      ))}

      {/* Afficher les utilisateurs avec qui il y a déjà une discussion même si les potentialChats sont vides */}
      {currentChats.length > 0 && (
        <div className="current-chats">
          <h3>Utilisateurs avec lesquels vous discutez déjà :</h3>
          {currentChats.map((chat) => (
            <div
              className="single-user"
              key={chat._id}
              style={{
                cursor: openedChats.has(chat._id) ? 'not-allowed' : 'pointer',
                opacity: openedChats.has(chat._id) ? 0.5 : 1
              }}
            >
              {chat.name || "Utilisateur sans nom"}
              <span className={Array.isArray(onlineUsers) && onlineUsers.some((onlineUser) => onlineUser?.userId === chat?._id) ? "user-online" : ""}></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PotentialChats;