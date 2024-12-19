import { Request, Response } from "express";

export class Webhook {
  async challenge(req: Request, res: Response) {
    try {
      const mode = req.query["hub.mode"];
      const challenge = req.query["hub.challenge"];
      const token = req.query["hub.verify_token"];
      if (mode === "subscribe" && token === "secret") {
        res.status(200).send(challenge);
        return 
      } else {
        res.status(403).send();
        return 
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
      return
    }
  }

  async handle(req: Request, res: Response) {
    try {
      console.log(JSON.stringify(req.body));
      res.status(200).send();
      return
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
      return 
    }
  }
}