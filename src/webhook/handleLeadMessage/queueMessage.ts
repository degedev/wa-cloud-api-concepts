import axios from "axios"

const WHATSAPP_TOKEN = "EACALsTZCyBQ0BO0UpaLlFpNwt1Kway4FvO5ZCJKJjYSZAuu5MyP5gntEjsazUbvESmswv3rKZBd6ymst6U9ZCZCGUZCZB5Lt0cg8zVUjZBKR7RoNNCURQt3x0DZAwouDKVTqp5gVMtnN5ogy5zn2AZBYGXrq7bKjZC8fYFp0n3ZAtKEU06xgiT8c6WIAoZC9ZAUDLrG5unXi2prEGexZBSw4iZAZC0ahQuwKTjs97srS9qaA3t8WjwKj0ZD"

interface QueueItem {
  message: string
  phoneNumberId: string
  to: string
  isQueued: boolean
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
    { queueId, message, phoneNumberId, to }: EnqueueInput,
  ) {
    let chatQueue = this.chatQueues.get(queueId)
    if (!chatQueue) {
      chatQueue = {
        queue: [],
        isProcessing: false,
      }
      this.chatQueues.set(queueId, chatQueue)
    }

    const isQueued = chatQueue.isProcessing
    const taskItem: QueueItem = {
      message,
      isQueued,
      phoneNumberId,
      to
    }
    chatQueue.queue.push(taskItem)
    this.chatQueues.set(queueId, chatQueue)
    if (!chatQueue.isProcessing) {
      this.processQueue(queueId)
    }
  }

  private async processQueue(queueId: string) {
    const chatQueue = this.chatQueues.get(queueId)
    if (!chatQueue) return
    chatQueue.isProcessing = true
    this.chatQueues.set(queueId, chatQueue)
    try {
      while (chatQueue.queue.length > 0) {
        const { message, isQueued, phoneNumberId, to } = chatQueue.queue[0]
          await this.sendMessagesToLead(phoneNumberId, to)
        }
        chatQueue.queue.shift()
      } catch (err) {
      console.log(`Não foi possível processar a fila: ${err}`)
    }
    chatQueue.isProcessing = false
    this.chatQueues.set(queueId, chatQueue)
  }

  private async sendMessagesToLead(phoneNumberId: string, to: string) {
    const response = await axios({
      url: `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      method: 'post',
      headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text:{
              body: `ola de volta ${to}`
          }
      })
    })
    console.log(response.data) 
  }
}
