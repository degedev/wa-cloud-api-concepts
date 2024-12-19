import { MessageBuffer } from "./bufferMessage"
import { QueueManager } from "./queueMessage"

interface HandleLeadMessageInput {
  message: string
  phoneNumberId: string
  from: string
  messageId: string
}
const messageBuffer = new MessageBuffer()
const queueMessage = new QueueManager()

export const handleLeadMessage = async (input: HandleLeadMessageInput) => {
  console.log("----------------------------")
  console.log("Enviando mensagem para o lead")
  const id = `${input.phoneNumberId}:${input.from}`;
  const composedMessage = await messageBuffer.bufferMessage(
    { bufferMessageId: id, message: input.message },
    (composedMessage: string) => {
      console.log(`Mensagem composta para ${id}: ${composedMessage}`)
      return composedMessage
    }
  );
  queueMessage.enqueue({
    queueId: id,
    message: composedMessage,
    phoneNumberId: input.phoneNumberId,
    to: input.from,
    messageId: input.messageId
  });
  return
}