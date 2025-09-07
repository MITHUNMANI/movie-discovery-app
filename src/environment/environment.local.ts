import { Environment } from './environment.model';
import { environment as base } from './environment';

export const environment:Environment = {
  ...base, 
  tmdbApiKey: 'c78a827744d726be47cb2612a862f82c', 
  production: false 
};