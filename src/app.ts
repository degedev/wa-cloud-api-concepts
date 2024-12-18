import "reflect-metadata";
import "./db/db";
import express, { NextFunction, Request, Response } from "express";
import { userRepository } from "./repository/UserRespository";

const app = express();
app.use(express.json({ limit: "50mb" }));

app.post('/users', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nickname, phoneNumberId, accessToken } = req.body;
    const user = await userRepository.save({ nickname, phoneNumberId, accessToken });
    return res.status(201).json({ id: user.id, nickname });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/users', async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await userRepository.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3333, () => console.log("Server is running!"));
