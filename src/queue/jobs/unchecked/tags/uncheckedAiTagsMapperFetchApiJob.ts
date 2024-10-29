import { Temas, Categorias } from "../../../../domain/entities/checked-ai";
import { Bindings } from "../../../../types/bindings";
import { reasons } from "../../../../utils/reasons";

export async function uncheckedAiTagsMapperFetchApiJob({ env, action, temas, categorias, event_id }: {
  env: Bindings,
  action: string,
  temas: Temas,
  categorias: Categorias,
  event_id: number
}) {

  const categories = [
    { id: 1, title: 'Conferências', slug: 'conferencia' },
    { id: 2, title: 'Congressos', slug: 'congresso' },
    { id: 3, title: 'Encontros', slug: 'encontro' },
    { id: 4, title: 'Retiros', slug: 'retiro' },
    { id: 5, title: 'Acampamentos', slug: 'acampamento' },
    { id: 6, title: 'Workshops e Cursos', slug: 'workshop_curso' },
    { id: 7, title: 'Shows e Festas', slug: 'show_festa' },
    { id: 8, title: 'Cultos', slug: 'culto' },
    { id: 9, title: 'Ação Social', slug: 'acao_social' },
    { id: 10, title: 'Missa', slug: 'missa' },
    { id: 11, title: 'Esportivos', slug: 'esportivo' }
  ];
  const themes = [
    { id: 1, title: 'Católico', slug: 'catolico' },
    { id: 2, title: 'Batista', slug: 'batista' },
    { id: 3, title: 'Metodista', slug: 'metodista' },
    { id: 4, title: 'Presbiteriano', slug: 'presbiteriano' },
    { id: 5, title: 'Pentecostal', slug: 'pentecostal' },
    { id: 6, title: 'Comunidades', slug: 'comunidades' },
    { id: 7, title: 'Evangélico', slug: 'evangelico' },
    { id: 8, title: 'Mulheres', slug: 'mulheres' },
    { id: 9, title: 'Homens', slug: 'homens' },
    { id: 10, title: 'Jovens', slug: 'jovens' },
    { id: 11, title: 'Casais', slug: 'casais' },
    { id: 12, title: 'Famílias', slug: 'familias' },
    { id: 13, title: 'Idosos', slug: 'idosos' },
    { id: 14, title: 'Crianças / Kids / Infantil', slug: 'criancas_infantil' },
    { id: 15, title: 'Adolescentes / Teens', slug: 'adolescentes_teens' },
    { id: 16, title: 'Liderança', slug: 'lideranca' },
    { id: 17, title: 'Evangelização', slug: 'evangelizacao' },
    { id: 18, title: 'Adoração', slug: 'adoracao' },
    { id: 19, title: 'Cura e Libertação', slug: 'cura_libertacao' },
    { id: 20, title: 'Finanças', slug: 'financas' },
    { id: 21, title: 'Educação Teológica', slug: 'educacao_teologica' },
    { id: 22, title: 'Louvor', slug: 'louvor' },
    { id: 23, title: 'Dança', slug: 'danca' },
    { id: 24, title: 'Oração', slug: 'oracao' },
    { id: 25, title: 'Diversos', slug: 'diversos' }
  ];

  // Filtrar as categorias onde o valor é 1 e retornar apenas os IDs
  const event_category = categories
    .filter(category => categorias[category.slug as keyof Categorias] === 1)
    .map(category => Number(category.id));

  // Filtrar os temas onde o valor é 1 e retornar apenas os IDs
  const event_theme = themes
    .filter(theme => temas[theme.slug as keyof Temas] === 1)
    .map(theme => Number(theme.id));

  if (event_category.length === 0) {
    event_category.push(3);
  }
  if (event_theme.length === 0) {
    event_theme.push(25);
  }

  const is_active = event_category.length > 0 && event_theme.length > 0;
  const is_pending = !is_active;

  if (event_id) {
    await env.API_QUEUE.send({
      is_checked_tags: true,
      reason: is_pending ? reasons.event_non_tags.normalize : null,
      is_active,
      is_pending,
      event_id,
      event_category,
      event_theme,
      field: 'is_checked_tags',
      action
    }, {
      delaySeconds: env.DELAY_MILLISECONDS / 1000
    });
  }
}