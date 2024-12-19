import axios from "axios"

const WHATSAPP_TOKEN = "EACALsTZCyBQ0BO3CTTvdTe6UzzoUvybDWUqZAGgrpZBww2YV12aHtbFajZA8hTuoIq34FlPrUguW4XMcWAKlaor67nwJLHZApPZCZCl895G79U2Cvr6FMjFnGQQ7zRLouZA8XnBMqCsMsEU4OVYLZCRyHjFplhjSZCB34AwQg0umbU1GaGgZBi4i3yNrIXZAAAY4g77dWa8rZCNflULbb265Y2DB4NFDkTdlPUSZACFgAHH2mesjkZD"

interface QueueItem {
  message: string
  phoneNumberId: string
  to: string
  isQueued: boolean
  messageId: string
}

interface ChatQueue {
  queue: QueueItem[]
  isProcessing: boolean
}

interface EnqueueInput {
  queueId: string
  phoneNumberId: string
  to: string
  message: string
  messageId: string
}

export class QueueManager {
  private chatQueues: Map<string, ChatQueue> = new Map()

  public clearQueue(queueId: string) {
    let chatQueue = this.chatQueues.get(queueId)
    chatQueue = {
      queue: [],
      isProcessing: false,
    }

    this.chatQueues.set(queueId, chatQueue)
  }

  public enqueue(
    { queueId, message, phoneNumberId, to, messageId }: EnqueueInput,
  ) {
    console.log("----------------------------")
    console.log("Enfileirando mensagem")
    let chatQueue = this.chatQueues.get(queueId)
    if (!chatQueue) {
      chatQueue = {
        queue: [],
        isProcessing: false,
      }
      this.chatQueues.set(queueId, chatQueue)
    }

    const isQueued = true
    const taskItem: QueueItem = {
      message,
      isQueued,
      phoneNumberId,
      to,
      messageId
    }
    chatQueue.queue.push(taskItem)
    this.chatQueues.set(queueId, chatQueue)
    if (!chatQueue.isProcessing) {
      this.processQueue(queueId)
    }
  }

  private async processQueue(queueId: string) {
    console.log("----------------------------")
    console.log("Processando fila")
    const chatQueue = this.chatQueues.get(queueId)
    if (!chatQueue) return
    chatQueue.isProcessing = true
    this.chatQueues.set(queueId, chatQueue)
    try {
      while (chatQueue.queue.length > 0) {
        const { message, isQueued, phoneNumberId, to, messageId } = chatQueue.queue[0]
        const messageToReplyOrNull = isQueued
        ? messageId
        : null
        await this.sendMessagesToLead(phoneNumberId, to, messageToReplyOrNull)
        chatQueue.queue.shift()
        }
      } catch (err) {
      console.log(`Não foi possível processar a fila: ${err}`)
    }
    chatQueue.isProcessing = false
    this.chatQueues.set(queueId, chatQueue)
  }

  private async sendMessagesToLead(phoneNumberId: string, to: string, messageToReplyOrNull?: string) {
    console.log("----------------------------")
    console.log("Enviando mensagem para o lead")
    const data: any = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: {
        body: `ola de volta ${to}`
      }
    };
    if (messageToReplyOrNull) data.context = { message_id: messageToReplyOrNull };

    const response = await axios({
      url: `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    });
    console.log(response.data);
  }
}
