import { City } from '../../domain/entities/city';
import { State } from '../../domain/entities/state';
import { CitiesRepository } from '../../domain/repositories/cities-repository';

type SearchCitiesUseCaseResponse = {
  states_and_cities: {
    state: State;
    city: City;
  }[];
};

export class SearchCitiesUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  execute(): SearchCitiesUseCaseResponse {
    const { state, city } = this.citiesRepository.search();

    const new_states_and_cities: Array<{ state: State; city: City }> = [];
    city.forEach((city) => {
      state.forEach((state) => {
        if (state.codigo_uf === city.codigo_uf) {
          new_states_and_cities.push({ state, city });
        }
      });
    });

    return { states_and_cities: new_states_and_cities };
  }
}
