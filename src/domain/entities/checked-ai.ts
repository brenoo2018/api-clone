export type CheckedChristian = {
  cristao: boolean;
  title: string;
  description: string;
  christian_words: string;
  model: string;
  banned_words: boolean;
  event_id: string;
}

export type CheckedNFSW = {
  invalid_image: boolean
  description: string
  exceeded_parameters: boolean
  exceeded_metrics: string[]
  metrified_api_response: MetrifiedApiResponse
  max_params: MaxParams
  event_id: string;
}

type MetrifiedApiResponse = {
  adult: number
  medical: number
  spoofed: number
  violence: number
  racy: number
}

type MaxParams = {
  adult: number
  medical: number
  spoofed: number
  violence: number
  racy: number
}


export type CheckedTagsCategories = {
  title: string
  description: string
  categorias: Categorias
  temas: Temas
  event_id: string;
}

export type Categorias = {
  conferencia: number
  congresso: number
  encontro: number
  retiro: number
  acampamento: number
  workshop_curso: number
  show_festa: number
  culto: number
  acao_social: number
  missa: number
  esportivo: number
}

export type Temas = {
  catolico: number
  batista: number
  metodista: number
  presbiteriano: number
  pentecostal: number
  comunidades: number
  evangelico: number
  mulheres: number
  homens: number
  jovens: number
  casais: number
  familias: number
  idosos: number
  criancas_infantil: number
  adolescentes_teens: number
  lideranca: number
  evangelizacao: number
  adoracao: number
  cura_libertacao: number
  financas: number
  educacao_teologica: number
  louvor: number
  danca: number
  oracao: number
  diversos: number
}

