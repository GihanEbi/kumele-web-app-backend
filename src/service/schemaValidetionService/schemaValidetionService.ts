import Joi from "joi";

export function validationProperty(FormSchema: any, name: string, value: any) {
  // create single schema from FormSchema based on name
  const schema = Joi.object({
    [name]: FormSchema.extract(name),
  });

  const { error } = schema.validate({ [name]: value }, { abortEarly: false });

  return error ? error.details[0].message : null;
}

export function validation(FormSchema: any, dataObject: any) {
  const options = { abortEarly: false };
  const { error } = FormSchema.validate(dataObject, options);
  if (!error) return null;

  const newErrors: Record<string, string> = {};
  for (const item of error.details) {
    newErrors[item.path[0]] = item.message;
  }

  return newErrors;
}
