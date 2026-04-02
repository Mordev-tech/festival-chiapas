import { useState, useMemo, useEffect, FC, ReactNode } from 'react'
import { i18n, FESTIVAL_KEYS } from './i18n/translations'
import type { AdminFormData, CustomFestival, LanguageCode, Credentials, Photo } from './types'
import LanguageSelector from './components/LanguageSelector'
import Modal from './components/Modal'
import Admin from './pages/Admin'
import styles from './App.module.css'

const App: FC = () => {
  const [lang, setLang] = useState<LanguageCode>('es')
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('ktch_loggedIn') === 'true'
    } catch {
      return false
    }
  })
  const [showLogin, setShowLogin] = useState(false)
  const [credentials, setCredentials] = useState<Credentials>(() => ({
    user: window.localStorage.getItem('ktch_user') || '',
    pass: '',
  }))
  const [modalKey, setModalKey] = useState<string | null>(null)
  const [customFestivals, setCustomFestivals] = useState<CustomFestival[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem('ktch_customFestivals') || '[]')
    } catch {
      return []
    }
  })
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home')
  const [loginError, setLoginError] = useState('')
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(window.localStorage.getItem('ktch_socialLinks') || '{"facebook":"","instagram":""}')
    } catch {
      return { facebook: '', instagram: '' }
    }
  })

  // Extra photos added by admin to native (built-in) festivals
  const [nativePhotos, setNativePhotos] = useState<Record<string, Photo[]>>(() => {
    try {
      return JSON.parse(window.localStorage.getItem('ktch_nativePhotos') || '{}')
    } catch {
      return {}
    }
  })

  const baseT = i18n[lang] ?? i18n.es

  const mergedKeys = useMemo(
    () => [...FESTIVAL_KEYS, ...customFestivals.map((c) => c.key)],
    [customFestivals],
  )

  const mergedFestivals = useMemo(
    () => [...baseT.festivals, ...customFestivals.map((c) => c.label)],
    [baseT, customFestivals],
  )

  const mergedData = useMemo(() => {
    const base = {
      ...baseT.data,
      ...Object.fromEntries(customFestivals.map((c) => [c.key, c.data])),
    }
    // Apply admin-added extra photos to native festivals
    const result: typeof base = {}
    for (const key of Object.keys(base)) {
      result[key] = nativePhotos[key]
        ? { ...base[key], photos: nativePhotos[key] }
        : base[key]
    }
    return result
  }, [baseT, customFestivals, nativePhotos])

  const modalData = modalKey ? mergedData[modalKey] : null

  useEffect(() => {
    setCustomFestivals([])
  }, [lang])

  useEffect(() => {
    if (!loggedIn) return
    try {
      window.localStorage.setItem('ktch_customFestivals', JSON.stringify(customFestivals))
    } catch {
      // ignorar erros de armazenamento
    }
  }, [customFestivals, loggedIn])

  useEffect(() => {
    try {
      window.localStorage.setItem('ktch_socialLinks', JSON.stringify(socialLinks))
    } catch {
      // ignorar erros de armazenamento
    }
  }, [socialLinks])

  useEffect(() => {
    try {
      window.localStorage.setItem('ktch_nativePhotos', JSON.stringify(nativePhotos))
    } catch {
      // ignorar erros de armazenamento
    }
  }, [nativePhotos])

  const handleLogin = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const email = credentials.user.trim()
    const pass = credentials.pass

    if (email === 'admin@gmail.com' && pass === '@admin123') {
      setLoginError('')
      setLoggedIn(true)
      setShowLogin(false)
      try {
        window.localStorage.setItem('ktch_loggedIn', 'true')
        window.localStorage.setItem('ktch_user', email)
      } catch {
        // ignorar erros de armazenamento
      }
      return
    }

    setLoginError('Email ou senha incorretos')
  }

  const handleLogout = (): void => {
    setLoggedIn(false)
    setModalKey(null)
    setShowLogin(false)
    setLoginError('')
    setCurrentPage('home')
    try {
      window.localStorage.removeItem('ktch_loggedIn')
      window.localStorage.removeItem('ktch_user')
      window.localStorage.removeItem('ktch_customFestivals')
    } catch {
      // ignorar erros de armazenamento
    }
  }

  const makeCityKey = (label: string): string => {
    const base = label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 30)

    let key = base || `city_${Date.now()}`
    let counter = 1
    while (mergedKeys.includes(key)) {
      key = `${base}_${counter++}`
    }
    return key
  }

  const handleAddCity = (formData: AdminFormData): void => {
    const key = makeCityKey(formData.label)
    const tags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (Array.isArray(formData.tags) ? formData.tags : [])
      
    setCustomFestivals((prev) => [
      ...prev,
      {
        key,
        label: formData.label,
        data: {
          type: formData.type,
          title: formData.label,
          text: formData.text,
          tags,
          dates: formData.dates,
          population: formData.population,
          specialty: formData.specialty,
          history: formData.history,
          image: formData.image,
          photos: formData.photos || [],
        },
      },
    ])
  }

  const handleRemoveCity = (key: string): void => {
    setCustomFestivals((prev) => prev.filter((c) => c.key !== key))
  }

  const renderLoginOverlay = (): ReactNode => (
    <div
      className={styles.loginOverlay}
      onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}
    >
      <div className={styles.loginBox}>
        <button
          type="button"
          className={styles.loginClose}
          onClick={() => setShowLogin(false)}
          aria-label="Fechar"
        >
          ✕
        </button>
        <h1 className={styles.loginTitle}>Acesse o sistema</h1>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label className={styles.loginLabel}>
            Email
            <input
              className={styles.loginInput}
              value={credentials.user}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, user: e.target.value }))
              }
              autoComplete="username"
              placeholder="admin@gmail.com"
              required
            />
          </label>
          <label className={styles.loginLabel}>
            Senha
            <input
              className={styles.loginInput}
              type="password"
              value={credentials.pass}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, pass: e.target.value }))
              }
              autoComplete="current-password"
              placeholder="@admin123"
              required
            />
          </label>
          {loginError && (
            <div className={styles.loginError}>{loginError}</div>
          )}
          <button className={styles.loginButton} type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className={styles.frame}>
      {showLogin && renderLoginOverlay()}

      {/* TOP BAR */}
      <header className={styles.topBar}>
        <div className={styles.logoMark}>K</div>
        <span className={styles.siteTitle}>K'inetik Ta Chiapas</span>
        <LanguageSelector currentLang={lang} onChangeLang={setLang} />
        {loggedIn ? (
          <>
            <button
              className={styles.loginButton}
              type="button"
              onClick={() => setCurrentPage('admin')}
            >
              Admin
            </button>
            <button className={styles.loginButton} onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => setShowLogin(true)}
            type="button"
          >
            Login
          </button>
        )}
      </header>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroPlaceholder}>
          <img src="./src/img/HeroImage.jpeg" className={styles.heroStatue} />
        </div>
        <div className={styles.heroOverlay} />
      </div>

      {/* ABOUT SECTION */}
      <section className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>{baseT.aboutTitle}</h2>
        <p className={styles.aboutText}>{baseT.aboutText}</p>
      </section>

      {/* CONTENT */}
      <div className={styles.contentWrapper}>

        {/* Left ornament */}
        <Ornament />

        {/* Festival buttons */}
        <main className={styles.mainContent}>
          <span className={styles.sectionLabel}>{baseT.sectionLabel}</span>

          {mergedKeys.map((key, i) => (
            <div key={key} className={styles.btnGroup}>
              {i > 0 && <div className={styles.btnDivider} />}
              <button
                className={styles.btnMunicipio}
                style={{ animationDelay: `${0.35 + i * 0.1}s` }}
                onClick={() => setModalKey(key)}
              >
                {mergedFestivals[i]}
              </button>
            </div>
          ))}
        </main>

        {/* Right ornament */}
        <Ornament />
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>{baseT.footerBrand}</span>
        <div className={styles.footerActions}>
          <div className={styles.socialIcons}>
            <SocialIcon icon="facebook" href={socialLinks.facebook} />
            <SocialIcon icon="instagram" href={socialLinks.instagram} />
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {modalData && (
        <Modal data={modalData} onClose={() => setModalKey(null)} />
      )}

      {currentPage === 'admin' && loggedIn && (
        <Admin
          lang={lang}
          customFestivals={customFestivals}
          onAddCity={handleAddCity}
          onRemoveCity={handleRemoveCity}
          onClose={() => setCurrentPage('home')}
          socialLinks={socialLinks}
          onUpdateSocialLinks={setSocialLinks}
          nativePhotos={nativePhotos}
          onUpdateNativePhotos={(key, photos) => setNativePhotos((prev) => ({ ...prev, [key]: photos }))}
        />
      )}
    </div>
  )
}

/* ── Sub-components ─────────────────────────── */

const Ornament: FC = () => {
  return (
    <div className={styles.ornamentSide}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={styles.ornSegment}>
          <div className={styles.ornDiamond} />
          {i < 4 && <div className={styles.ornLine} />}
        </div>
      ))}
    </div>
  )
}

interface SocialIconProps {
  icon: 'facebook' | 'instagram'
  href?: string
}

const SocialIcon: FC<SocialIconProps> = ({ icon, href }) => {
  if (!href) return null
  
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
      {icon === 'facebook' ? (
        <svg viewBox="0 0 24 24" fill="var(--gold)" width="13" height="13">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="var(--gold)" width="13" height="13">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4" fill="#0A0A0A"/>
          <circle cx="17.5" cy="6.5" r="1" fill="#0A0A0A"/>
        </svg>
      )}
    </a>
  )
}

export default App
