import "reflect-metadata";
import "./db/db";
import express, {Express, Request, Response } from "express";
import { userRepository } from "./repository/UserRespository";


const app: Express = express()
app.use(express.json({ limit: "50mb" }));

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { nickname, phoneNumberId, accessToken } = req.body;
    const user = await userRepository.save({ nickname, phoneNumberId, accessToken });
    res.status(201).json({ id: user.id, nickname });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode === "subscribe" && token === 'secret') {
    res.status(200).send(challenge);
  } else {
    res.status(403);
  }
})

app.post('/webhook', (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body));
  res.status(200);
})

app.listen(3333, () => console.log("Server is running!"));
