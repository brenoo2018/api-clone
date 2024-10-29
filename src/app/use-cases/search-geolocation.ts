type SearchGeolocationUseCaseRequest = {
  cf: CfProperties;
};
type SearchGeolocationUseCaseResponse = {
  geolocation: {
    city: unknown;
    country: unknown;
    colo: unknown;
    region: unknown;
    regionCode: unknown;
    continent: unknown;
    latitude: unknown;
    longitude: unknown;
  };
};

export class SearchGeolocationUseCase {
  constructor() {}

  async execute({
    cf,
  }: SearchGeolocationUseCaseRequest): Promise<SearchGeolocationUseCaseResponse> {
    const {
      city,
      country,
      colo,
      region,
      regionCode,
      continent,
      latitude,
      longitude,
    } = cf;

    const geolocation = {
      city,
      country,
      colo,
      region,
      regionCode,
      continent,
      latitude,
      longitude,
    };

    return {
      geolocation,
    };
  }
}
