import { Router } from "express";
import { Request, Response } from "express";
import { userRepository } from "../repository/UserRespository";
import { Webhook } from "../webhook/webhook";

const router = Router();

router.post('/users', async (req: Request, res: Response) => {
  try {
    const { nickname, phoneNumberId, accessToken } = req.body;
    const user = await userRepository.save({ nickname, phoneNumberId, accessToken });
    res.status(201).json({ id: user.id, nickname });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const webhookController = new Webhook();

router.get('/webhook', webhookController.challenge);

router.post("/webhook", webhookController.handle);

export { router };
