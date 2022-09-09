import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';

Handlebars.registerHelper(
  'when',
  function (this: any, v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
);

Handlebars.registerHelper('times', function (n, block) {
  let accum = '';
  for (var i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('inc', function (value, options) {
  return Number(value) + 1;
});

export async function createTemplate(template: string) {
  const file = await readFile(`./src/templates/${template}`, 'utf8');

  return Handlebars.compile(file);
}
