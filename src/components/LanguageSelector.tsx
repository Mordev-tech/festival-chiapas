import React from 'react'
import { LANGUAGES } from '../i18n/translations'
import type { LanguageSelectorProps } from '../types'
import CountryFlag from 'react-country-flag'
import styles from './LanguageSelector.module.css'

const countryMap: Record<string, string> = {
  'es': 'MX',
  'en': 'US',
  'pt': 'BR',
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onChangeLang }) => {
  return (
    <div className={styles.langSelector}>
      {LANGUAGES.map(({ code, label, title }) => (
        <button
          key={code}
          className={[
            styles.langBtn,
            currentLang === code ? styles.active : '',
          ].join(' ')}
          onClick={() => onChangeLang(code)}
          title={title}
        >
          <CountryFlag countryCode={countryMap[code]} svg className={styles.langFlag} />
          <span className={styles.langCode}>{label}</span>
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
