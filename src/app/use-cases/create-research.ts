import { Bindings } from '../../types/bindings';
import { ResearchesRepository } from '../../domain/repositories/research-repository';

type CreateResearchUseCaseRequest = {
  env: Bindings;
  query?: string;
  filter?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
};

type CreateResearchUseCaseResponse = {
  research: any;
};

export class CreateResearchUseCase {
  constructor(private researchesRepository: ResearchesRepository) { }

  async execute({
    env,
    query,
    filter,
    latitude,
    longitude,
    city,
    state,
  }: CreateResearchUseCaseRequest): Promise<CreateResearchUseCaseResponse> {

    console.log('🚀 use-case research events', {
      query,
      filter,
      latitude,
      longitude,
      city,
      state,
    });

    const research = await this.researchesRepository.create(env, {
      query,
      filter,
      latitude,
      longitude,
      city,
      state,
      created_at: Math.floor(new Date().getTime() / 1000),
      updated_at: Math.floor(new Date().getTime() / 1000),
    });

    return { research };
  }
}
