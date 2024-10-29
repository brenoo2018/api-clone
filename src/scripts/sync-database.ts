import { HttpRequestRepository } from "../infra/repositories/http/request-http-repository";
import { Bindings } from "../types/bindings";
import { delayInMs } from "../utils/delay";


type ResponseD1Export = {
  result: ResultExport;
  success: boolean;
  errors: any[];
  messages: any[];
};

type ResultExport = {
  filename: string;
  signed_url: string;
};

export interface ResponseD1Import {
  errors: any[];
  messages: any[];
  result: ResultImport;
  success: boolean;
}

export interface ResultImport {
  at_bookmark: string;
  filename: string;
  messages: string[];
  result: Result2;
  status: string;
  success: boolean;
  type: string;
  upload_url: string;
}

export interface Result2 {
  final_bookmark: string;
  meta: Meta;
  num_queries: number;
}

export interface Meta {
  changed_db: boolean;
  changes: number;
  duration: number;
  last_row_id: number;
  rows_read: number;
  rows_written: number;
  size_after: number;
}

export async function syncDatabase(env: Bindings) {

  if (env.ENVIRONMENT !== 'prd') {
    return new Response('Not allowed', { status: 400 });
  }
  const httpRequest = new HttpRequestRepository();

  // Exporta o banco de dados da produção
  const exportResponse = await exportDatabase(env, httpRequest);
  const updatedSqlContent = await fetchAndUpdateSqlContent(httpRequest, exportResponse.result.signed_url);

  // return new Response(updatedSqlContent, {
  //   status: 200,
  //   headers: {
  //     'Content-Type': 'text/plain',
  //     'Content-Disposition': 'attachment; filename="backup.sql"'
  //   }
  // });

  const etag = await generateETag(updatedSqlContent);
  console.log("🚀 ~ etag:", etag);

  // Inicia a importação
  const importResponseInit = await initiateImport(env, httpRequest, etag);
  console.log("🚀 ~ syncDatabase ~ importResponseInit:", importResponseInit)
  if (importResponseInit.result.success && importResponseInit.result.upload_url) {
    await uploadSqlFile(httpRequest, importResponseInit.result.upload_url, updatedSqlContent);

    // Ingestão
    const importResponseIngest = await ingestSqlFile(env, httpRequest, etag, importResponseInit.result.filename);
    console.log("🚀 ~ syncDatabase ~ importResponseIngest:", importResponseIngest)

    // Poll para verificar o status da importação
    const importResponsePoll = await pollImportStatus(env, httpRequest, importResponseInit.result.at_bookmark);
    console.log("🚀 ~ syncDatabase ~ importResponsePoll:", importResponsePoll)
  }

  return new Response('Import completed', { status: 200 });
}

async function exportDatabase(env: Bindings, httpRequest: HttpRequestRepository) {
  const fetchParams = {
    url: `${env.API_CLOUDFLARE_DATABASE_BASE_URL}/${env.ID_DATABASE_PRD}/export`,
    options: {
      method: 'POST',
      body: JSON.stringify({
        current_bookmark: "",
        dump_options: {
          no_data: false,
          no_schema: false,
          tables: ["events", "events_modalities", "events_themes", "events_categories"]
        },
        output_format: "sync"
      }),
      headers: getHeaders(env)
    }
  };
  return await httpRequest.search<ResponseD1Export>(fetchParams);
}

async function fetchAndUpdateSqlContent(httpRequest: HttpRequestRepository, signedUrl: string) {
  const sqlContent = await httpRequest.search({ url: signedUrl, options: { method: 'GET' } }, true) as string;
  return sqlContent.replace(/INSERT INTO/g, 'INSERT OR REPLACE INTO');
}

async function initiateImport(env: Bindings, httpRequest: HttpRequestRepository, etag: string) {
  const fetchParams = {
    url: `${env.API_CLOUDFLARE_DATABASE_BASE_URL}/${env.ID_DATABASE_DEV}/import`,
    options: {
      method: 'POST',
      body: JSON.stringify({ action: "init", etag }),
      headers: getHeaders(env)
    }
  };
  await delayInMs(2000);
  return await httpRequest.search<ResponseD1Import>(fetchParams);
}

async function uploadSqlFile(httpRequest: HttpRequestRepository, uploadUrl: string, updatedSqlContent: string) {
  const fetchParams = {
    url: uploadUrl,
    options: {
      method: 'PUT',
      body: updatedSqlContent,
    }
  };
  await httpRequest.search(fetchParams, true);
  await delayInMs(2000);
}

async function ingestSqlFile(env: Bindings, httpRequest: HttpRequestRepository, etag: string, filename: string) {
  const fetchParams = {
    url: `${env.API_CLOUDFLARE_DATABASE_BASE_URL}/${env.ID_DATABASE_DEV}/import`,
    options: {
      method: 'POST',
      body: JSON.stringify({
        action: "ingest",
        etag,
        filename
      }),
      headers: getHeaders(env)
    }
  };
  await delayInMs(2000);
  return await httpRequest.search<ResponseD1Import>(fetchParams);
}

async function pollImportStatus(env: Bindings, httpRequest: HttpRequestRepository, currentBookmark: string) {
  const fetchParams = {
    url: `${env.API_CLOUDFLARE_DATABASE_BASE_URL}/${env.ID_DATABASE_DEV}/import`,
    options: {
      method: 'POST',
      body: JSON.stringify({ action: "poll", current_bookmark: currentBookmark }),
      headers: getHeaders(env)
    }
  };
  const responsePoll = await httpRequest.search<ResponseD1Import>(fetchParams);
  console.log('🚀 ~ responsePoll:', responsePoll);
}

function getHeaders(env: Bindings) {
  return {
    'Content-Type': 'application/json',
    'X-Auth-Email': env.X_AUTH_EMAIL_CLOUDFLARE,
    'X-Auth-Key': env.X_AUTH_KEY_CLOUDFLARE,
    "Authorization": `Bearer ${undefined}`
  };
}

async function generateETag(data: string) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('md5', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
