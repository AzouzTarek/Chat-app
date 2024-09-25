const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });
let onlineUsers = []; // Utilisé uniquement pour la messagerie

io.on("connection", (socket) => {
    console.log("Nouvelle connexion:", socket.id);
    socket.emit("me", socket.id); // Envoie l'ID de socket au client

    // Ajouter un nouvel utilisateur pour la messagerie uniquement
    socket.on("addNewUser", (userId) => {
        if (!onlineUsers.some(user => user.userId === userId)) {
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });
        }
        console.log("Utilisateurs en ligne:", onlineUsers);
        io.emit("getonlineUsers", onlineUsers); // Diffuse les utilisateurs en ligne
    });

    // Déconnexion de l'utilisateur
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("getonlineUsers", onlineUsers); // Met à jour la liste des utilisateurs en ligne
        socket.broadcast.emit("callEnded"); // Signale la fin d'un appel
        console.log(`Déconnexion: ${socket.id}`);
    });

    // Gérer l'envoi de messages
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId);
        if (user) {
            io.to(user.socketId).emit("getMessage", message); // Envoie le message au destinataire
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    // Gérer les appels vidéo sans la logique `onlineUsers`
    socket.on("callUser", (data) => {
        console.log(`Appel de ${data.from} à ${data.userToCall}`);
        io.to(data.userToCall).emit("callUser", {
            signalData: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    // Répondre à l'appel
    socket.on("answerCall", (data) => {
        console.log(`Réponse à l'appel pour ${data.to}`);
        io.to(data.to).emit("callAccepted", data.signal);
    });

    // Gestion des erreurs
    socket.on("error", (error) => {
        console.error("Erreur de socket:", error);
    });
});

io.listen(3000);
