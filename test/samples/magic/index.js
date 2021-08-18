import { sum } from '@math/sum';
import { subtract } from '@math/subtract';

export const magic = (a, b) => subtract(sum(a, b), sum(a, b))
