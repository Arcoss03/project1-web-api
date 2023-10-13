import { object, string, number, date, InferType } from "yup";

export let PersonSchema = object({
  name: string().required().trim(),
  surname: string().required().trim(),
  email: string().email().required().trim(),
});
