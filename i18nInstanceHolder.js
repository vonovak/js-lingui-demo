import { setupI18n } from '@lingui/core';
import enMessages from './locale/en/messages.js';

export const i18n = setupI18n({
  language: 'en',
  catalogs: {
    en: enMessages,
  },
});

export const changeActiveLanguage = newActiveLanguage => {
  const catalog =
    newActiveLanguage === 'en' ? { en: enMessages } : { cs: require('./locale/cs/messages.js') };
  i18n.load(catalog);
  i18n.activate(newActiveLanguage);
  return i18n;
};
