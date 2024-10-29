import { endOfDay, startOfDay, add, sub, getUnixTime } from 'date-fns';

type TimePeriod = 'today' | 'filter' | 'future' | 'past';

export function convertUnixEpochToDateBrazilian(date: number, provider?: string) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: provider === 'einscricao' ? 'UTC' : 'America/Sao_Paulo', // UTC para "einscricao", São Paulo para outros
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Define para formato 24 horas
  };

  return new Date(date * 1000).toLocaleString('pt-BR', options)
}

export function convertDateToUnixEpochMidnight(date: string) {
  let day: number, month: number, year: number;

  // Verificar se o formato é (dd/mm/yyyy) ou americano (yyyy-mm-dd)
  if (date.includes('/')) {
    const [dayStr, monthStr, yearStr] = date.split('/').map(Number);
    day = dayStr;
    month = monthStr;
    year = yearStr;
  } else if (date.includes('-')) {
    const [yearStr, monthStr, dayStr] = date.split('-').map(Number);
    day = dayStr;
    month = monthStr;
    year = yearStr;
  } else {
    throw new Error('Formato de data inválido');
  }

  // Criar o objeto Date ajustando o mês (0 = Janeiro) e definindo para meia-noite
  const midnightDate = new Date(year, month - 1, day, 0, 0, 0);

  // Converter para Unix epoch em segundos
  return Math.floor(midnightDate.getTime() / 1000);
}

export function getSecondsUntilMidnight() {
  // 6 horas em segundos
  const cacheDurationInSeconds = 6 * 60 * 60;

  console.log("cacheDurationInSeconds:", cacheDurationInSeconds);

  return cacheDurationInSeconds;
}


export function getStartAndEndOfDay(period: TimePeriod, amountDays?: number, filterDate?: string) {
  let start: Date;
  let end: Date;

  const today = new Date();

  switch (period) {
    case 'today':
      start = startOfDay(today);
      end = endOfDay(today);
      break;
    case 'filter':
      const date = new Date(filterDate!);
      start = startOfDay(date);
      end = endOfDay(date);
      break;

    case 'future':
      start = startOfDay(add(today, { days: amountDays }));
      end = endOfDay(add(today, { days: amountDays }));
      break;

    case 'past':
      start = startOfDay(sub(today, { days: amountDays }));
      end = endOfDay(sub(today, { days: amountDays }));
      break;

    default:
      throw new Error('Invalid period specified');
  }

  console.log('start', start);
  console.log('end', end);
  console.log('start getUnixTime', getUnixTime(start));
  console.log('end getUnixTime', getUnixTime(end));


  return {
    start: getUnixTime(start),
    end: getUnixTime(end),
  };
}

