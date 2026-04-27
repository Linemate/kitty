import { useLanguage } from '../utils/stores';
import ko from '../locales/ko.json';
import en from '../locales/en.json';

type Dictionary = Record<string, string>;

const dictionaries: Record<string, Dictionary> = {
    ko: ko as Dictionary,
    en: en as Dictionary,
};

export const useTranslation = () => {
    const language = useLanguage((state) => state.language);

    const t = (key: string) => {
        const dict = dictionaries[language] || dictionaries['ko'];
        return dict[key] || key;
    };

    return { t, language };
};
