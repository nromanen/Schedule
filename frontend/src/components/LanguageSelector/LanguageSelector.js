import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

const LanguageSelector = props => {
    const { i18n } = useTranslation();
    const langFlags = [
        {
            lang: 'en',
            img: 'https://image.flaticon.com/icons/svg/555/555417.svg',
            title: 'English'
        },
        {
            lang: 'uk',
            img: 'https://image.flaticon.com/icons/svg/321/321267.svg',
            title: 'Українська'
        }
    ];
    let radioLangClasses = {};
    i18n.languages.forEach(lang => {
        radioLangClasses[lang] = 'languageItem ';
    });
    radioLangClasses[i18n.language] += ' activeLanguage';

    const changeLanguage = event => {
        radioLangClasses[i18n.language] = 'languageItem ';
        radioLangClasses[event.target.value] += ' activeLanguage';
        i18n.changeLanguage(event.target.value);
    };
    const renderLangControls = langItem => (
        <FormControlLabel
            key={langItem.lang}
            control={
                <>
                    <Radio
                        color="primary"
                        value={langItem.lang}
                        onChange={changeLanguage}
                    />
                    <img
                        className="language-icon"
                        src={langItem.img}
                        alt={langItem.lang}
                        title={langItem.title}
                    />
                </>
            }
            className={radioLangClasses[langItem.lang]}
        />
    );

    return (
        <RadioGroup
            row
            aria-label="lang"
            name="lang"
            value={i18n.language}
            className="lang_selector"
        >
            {langFlags.map(langItem => renderLangControls(langItem))}
        </RadioGroup>
    );
};

export default LanguageSelector;
