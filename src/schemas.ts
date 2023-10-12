import { object, string, number, date, InferType } from 'yup';

export let PersonSchema = object({
    name: string().required(),
    surname: string().required(),
    email: string().email().required(),
  });