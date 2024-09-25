import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";

const baseUrl = "http://localhost:5000/api";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    // Extrait l'ID du destinataire de la conversation actuelle
    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) {
                return;
            }

            try {
                // Effectue la requête pour récupérer les informations du destinataire
                const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(response); // S'assure que le destinataire est bien défini
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (recipientId) {
            getUser(); // Appel de la fonction seulement si un ID de destinataire est trouvé
        }
    }, [recipientId]);

    return { recipientUser, error };
};
