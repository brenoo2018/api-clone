## API Avivah

Este microsserviço foi desenvolvido com o objetivo de criar a API do projeto Avivah.

### Ferramentas

- npm
- Typescript
- Cloudflare Wrangler
- Prisma
- Hono
- Zod

## Início rápido

- Clone este repositório: `git clone https://github.com/raise-sistemas/microservices-monorepo`
- Entre no diretório `ei-marketplace.einscricao.workers.dev` e execute `npm install`
- Para executar o servidor em ambiente de dev: `npm run start -- --env dev`
- Para executar o servidor em produção (prd): `npm run start`
- Para realizar o deploy em dev: `npm run deploy -- --env dev`
- Para realizar o deploy em produção: `npm run deploy`

## Documentação Prisma com Wrangler D1

O suporte do Prisma com o Cloudflare Wrangler D1 difere um pouco do Prisma convencional. Consulte a documentação completa [aqui](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/).

Aqui estão alguns comandos úteis:

- Criar migração com o Wrangler D1: `npx wrangler d1 migrations create <db_name> <migration_name>`
- Criar modelo no arquivo `prisma/schema.prisma`
- Gerar primeiro SQL das migrações a partir do arquivo `schema.prisma`: `npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/<migration_name>.sql`
- Gerar atualizações SQL das migrações a partir do arquivo `schema.prisma`: `npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script > migrations/<migration_name>.sql`
- Aplicar alterações das migrações no banco de dados local: `npx wrangler d1 migrations apply <db_name> --local`
- Aplicar alterações das migrações no banco de dados remoto: `npx wrangler d1 migrations apply <db_name> --remote`
- Confirmar (yes)
- Atualizar o Prisma client: `npx prisma generate`

## Rotas

| Request | Route                | Query params                                                                                                    | Body                                                                                                                                                                                                                                                                                                                                               | Response                             | Description                                            |
| ------- | -------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------ |
| GET     | `/cities`            |                                                                                                                 |                                                                                                                                                                                                                                                                                                                                                    | states_and_cities: `array of object` | Rota para buscar todas as cidades e estados do Brasil. |
| GET     | `/geolocation`       |                                                                                                                 |                                                                                                                                                                                                                                                                                                                                                    | geolocation: `object`                | Rota para buscar a geolocalização do usuário.          |
| GET     | `/events`            | `query`, `state`, `city`, `type_id`, `ordenation`, `category_id`, `free`, `start_at`, `end_at`, `page`, `limit` |                                                                                                                                                                                                                                                                                                                                                    | events: `array of object`            | Rota para buscar eventos.                              |
| GET     | `/events/categories` | `page`                                                                                                          |                                                                                                                                                                                                                                                                                                                                                    | `array of object`                    | Rota para buscar eventos por categorias fixas.         |
| GET     | `/events/total`      |                                                                                                                 |                                                                                                                                                                                                                                                                                                                                                    | `number`                             | Rota para obter a quantidade total de eventos.         |
| POST    | `/events`            |                                                                                                                 | `external_id: number`, `org_name: string`, `active: boolean`, `title: string`, `description: string`, `speaker: string`, `local: string`, `state: string`, `city: string`, `start_at: string`, `end_at: string`, `url_event: string`, `url_image: string`, `provider: string`, `free: boolean`, `event_category: number[]`, `event_type: number[]` | `object`                             | Rota para criar um novo evento.                        |
