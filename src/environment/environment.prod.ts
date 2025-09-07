import { Environment } from './environment.model';
import { environment as base } from './environment';

export const environment: Environment = {
  production: true,
  tmdbApiKey: 'c78a827744d726be47cb2612a862f82c',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/w500'
};
