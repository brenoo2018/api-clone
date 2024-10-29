import { Bindings } from "../types/bindings";
import { calculateExponentialBackoff } from "../utils/calculate-exponential-backoff";
import { delayInMs } from "../utils/delay";

import { uncheckedAiChristianFetchApiJob } from "./jobs/unchecked/christian/uncheckedAiChristianFetchApiJob";
import { uncheckedAiChristianDetailJob } from "./jobs/unchecked/christian/uncheckedAiChristianDetailJob";
import { uncheckedAiChristianFetchPageJob } from "./jobs/unchecked/christian/uncheckedAiChristianFetchPageJob";

import { updateAiFieldJob } from "./jobs/updateAiFieldJob";
import { uncheckedAiNSFWFetchPageJob } from "./jobs/unchecked/nsfw/uncheckedAiNSFWFetchPageJob";
import { uncheckedAiNSFWDetailJob } from "./jobs/unchecked/nsfw/uncheckedAiNSFWDetailJob";
import { uncheckedAiNSFWFetchApiJob } from "./jobs/unchecked/nsfw/uncheckedAiNSFWFetchApiJob";

import { uncheckedAiTagsDetailJob } from "./jobs/unchecked/tags/uncheckedAiTagsDetailJob";
import { uncheckedAiTagsFetchApiJob } from "./jobs/unchecked/tags/uncheckedAiTagsFetchApiJob";
import { uncheckedAiTagsFetchPageJob } from "./jobs/unchecked/tags/uncheckedAiTagsFetchPageJob";
import { uncheckedAiTagsMapperFetchApiJob } from "./jobs/unchecked/tags/uncheckedAiTagsMapperFetchApiJob";

export async function consumer(batch: MessageBatch<any>, env: Bindings) {

  if (env.ENVIRONMENT !== 'prd') {
    return new Response('Not allowed', {
      status: 403
    });
  }

  for (const msg of batch.messages) {
    const {
      events,
      event,
      action,
      page,
      event_id,
      field,
      is_checked_christian,
      is_checked_nsfw,
      is_checked_tags,
      reason,
      is_active,
      is_pending,
      temas,
      categorias,
      event_category,
      event_theme,
    } = msg.body;
    // console.log(`Mensagem ${action} recebida:`, msg.body);
    try {
      switch (action) {
        case 'unchecked_ai_christian_fetch_page_job':
          await uncheckedAiChristianFetchPageJob({
            env,
            page
          })
          break;

        case 'unchecked_ai_christian_detail_job':
          for (const event of events) {
            await uncheckedAiChristianDetailJob({
              env,
              event,
              action: 'unchecked_ai_christian_fetch_api_job',
              delaySeconds: env.DELAY_MILLISECONDS / 1000
            });
          }

        case 'unchecked_ai_christian_fetch_api_job':
          if (event) {
            await uncheckedAiChristianFetchApiJob({
              env,
              action: 'update_ai_field',
              fetchParams: {
                url: `${env.API_IA_BASE_URL}/cristao`,
                options: {
                  method: 'POST',
                  body: JSON.stringify({
                    title: event.title,
                    model: 'binary',
                    event_id: String(event.id),
                    description: event?.description ?? '',
                    org_name: event?.org_name ?? '',
                    event_location: event?.local ?? '',
                  }),
                  headers: {
                    'ei-api-key': `${env.API_KEY_IA_CHRISTIAN_TAG}`,
                    'Content-Type': 'application/json'
                  }
                }
              }
            });
          }
          break;

        case 'unchecked_ai_nsfw_fetch_page_job':
          await uncheckedAiNSFWFetchPageJob({
            env,
            page
          })
          break;

        case 'unchecked_ai_nsfw_detail_job':
          for (const event of events) {
            await uncheckedAiNSFWDetailJob({
              env,
              event,
              action: 'unchecked_ai_nsfw_fetch_api_job',
              delaySeconds: env.DELAY_MILLISECONDS / 1000
            });
          }

        case 'unchecked_ai_nsfw_fetch_api_job':
          if (event && event.id) {
            await uncheckedAiNSFWFetchApiJob({
              env,
              action: 'update_ai_field',
              fetchParams: {
                url: `${env.API_IA_BASE_URL}/nsfw`,
                options: {
                  method: 'POST',
                  body: JSON.stringify({
                    link: event?.url_image,
                    event_id: String(event.id),
                    max_params: {
                      adult: 2,
                      medical: 2,
                      spoofed: 5,
                      violence: 2,
                      racy: 2
                    }
                  }),
                  headers: {
                    'ei-api-key': `${env.API_KEY_IA_NSFW}`,
                    'Content-Type': 'application/json'
                  }
                }
              }
            });
          }
          break;

        case 'unchecked_ai_tags_fetch_page_job':
          await uncheckedAiTagsFetchPageJob({
            env,
            page
          })
          break;

        case 'unchecked_ai_tags_detail_job':
          for (const event of events) {
            await uncheckedAiTagsDetailJob({
              env,
              event,
              action: 'unchecked_ai_tags_fetch_api_job',
              delaySeconds: env.DELAY_MILLISECONDS / 1000
            });
          }

        case 'unchecked_ai_tags_fetch_api_job':
          if (event && event.id) {
            await uncheckedAiTagsFetchApiJob({
              env,
              action: 'unchecked_ai_tags_mapper_fetch_api_job',
              fetchParams: {
                url: `${env.API_IA_BASE_URL}/tags`,
                options: {
                  method: 'POST',
                  body: JSON.stringify({
                    title: event.title,
                    description: event?.description ?? '',
                    event_id: String(event.id),
                    org_name: event?.org_name,
                    event_location: event?.local ?? '',
                  }),
                  headers: {
                    'ei-api-key': `${env.API_KEY_IA_CHRISTIAN_TAG}`,
                    'Content-Type': 'application/json'
                  }
                }
              },
              delaySeconds: env.DELAY_MILLISECONDS / 1000
            });
          }
          break;

        case 'unchecked_ai_tags_mapper_fetch_api_job':
          await uncheckedAiTagsMapperFetchApiJob({
            env,
            action: 'update_ai_field',
            temas,
            categorias,
            event_id: Number(event_id)
          })
          break


        case 'update_ai_field':
          console.log(`Mensagem ${action} recebida:`, msg.body);
          await updateAiFieldJob({
            env,
            event_id: Number(event_id),
            field,
            is_checked_christian,
            is_checked_nsfw,
            is_checked_tags,
            reason,
            is_active,
            is_pending,
            event_category,
            event_theme,
          });
          break;

        default:
          console.error(`Action ${action} não suportada.`);
      }
    } catch (error: any) {
      console.error(`Erro ao processar mensagem: ${JSON.stringify(msg.id)}`, error);

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
              },
              {
                name: "Erro",
                value: error.message,
                inline: true
              },
              {
                name: "Erro JSON",
                value: JSON.stringify(error),
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

      msg.retry({
        delaySeconds: calculateExponentialBackoff(msg.attempts, Number(env.DELAY_MILLISECONDS + 28000)),
      });

    }

    await delayInMs(env.DELAY_MILLISECONDS)
  }
}