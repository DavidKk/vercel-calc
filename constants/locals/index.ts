import zhCN from './zh-CN.json'

const languages = {
  'zh-CN': zhCN,
}

type zhCN = typeof zhCN

export function isZhCN(text: string): text is keyof typeof zhCN {
  return text in zhCN
}

export function isLanguage(locale: string): locale is keyof typeof languages {
  return locale in languages
}

export function getLanguageText(text: string, locale: string) {
  if (isLanguage(locale)) {
    const set = languages[locale]
    return text in set ? set[text as keyof typeof set] : text
  }

  return text
}

export default languages
