import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const supportedLangs = ['en', 'uk'];
const userLang = (navigator.language || navigator.userLanguage).slice(0, 2);
export const lang = supportedLangs.find((i) => i === userLang) || 'en';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
        lng: lang,
        backend: {
            loadPath: '/assets/i18n/translations/{{lng}}/{{ns}}.json',
        },
        fallbackLng: 'en',
        debug: false,
        ns: ['formElements', 'validationMessages', 'common', 'serviceMessages'],
        defaultNS: 'common',
        keySeparator: false,
        useDataAttrOptions: true,
        interpolation: {
            escapeValue: false,
            formatSeparator: ',',
        },
        react: {
            wait: true,
        },
    });

export default i18n;
