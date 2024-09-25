const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoute = require("./Routes/userRoute") ;
const chatRoute = require("./Routes/chatRoute") ;
const messageRoute = require("./Routes/messageRoute") ;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.get("/",(req,res)=>{
    res.send("hi ahlem chat app"); 
});

const port = process.env.PORT || 5000;

// Assurez-vous que l'URI est correctement formaté
const uri = "mongodb://127.0.0.1:27017/chatapp"; // ou l'URI MongoDB Atlas

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
