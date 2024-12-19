import { MessageBuffer } from "./bufferMessage"

interface HandleLeadMessageInput {
  message: string
  phoneNumberId: string
  from: string
}
const messageBuffer = new MessageBuffer()

export const handleLeadMessage = async (input: HandleLeadMessageInput) => {
  const bufferMessageId = `${input.phoneNumberId}:${input.from}`;
  await messageBuffer.bufferMessage(
    { bufferMessageId, message: input.message },
    (composedMessage: string) => {
      console.log(`Mensagem composta para ${bufferMessageId}: ${composedMessage}`);
    }
  );
}