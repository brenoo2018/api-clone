import { City } from '../entities/city';
import { State } from '../entities/state';

export type TPropsCities = {
  state: State[];
  city: City[];
};
export interface CitiesRepository {
  search(): TPropsCities;
}
