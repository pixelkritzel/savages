import { v4 as uuidv4 } from 'uuid';

export class Model {
  constructor(public id: string | number = uuidv4(), public name?: string) {}
}
