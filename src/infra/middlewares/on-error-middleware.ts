import { Context } from "hono";
import { HTTPResponseError } from "hono/types";
import { HonoEnv } from "../../types/hono-env";
import { ZodError } from "zod";
import { HttpException } from "../../app/errors/http-exception";

export const onErrorMiddleware = async (error: Error | HTTPResponseError, c: Context<HonoEnv, any, {}>) => {
  console.error(error);
  let errorContent: string;
  if (error instanceof ZodError) {
    errorContent = JSON.stringify(error.format()); // Chama o format apenas se for ZodError
  } else {
    errorContent = error.message; // Para outros erros, usa apenas message
  }

  const payload = {
    content: `Uma mensagem foi enviada para a Avivah API.`,
    embeds: [
      {
        title: "Avivah API - Notificação",
        description: "Ocorreu um erro no middleware de captura de erros.",
        color: 16711680, // Vermelho (em formato hexadecimal)
        fields: [
          {
            name: "Ambiente",
            value: c.env.ENVIRONMENT,
            inline: true
          },
          {
            name: "Timestamp",
            value: new Date().toISOString(),
            inline: true
          },
          {
            name: "Conteúdo",
            value: errorContent,
            inline: true
          }
        ],
        footer: {
          text: "Monitoramento Avivah API"
        }
      }
    ]
  };

  // Envia o payload para o webhook do Discord
  await fetch(c.env.DISCORD_WEBHOOK_API_AVIVAH, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (error instanceof ZodError) {
    return c.json(
      { message: 'Validation error.', issues: error.format() },
      400
    );
  }
  if (error instanceof HttpException) {
    return c.json({ message: error.message }, { status: error.status });
  }
  return c.json({ error: error.message ?? 'Internal Server Error' }, 500);
}