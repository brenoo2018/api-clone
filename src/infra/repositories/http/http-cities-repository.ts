import {
  CitiesRepository,
  TPropsCities,
} from '../../../domain/repositories/cities-repository';
import estados from '../../../utils/estados.json';
import municipios from '../../../utils/municipios.json';

export class HttpCitiesRepository implements CitiesRepository {
  search() {
    return { state: estados, city: municipios } as TPropsCities;
  }
}
