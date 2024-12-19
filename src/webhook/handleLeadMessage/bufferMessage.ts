interface BufferMessageInput {
  message: string
  bufferMessageId: string
}

export class MessageBuffer {
  private messageBufferPerChatId: Map<string, string>
  private messageTimeouts: Map<string, NodeJS.Timeout>
  public timeoutDuration: number

  constructor() {
    this.messageBufferPerChatId = new Map<string, string>()
    this.messageTimeouts = new Map<string, NodeJS.Timeout>()
  }

  public bufferMessage<T>(
    { bufferMessageId, message }: BufferMessageInput,
    onBufferFlush: (
      composedMessage: string,
    ) => T,
  ): Promise<T> {
    return new Promise((resolve) => {
      if (!this.messageBufferPerChatId.has(bufferMessageId)) {
        this.messageBufferPerChatId.set(bufferMessageId, "")
      }
      const chatBuffer = this.messageBufferPerChatId.get(bufferMessageId)
      this.messageBufferPerChatId.set(bufferMessageId, `${chatBuffer}\n${message}`)
      if (this.messageTimeouts.has(bufferMessageId)) {
        clearTimeout(this.messageTimeouts.get(bufferMessageId))
      }
      this.messageTimeouts.set(
        bufferMessageId,
        setTimeout(() => {
          const composedMessage = !this.messageBufferPerChatId.has(
            bufferMessageId,
          )
            ? message
            : this.messageBufferPerChatId.get(bufferMessageId)
          this.messageBufferPerChatId.delete(bufferMessageId)
          this.messageTimeouts.delete(bufferMessageId)
          resolve(onBufferFlush(composedMessage))
        }, 10000),
      )
    })
  }
}
