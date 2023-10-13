import { object, string } from 'yup';

let createPersonSchema = object({
  firstName: string().required().trim(),
  lastName: string().required().trim()
});

let updatePersonSchema = object({
  firstName: string().trim(),
  lastName: string().trim()
});

export { createPersonSchema, updatePersonSchema };