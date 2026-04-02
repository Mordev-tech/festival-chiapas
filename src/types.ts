/**
 * Aplicação de Gestão de Festivais - Definições de Tipos
 * Abordagem de tipagem moderada para aplicação React/Vite
 */

/* ─────────────────────────────────────────────── */
/** Tipos Principais de Dados de Festivais */
/* ─────────────────────────────────────────────── */

export interface Photo {
  id: string
  url: string
  caption?: string
}

export interface FestivalData {
  type: string
  title: string
  text: string
  dates?: string
  municipality?: string
  image?: string
  photos?: Photo[]
  population?: string
  specialty?: string
  history?: string
  tags: string[]
}

export interface CustomFestival {
  key: string
  label: string
  data: FestivalData
}

export interface FestivalDataMap {
  [key: string]: FestivalData
}

/* ─────────────────────────────────────────────── */
/** Idioma & Internacionalização */
/* ─────────────────────────────────────────────── */

export type LanguageCode = 'es' | 'en' | 'pt'

export interface Language {
  code: LanguageCode
  label: string
  title: string
  indigenous?: boolean
}

export interface LanguageSection {
  sectionLabel: string
  footerBrand: string
  aboutTitle: string
  aboutText: string
  festivals: string[]
  data: FestivalDataMap
}

export interface I18nData {
  [key: string]: LanguageSection
}

/* ─────────────────────────────────────────────── */
/** Props de Componentes */
/* ─────────────────────────────────────────────── */

export interface LanguageSelectorProps {
  currentLang: LanguageCode
  onChangeLang: (lang: LanguageCode) => void
}

export interface ModalProps {
  data: FestivalData | null
  onClose: () => void
}

export interface AdminFormData {
  label: string
  type: string
  text: string
  population: string
  specialty: string
  history: string
  tags: string
  dates: string
  image: string | null
  photos: Photo[]
}

export interface AdminProps {
  lang: LanguageCode
  customFestivals: CustomFestival[]
  onAddCity: (config: AdminFormData) => void
  onRemoveCity: (key: string) => void
  onClose: () => void
  socialLinks?: Record<string, string>
  onUpdateSocialLinks?: (links: Record<string, string>) => void
  nativePhotos?: Record<string, Photo[]>
  onUpdateNativePhotos?: (key: string, photos: Photo[]) => void
}

export interface SocialIconProps {
  icon: 'facebook' | 'instagram'
  href?: string
}

export interface OrnamentProps {
  // Nenhuma prop necessária
}

/* ─────────────────────────────────────────────── */
/** Estado da App & Credenciais */
/* ─────────────────────────────────────────────── */

export interface Credentials {
  user: string
  pass: string
}

export interface AppState {
  lang: LanguageCode
  loggedIn: boolean
  showLogin: boolean
  credentials: Credentials
  modalKey: string | null
  customFestivals: CustomFestival[]
  currentPage: 'home' | 'admin'
  loginError: string
}

/* ─────────────────────────────────────────────── */
/** Manipuladores de Eventos */
/* ─────────────────────────────────────────────── */

export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void
export type ClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void
export type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
export type LanguageChangeHandler = (lang: LanguageCode) => void
