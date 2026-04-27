import { useLanguage } from './stores';
import ko from '../locales/ko.json';
import en from '../locales/en.json';

type Dictionary = Record<string, string>;

const dictionaries: Record<string, Dictionary> = {
    ko: ko as Dictionary,
    en: en as Dictionary,
};

export const t = (key: string) => {
    const language = useLanguage.getState().language;
    const dict = dictionaries[language] || dictionaries['ko'];
    return dict[key] || key;
};
