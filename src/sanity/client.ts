import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId, useCdn } from './config';

/** Cliente de solo lectura, sin token: el dataset es público y solo devuelve lo publicado. */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
});
