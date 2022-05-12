import enGB from './translation/en-GB';

interface Translation {
  [key: string]: string | Translation;
}

interface Argument {
  [key: string]: string | number;
}

export class I18nService {
  t(lang: string, path: string, ...args: (string | number)[] | Argument[]) {
    const obj = this.langToObject(lang);

    let text = this.getObjectReference(path, obj);

    const parameters = this.getParameters(text) || [];

    parameters.forEach((param, i) => {
      const escapedParam = param.replace(/%/g, '');

      if (typeof args[0] === 'object') {
        const value = args[0][escapedParam];

        if (!value) return;

        text = text.replace(param, value as string);
      } else {
        const value = args[i];

        if (!value) return;

        text = text.replace(param, value as string);
      }
    });

    return text;
  }

  private langToObject(lang: string) {
    if (lang === 'en-GB') return enGB;
    return enGB;
  }

  private getParameters(str: string) {
    return str.match(/%(.*?)%/gm);
  }

  private getObjectReference(
    reference: string,
    object: Translation | string,
  ): string {
    const keys = reference.split('.');
    const kLen = keys.length;

    let target = object;

    for (let i = 0; i < kLen; i += 1) {
      if (!target) return target as string;
      target = target[keys[i]];
    }

    return target as string;
  }
}
