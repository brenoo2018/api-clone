import { Bindings } from "../types/bindings";

export async function consumerDlq(batch: MessageBatch, env: Bindings) {
  for (const msg of batch.messages) {
    // Formata a mensagem para o Discord
    const payload = {
      content: `Uma mensagem foi enviada para a Dead Letter Queue.`,
      embeds: [
        {
          title: "Dead Letter Queue - Notificação",
          description: "Uma mensagem não pôde ser processada e foi enviada para a DLQ.",
          color: 16711680, // Vermelho (em formato hexadecimal)
          fields: [
            {
              name: "Ambiente",
              value: env.ENVIRONMENT,
              inline: true
            },
            {
              name: "ID da Mensagem",
              value: msg.id,
              inline: true
            },
            {
              name: "Tentativas",
              value: msg.attempts.toString(),
              inline: true
            },
            {
              name: "Timestamp",
              value: new Date().toISOString(),
              inline: true
            },
            {
              name: "Conteúdo",
              value: JSON.stringify(msg.body),
              inline: true
            }
          ],
          footer: {
            text: "Monitoramento DLQ"
          }
        }
      ]
    };

    // Envia o payload para o webhook do Discord
    await fetch(env.DISCORD_DLQ, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Confirma o processamento bem-sucedido
    msg.ack();
  }
}
