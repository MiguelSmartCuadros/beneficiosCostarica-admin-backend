import Handlebars from "handlebars";

export const handlerTemplate: (template: string, replacements: any) => string = (template: string, replacements: any) => {
  const templateHandler = Handlebars.compile(template);
  return templateHandler(replacements);
};
