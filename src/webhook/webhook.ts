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
      const body = req.body;
      console.log(JSON.stringify(body));
      await this.assertLeadMessage(body);
      res.status(200).send();
      return
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
      return 
    }
  }

  private async assertLeadMessage(body: any) {
    if (body.object === 'whatsapp_business_account') {
      body.entry.forEach((entry: any) => {
          const changes = entry.changes || [];
          changes.forEach((change: any) => {
              const value = change.value;
              if (value && value.messages) {
                  const messages = value.messages;
                  messages.forEach((message: any) => {
                      if (message.type === 'text') {
                          const from = message.from;
                          const text = message.text.body;
                          console.log(`Mensagem recebida de ${from}: ${text}`);
                      }
                  });
              }
          });
      });
    }
  }
}