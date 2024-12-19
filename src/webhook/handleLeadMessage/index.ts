import { MessageBuffer } from "./bufferMessage"
import { QueueManager } from "./queueMessage"

interface HandleLeadMessageInput {
  message: string
  phoneNumberId: string
  from: string
}
const messageBuffer = new MessageBuffer()
const queueMessage = new QueueManager()

export const handleLeadMessage = async (input: HandleLeadMessageInput) => {
  const id = `${input.phoneNumberId}:${input.from}`;
  await messageBuffer.bufferMessage(
    { bufferMessageId: id, message: input.message },
    (composedMessage: string) => {
      queueMessage.enqueue({
        queueId: id,
        message: composedMessage,
        phoneNumberId: input.phoneNumberId,
        to: input.from
      });
    }
  );
}