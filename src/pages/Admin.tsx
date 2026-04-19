import React, { useState, useRef } from 'react'
import { i18n, FESTIVAL_KEYS } from '../i18n/translations'
import type { AdminProps, LanguageSection, AdminFormData, CustomFestival, FestivalData, Photo } from '../types'
import styles from '../App.module.css'
import { Save, Trash2, Plus, X, Flag, Check, Edit, Lock, Image as ImageIcon } from 'lucide-react'

const Admin: React.FC<AdminProps> = ({ customFestivals, onAddCity, onRemoveCity, onClose, lang = 'es', socialLinks = {}, onUpdateSocialLinks, nativePhotos = {}, onUpdateNativePhotos, nativeEdits = {}, onUpdateNativeData }) => {
  const baseT = i18n[lang] ?? i18n.es
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'languages'>('add')
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [listEditorTab, setListEditorTab] = useState<'sections' | 'interface' | 'social'>('sections')
  const [formData, setFormData] = useState<AdminFormData>({
    label: '',
    type: '',
    text: '',
    population: '',
    specialty: '',
    history: '',
    tags: '',
    dates: '',
    image: null,
    photos: [],
  })

  const handleAddCity = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (!formData.label.trim()) return

    onAddCity({
      label: formData.label.trim(),
      type: formData.type.trim() || 'Categoría',
      text: formData.text.trim() || 'Sin descripción.',
      population: formData.population.trim() || '',
      specialty: formData.specialty.trim() || '',
      history: formData.history.trim() || '',
      dates: formData.dates.trim() || '',
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .join(','),
      image: formData.image || null,
      photos: formData.photos || [],
    })
    resetForm()
    setActiveTab('list')
  }

  const resetForm = (): void => {
    setFormData({
      label: '',
      type: '',
      text: '',
      population: '',
      specialty: '',
      history: '',
      tags: '',
      dates: '',
      image: null,
      photos: [],
    })
  }

  const handleInputChange = (field: keyof AdminFormData, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.pagesOverlay}>
      <div className={styles.pagesBox}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          type="button"
        >
          ✕
        </button>

        <h2 className={styles.pagesTitle}>Admin Panel</h2>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
            paddingBottom: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('add')}
            style={{
              padding: '10px 16px',
              border: activeTab === 'add' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
              background: activeTab === 'add' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
              color: 'var(--gold)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <Plus size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Agregar
          </button>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              padding: '10px 16px',
              border: activeTab === 'list' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
              background: activeTab === 'list' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
              color: 'var(--gold)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <Edit size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Editar
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            style={{
              padding: '10px 16px',
              border: activeTab === 'languages' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
              background: activeTab === 'languages' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
              color: 'var(--gold)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <Flag size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Idiomas
          </button>
        </div>

        {/* TAB: ADICIONAR */}
        {activeTab === 'add' && (
          <div>
            <p className={styles.pagesHint}>
              Agrega información completa para el nuevo festival.
            </p>
            <form className={styles.modalForm} onSubmit={handleAddCity}>
              <label className={styles.modalLabel}>
                Nombre del Festival *
                <input
                  className={styles.modalInput}
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  placeholder="Ej: Festival de Primavera"
                  required
                />
              </label>

              <label className={styles.modalLabel}>
                Tipo / Categoría
                <input
                  className={styles.modalInput}
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="Ej: Festival Cultural"
                />
              </label>

              <label className={styles.modalLabel}>
                Descripción Principal
                <textarea
                  className={styles.modalTextarea}
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  placeholder="Descripción detallada del festival..."
                  rows={4}
                />
              </label>

              <label className={styles.modalLabel}>
                Fechas del Festival
                <input
                  className={styles.modalInput}
                  value={formData.dates}
                  onChange={(e) => handleInputChange('dates', e.target.value)}
                  placeholder="Ej: 7 - 23 de Enero"
                />
              </label>

              <label className={styles.modalLabel}>
                Público / Visitantes Esperados
                <input
                  className={styles.modalInput}
                  value={formData.population}
                  onChange={(e) => handleInputChange('population', e.target.value)}
                  placeholder="Ej: 600.000"
                />
              </label>

              <label className={styles.modalLabel}>
                Especialidad / Destacado
                <input
                  className={styles.modalInput}
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="Ej: Feria de Primavera"
                />
              </label>

              <label className={styles.modalLabel}>
                Historia / Contexto
                <textarea
                  className={styles.modalTextarea}
                  value={formData.history}
                  onChange={(e) => handleInputChange('history', e.target.value)}
                  placeholder="Cuenta la historia del festival..."
                  rows={3}
                />
              </label>

              <label className={styles.modalLabel}>
                Etiquetas (separadas por coma)
                <input
                  className={styles.modalInput}
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Ej: Festival, Gastronomía, Artesanía"
                />
              </label>

              <PhotoUploader
                photos={formData.photos || []}
                onChange={(photos) => handleInputChange('photos', photos)}
              />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.footerButton}
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className={styles.modalButton}
                >
                  Agregar Festival
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: EDITAR/LISTAR */}
        {activeTab === 'list' && (
          <div>
            {/* Sub-abas dentro de Editar */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
                paddingBottom: '12px',
              }}
            >
              <button
                onClick={() => {
                  setListEditorTab('sections')
                  setEditingKey(null)
                }}
                style={{
                  padding: '10px 16px',
                  border: listEditorTab === 'sections' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
                  background: listEditorTab === 'sections' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                  color: 'var(--gold)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Secciones
              </button>
              <button
                onClick={() => {
                  setListEditorTab('interface')
                  setEditingKey(null)
                }}
                style={{
                  padding: '10px 16px',
                  border: listEditorTab === 'interface' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
                  background: listEditorTab === 'interface' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                  color: 'var(--gold)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Interfaz
              </button>
              <button
                onClick={() => {
                  setListEditorTab('social')
                  setEditingKey(null)
                }}
                style={{
                  padding: '10px 16px',
                  border: listEditorTab === 'social' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
                  background: listEditorTab === 'social' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                  color: 'var(--gold)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Sociales
              </button>
            </div>

            {/* Conteúdo das sub-abas */}
            {listEditorTab === 'sections' && (
              <div>
                {editingKey ? (
                  <CityEditor
                    cityKey={editingKey}
                    allCities={{ ...baseT.data, ...Object.fromEntries(customFestivals.map((c) => [c.key, c.data])) }}
                    cities={customFestivals}
                    isCustom={customFestivals.some((c) => c.key === editingKey)}
                    nativePhotos={nativePhotos}
                    nativeEdits={nativeEdits}
                    onSave={(key, data) => {
                      const custom = customFestivals.find((c) => c.key === key)
                      if (custom) {
                        onRemoveCity(key)
                        onAddCity(data)
                      } else {
                        // Native festival — save photos + text edits
                        if (onUpdateNativePhotos && data.photos) {
                          onUpdateNativePhotos(key, data.photos)
                        }
                        if (onUpdateNativeData) {
                          onUpdateNativeData(key, {
                            type: data.type,
                            text: data.text,
                            dates: data.dates,
                            population: data.population,
                            specialty: data.specialty,
                            history: data.history,
                            tags: data.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
                          })
                        }
                      }
                      setEditingKey(null)
                    }}
                    onCancel={() => setEditingKey(null)}
                    onDelete={() => {
                      onRemoveCity(editingKey)
                      setEditingKey(null)
                    }}
                  />
                ) : (
                  <CityList
                    baseT={baseT}
                    baseData={baseT.data}
                    customFestivals={customFestivals}
                    onEdit={setEditingKey}
                    onDelete={onRemoveCity}
                  />
                )}
              </div>
            )}

            {listEditorTab === 'interface' && (
              <EditInterfazEditor lang={lang} />
            )}

            {listEditorTab === 'social' && (
              <SocialEditor socialLinks={socialLinks} onUpdateSocialLinks={onUpdateSocialLinks} />
            )}
          </div>
        )}

        {/* TAB: IDIOMAS */}
        {activeTab === 'languages' && (
          <LanguagesEditor lang={lang} />
        )}

        {/* BOTÃO FECHAR */}
        {(activeTab === 'add' || activeTab === 'languages') && (
          <button
            className={styles.modalButton}
            style={{ marginTop: '24px', width: '100%', alignSelf: 'unset' }}
            onClick={onClose}
          >
            Volver
          </button>
        )}
      </div>
    </div>
  )
}

interface CityListProps {
  baseT: LanguageSection
  baseData: Record<string, FestivalData>
  customFestivals: CustomFestival[]
  onEdit: (key: string) => void
  onDelete: (key: string) => void
}

const CityList: React.FC<CityListProps> = ({ baseT, baseData, customFestivals, onEdit, onDelete }) => {
  const allKeys = [...Object.keys(baseData), ...customFestivals.map((c) => c.key)]
  const allNames: Record<string, FestivalData> = { ...baseData }
  customFestivals.forEach((c) => {
    allNames[c.key] = c.data
  })

  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '16px' }}>
        Haz clic en un festival para editar. Los festivales nativos permiten edición completa.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {allKeys.map((key) => {
          const data = allNames[key]
          const isCustom = customFestivals.some((c) => c.key === key)
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                border: `1.5px solid ${isCustom ? 'var(--gold)' : 'rgba(201, 168, 76, 0.4)'}`,
                borderRadius: '8px',
                background: isCustom ? 'rgba(201, 168, 76, 0.08)' : 'transparent',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', fontFamily: 'Cinzel, serif' }}>
                  {data.title}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                  {data.type}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => onEdit(key)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    border: '1px solid rgba(201, 168, 76, 0.6)',
                    background: 'transparent',
                    color: 'var(--gold)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Cinzel, serif',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(201, 168, 76, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  <Edit size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(key)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    border: '1px solid rgba(255, 100, 100, 0.6)',
                    background: 'transparent',
                    color: '#ff6464',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Cinzel, serif',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255, 100, 100, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  <Trash2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Eliminar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface LanguagesEditorProps {
  lang?: string
}

const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ lang = 'es' }) => {
  const baseT = i18n[lang] ?? i18n.es
  const [selectedLang, setSelectedLang] = useState<string>('es')
  const [editorTab, setEditorTab] = useState<'interface' | 'sections'>('interface')
  const [selectedFestival, setSelectedFestival] = useState<string | null>(null)
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('customTranslations')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [sections, setSections] = useState<Record<string, Record<string, Record<string, string>>>>(() => {
    try {
      const saved = localStorage.getItem('customSections')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslationModal, setShowTranslationModal] = useState(false)
  const [translateFromLang, setTranslateFromLang] = useState('es')
  const [translateToLang, setTranslateToLang] = useState('en')

  const uiStrings = ['sectionLabel', 'footerBrand', 'aboutTitle', 'aboutText']
  const sectionFieldKeys = ['text', 'type', 'population', 'specialty', 'history']

  const getTranslationValue = (key: string, language: string): string => {
    if (translations[language]?.[key]) {
      return translations[language][key]
    }
    return (i18n[language as keyof typeof i18n] as any)?.[key] || ''
  }

  const handleTranslationChange = (key: string, language: string, value: string): void => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [key]: value,
      },
    }))
  }

  const getSectionValue = (festivalKey: string, language: string, field: string): string => {
    if (sections[festivalKey]?.[language]?.[field]) {
      return sections[festivalKey][language][field]
    }
    const baseData = baseT.data[festivalKey] as any
    return baseData?.[field] || ''
  }

  const handleSectionChange = (festivalKey: string, language: string, field: string, value: string): void => {
    setSections((prev) => ({
      ...prev,
      [festivalKey]: {
        ...prev[festivalKey],
        [language]: {
          ...prev[festivalKey]?.[language],
          [field]: value,
        },
      },
    }))
  }

  const saveTranslations = (): void => {
    localStorage.setItem('customTranslations', JSON.stringify(translations))
    localStorage.setItem('customSections', JSON.stringify(sections))
    alert('¡Idiomas, Interfaz y Secciones guardados con éxito!')
  }

  const autoTranslate = async (fromLang: string, toLang: string): Promise<void> => {
    setIsTranslating(true)
    try {
      let textsToTranslate: string[] = []
      let isInterfazTab = editorTab === 'interface'

      if (isInterfazTab) {
        textsToTranslate = uiStrings.map((key) => getTranslationValue(key, fromLang))
      } else if (selectedFestival) {
        textsToTranslate = sectionFieldKeys.map((field) => getSectionValue(selectedFestival, fromLang, field))
      } else {
        return
      }

      const results = await Promise.all(
        textsToTranslate.map((text) =>
          fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
          )
            .then((res) => res.json())
            .then((data) =>
              (data.responseData?.translatedText as string) || text
            )
            .catch(() => text)
        )
      )

      if (isInterfazTab) {
        const newTranslations = { ...translations }
        uiStrings.forEach((key, idx) => {
          newTranslations[toLang] = newTranslations[toLang] || {}
          newTranslations[toLang][key] = results[idx]
        })
        setTranslations(newTranslations)
        alert('¡Traducción automática completada para Interfaz!')
      } else if (selectedFestival) {
        const newSections = { ...sections }
        sectionFieldKeys.forEach((field, idx) => {
          newSections[selectedFestival] = newSections[selectedFestival] || {}
          newSections[selectedFestival][toLang] = newSections[selectedFestival][toLang] || {}
          newSections[selectedFestival][toLang][field] = results[idx]
        })
        setSections(newSections)
        alert(`¡Traducción automática completada para ${(baseT.data[selectedFestival] as any)?.title}!`)
      }

      setShowTranslationModal(false)
    } catch (error) {
      console.error('Translation error:', error)
      alert('Error al traducir automáticamente. Intenta de nuevo.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleStartTranslation = (): void => {
    setShowTranslationModal(true)
    setTranslateFromLang(selectedLang || 'es')
    const available = ['es', 'en', 'pt'].filter((l) => l !== (selectedLang || 'es'))
    setTranslateToLang(available[0])
  }

  const handleConfirmTranslation = (): void => {
    autoTranslate(translateFromLang, translateToLang)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
        Edite os textos da interface e seções em diferentes idiomas. Use a tradução automática ou edite manualmente.
      </p>

      {/* Editor Tabs: Interfaz vs Secciones */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.3)', paddingBottom: '12px' }}>
        <button
          onClick={() => setEditorTab('interface')}
          style={{
            padding: '10px 16px',
            border: editorTab === 'interface' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
            background: editorTab === 'interface' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
            color: 'var(--gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Interfaz
        </button>
        <button
          onClick={() => setEditorTab('sections')}
          style={{
            padding: '10px 16px',
            border: editorTab === 'sections' ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.4)',
            background: editorTab === 'sections' ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
            color: 'var(--gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Secciones
        </button>
      </div>

      {/* Language Tabs - apenas para Interfaz */}
      {editorTab === 'interface' && (
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.3)', paddingBottom: '12px' }}>
          {['es', 'en', 'pt'].map((langCode) => (
            <button
              key={langCode}
              onClick={() => setSelectedLang(langCode)}
              style={{
                padding: '8px 14px',
                border: selectedLang === langCode ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.3)',
                background: selectedLang === langCode ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                color: 'var(--gold)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
            >
              {langCode === 'es' ? '🇲🇽 Español' : langCode === 'en' ? '🇺🇸 English' : '🇧🇷 Português'}
            </button>
          ))}
        </div>
      )}

      {/* Translation/Sections Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '8px' }}>
        {editorTab === 'interface' ? (
          <>
            {uiStrings.map((key) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {key === 'sectionLabel' && 'Etiqueta de la Sección de Festivales'}
                {key === 'footerBrand' && 'Marca del Pie de Página'}
                {key === 'aboutTitle' && 'Título Sobre Chiapas'}
                {key === 'aboutText' && 'Texto Sobre Chiapas'}

                <textarea
                  style={{
                    padding: '10px 12px',
                    border: '1.5px solid rgba(201, 168, 76, 0.4)',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    fontSize: '13px',
                    fontFamily: 'IM Fell English, serif',
                    minHeight: key === 'aboutText' ? '80px' : '45px',
                    resize: 'vertical',
                  } as React.CSSProperties}
                  value={getTranslationValue(key, selectedLang)}
                  onChange={(e) => handleTranslationChange(key, selectedLang, e.target.value)}
                />
              </label>
            ))}
          </>
        ) : (
          <>
            {!selectedFestival ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px' }}>
                  Selecciona un festival para editar sus secciones en diferentes idiomas.
                </p>
                {Object.entries(baseT.data).map(([key, festival]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFestival(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      border: '1.5px solid rgba(201, 168, 76, 0.4)',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--gold)',
                      cursor: 'pointer',
                      fontFamily: 'Cinzel, serif',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'rgba(201, 168, 76, 0.1)'
                      ;(e.target as HTMLButtonElement).style.borderColor = 'var(--gold)'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'transparent'
                      ;(e.target as HTMLButtonElement).style.borderColor = 'rgba(201, 168, 76, 0.4)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {(festival as any).title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                        {(festival as any).type}
                      </div>
                    </div>
                    <div style={{ fontSize: '16px' }}>→</div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.3)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedFestival(null)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid rgba(201, 168, 76, 0.4)',
                      background: 'transparent',
                      color: 'var(--gold)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: 'Cinzel, serif',
                      fontSize: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'rgba(201, 168, 76, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'transparent'
                    }}
                  >
                    ← Volver
                  </button>
                  <h4 style={{ color: 'var(--gold)', marginTop: '12px', marginBottom: '6px', fontSize: '14px' }}>
                    {(baseT.data[selectedFestival] as any)?.title}
                  </h4>
                </div>

                {/* Language Tabs - para Secciones */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(201, 168, 76, 0.3)', paddingBottom: '12px' }}>
                  {['es', 'en', 'pt'].map((langCode) => (
                    <button
                      key={langCode}
                      onClick={() => setSelectedLang(langCode)}
                      style={{
                        padding: '8px 12px',
                        border: selectedLang === langCode ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.3)',
                        background: selectedLang === langCode ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                        color: 'var(--gold)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: 'Cinzel, serif',
                        fontSize: '11px',
                        transition: 'all 0.2s ease',
                        textTransform: 'uppercase',
                      }}
                    >
                      {langCode === 'es' ? '🇲🇽 ES' : langCode === 'en' ? '🇺🇸 EN' : '🇧🇷 PT'}
                    </button>
                  ))}
                </div>

                {/* Section Fields */}
                {sectionFieldKeys.map((field) => (
                  <label key={field} style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    {field === 'text' && 'Descripción'}
                    {field === 'type' && 'Tipo / Categoría'}
                    {field === 'population' && 'Público / Visitantes'}
                    {field === 'specialty' && 'Especialidad'}
                    {field === 'history' && 'Historia'}

                    <textarea
                      style={{
                        padding: '10px 12px',
                        border: '1.5px solid rgba(201, 168, 76, 0.4)',
                        borderRadius: '6px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        fontSize: '13px',
                        fontFamily: 'IM Fell English, serif',
                        minHeight: field === 'text' || field === 'history' ? '80px' : '45px',
                        resize: 'vertical',
                      } as React.CSSProperties}
                      value={getSectionValue(selectedFestival, selectedLang, field)}
                      onChange={(e) => handleSectionChange(selectedFestival, selectedLang, field, e.target.value)}
                    />
                  </label>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(201, 168, 76, 0.3)' }}>
        <button
          onClick={handleStartTranslation}
          disabled={isTranslating || (editorTab === 'sections' && !selectedFestival)}
          style={{
            padding: '8px 14px',
            border: '1.5px solid rgba(201, 168, 76, 0.4)',
            background: isTranslating || (editorTab === 'sections' && !selectedFestival) ? 'rgba(150, 150, 150, 0.3)' : 'transparent',
            color: isTranslating || (editorTab === 'sections' && !selectedFestival) ? 'rgba(255,255,255,0.5)' : 'var(--gold)',
            borderRadius: '6px',
            cursor: isTranslating || (editorTab === 'sections' && !selectedFestival) ? 'not-allowed' : 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {isTranslating ? <><X size={14} style={{ display: 'inline', marginRight: '4px' }} /> Traduciendo...</> : <><Flag size={14} style={{ display: 'inline', marginRight: '4px' }} /> Auto-Traducir</>}
        </button>

        <button
          onClick={saveTranslations}
          style={{
            padding: '8px 14px',
            border: '1.5px solid var(--gold)',
            background: 'rgba(201, 168, 76, 0.2)',
            color: 'var(--gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <Save size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Guardar Todo
        </button>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
        ℹ️ Use a tradução automática para gerar traduções iniciais, depois edite conforme necessário para melhor qualidade.
      </p>

      {/* Translation Modal as Card */}
      {showTranslationModal && (
        <div
          style={{
            background: '#1a1a1a',
            border: '2px solid var(--gold)',
            borderRadius: '12px',
            padding: '30px',
            marginTop: '20px',
            fontFamily: 'Cinzel, serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '16px', textTransform: 'uppercase', margin: 0 }}>
              <Flag size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Elegir Idiomas para Traducción
            </h3>
            <button
              onClick={() => setShowTranslationModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold)',
                cursor: 'pointer',
                fontSize: '20px',
                padding: 0,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* From Language */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              De (Origem):
            </label>
            <select
              value={translateFromLang}
              onChange={(e) => {
                setTranslateFromLang(e.target.value)
                if (e.target.value === translateToLang) {
                  const available = ['es', 'en', 'pt'].filter((l) => l !== e.target.value)
                  setTranslateToLang(available[0])
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'IM Fell English, serif',
                cursor: 'pointer',
              }}
            >
              <option value="es">🇲🇽 Español</option>
              <option value="en">🇺🇸 English</option>
              <option value="pt">🇧🇷 Português</option>
            </select>
          </div>

          {/* To Language */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Para (Destino):
            </label>
            <select
              value={translateToLang}
              onChange={(e) => setTranslateToLang(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'IM Fell English, serif',
                cursor: 'pointer',
              }}
            >
              {['es', 'en', 'pt']
                .filter((l) => l !== translateFromLang)
                .map((l) => (
                  <option key={l} value={l}>
                    {l === 'es' ? '🇲🇽 Español' : l === 'en' ? '🇺🇸 English' : '🇧🇷 Português'}
                  </option>
                ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' }}>
            <button
              onClick={() => setShowTranslationModal(false)}
              disabled={isTranslating}
              style={{
                padding: '8px 16px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                background: 'transparent',
                color: 'var(--gold)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmTranslation}
              disabled={isTranslating}
              style={{
                padding: '8px 16px',
                border: '1.5px solid var(--gold)',
                background: 'rgba(201, 168, 76, 0.2)',
                color: 'var(--gold)',
                borderRadius: '6px',
                cursor: isTranslating ? 'not-allowed' : 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                opacity: isTranslating ? 0.6 : 1,
              }}
            >
              {isTranslating ? <><X size={14} style={{ display: 'inline', marginRight: '4px' }} /> Traduciendo...</> : <><Check size={14} style={{ display: 'inline', marginRight: '4px' }} /> Traducir</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface CityEditorProps {
  cityKey: string
  allCities: Record<string, FestivalData>
  cities: CustomFestival[]
  isCustom: boolean
  nativePhotos?: Record<string, Photo[]>
  nativeEdits?: Record<string, Partial<FestivalData>>
  onSave: (key: string, data: AdminFormData) => void
  onCancel: () => void
  onDelete: () => void
}

const CityEditor: React.FC<CityEditorProps> = ({ cityKey, allCities, cities, isCustom, nativePhotos = {}, nativeEdits = {}, onSave, onCancel, onDelete }) => {
  const city = allCities[cityKey]
  // For native festivals, apply any previously saved edits on top
  const edits = nativeEdits[cityKey] || {}
  const [formData, setFormData] = useState<AdminFormData>({
    label: city.title,
    type: edits.type ?? city.type,
    text: edits.text ?? city.text,
    population: edits.population ?? city.population ?? '',
    specialty: edits.specialty ?? city.specialty ?? '',
    history: edits.history ?? city.history ?? '',
    dates: edits.dates ?? city.dates ?? '',
    tags: ((edits.tags ?? city.tags) || []).join(', '),
    image: city.image || null,
    photos: nativePhotos[cityKey] ?? city.photos ?? [],
  })

  const handleInputChange = (field: keyof AdminFormData, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (): void => {
    onSave(cityKey, {
      label: formData.label,
      type: formData.type,
      text: formData.text,
      population: formData.population,
      specialty: formData.specialty,
      history: formData.history,
      dates: formData.dates,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .join(','),
      image: formData.image,
      photos: formData.photos || [],
    })
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>
          Editando: {city.title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
          {isCustom
            ? <><Edit size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Personalizado — Edición completa</>
            : <><Edit size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Nativo — Todos los campos editables</>}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Nombre del Festival *
          <input
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tipo / Categoría
          <input
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Descripción Principal
          <textarea
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
              minHeight: '80px',
            }}
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Fechas del Festival
          <input
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            value={formData.dates}
            onChange={(e) => handleInputChange('dates', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Público / Visitantes Esperados
          <input
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            value={formData.population}
            onChange={(e) => handleInputChange('population', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Especialidad / Destacado
          <input
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            value={formData.specialty}
            onChange={(e) => handleInputChange('specialty', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Historia / Contexto
          <textarea
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
              minHeight: '60px',
            }}
            value={formData.history}
            onChange={(e) => handleInputChange('history', e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Etiquetas (separadas por coma)
          <input
            style={{
              padding: '10px 12px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
          />
        </label>
      </div>

      {/* Photos always editable, even for native festivals */}
      <div style={{ marginBottom: '20px' }}>
        <PhotoUploader
          photos={formData.photos || []}
          onChange={(photos) => handleInputChange('photos', photos)}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <button
          type="button"
          className={styles.footerButton}
          onClick={onCancel}
        >
          Cancelar
        </button>
        {onDelete && (
          <button
            type="button"
            style={{
              padding: '10px 14px',
              border: '1.5px solid rgba(255, 100, 100, 0.6)',
              background: 'transparent',
              color: '#ff6464',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              letterSpacing: '0.05em',
            }}
            onClick={() => {
              if (confirm('¿Estás seguro de que deseas eliminar este festival?')) {
                onDelete()
              }
            }}
          >
            <Trash2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Eliminar
          </button>
        )}
        <button
          type="button"
          className={styles.modalButton}
          onClick={handleSave}
        >
          <Save size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Guardar
        </button>
      </div>
    </div>
  )
}

interface SocialEditorProps {
  socialLinks?: Record<string, string>
  onUpdateSocialLinks?: (links: Record<string, string>) => void
}

interface EditInterfazEditorProps {
  lang?: string
}

const EditInterfazEditor: React.FC<EditInterfazEditorProps> = ({ lang = 'es' }) => {
  const [selectedLang, setSelectedLang] = useState<string>('es')
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('customTranslations')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslationModal, setShowTranslationModal] = useState(false)
  const [translateFromLang, setTranslateFromLang] = useState('es')
  const [translateToLang, setTranslateToLang] = useState('en')

  const uiStrings = ['sectionLabel', 'footerBrand', 'aboutTitle', 'aboutText']

  const getTranslationValue = (key: string, language: string): string => {
    if (translations[language]?.[key]) {
      return translations[language][key]
    }
    return (i18n[language as keyof typeof i18n] as any)?.[key] || ''
  }

  const handleTranslationChange = (key: string, language: string, value: string): void => {
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [key]: value,
      },
    }))
  }

  const saveTranslations = (): void => {
    localStorage.setItem('customTranslations', JSON.stringify(translations))
    alert('¡Interfaz guardada con éxito!')
  }

  const autoTranslate = async (fromLang: string, toLang: string): Promise<void> => {
    setIsTranslating(true)
    try {
      const textsToTranslate = uiStrings.map((key) => getTranslationValue(key, fromLang))

      const results = await Promise.all(
        textsToTranslate.map((text) =>
          fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
          )
            .then((res) => res.json())
            .then((data) =>
              (data.responseData?.translatedText as string) || text
            )
            .catch(() => text)
        )
      )

      const newTranslations = { ...translations }
      uiStrings.forEach((key, idx) => {
        newTranslations[toLang] = newTranslations[toLang] || {}
        newTranslations[toLang][key] = results[idx]
      })

      setTranslations(newTranslations)
      setShowTranslationModal(false)
      alert('¡Traducción automática completada para Interfaz!')
    } catch (error) {
      console.error('Translation error:', error)
      alert('Error al traducir automáticamente. Intenta de nuevo.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleStartTranslation = (): void => {
    setShowTranslationModal(true)
    setTranslateFromLang(selectedLang)
    const available = ['es', 'en', 'pt'].filter((l) => l !== selectedLang)
    setTranslateToLang(available[0])
  }

  const handleConfirmTranslation = (): void => {
    autoTranslate(translateFromLang, translateToLang)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
        Edite os textos da interface em diferentes idiomas. Use a tradução automática ou edite manualmente.
      </p>

      {/* Language Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.3)', paddingBottom: '12px' }}>
        {['es', 'en', 'pt'].map((langCode) => (
          <button
            key={langCode}
            onClick={() => setSelectedLang(langCode)}
            style={{
              padding: '8px 14px',
              border: selectedLang === langCode ? '1.5px solid var(--gold)' : '1.5px solid rgba(201, 168, 76, 0.3)',
              background: selectedLang === langCode ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
              color: 'var(--gold)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
            }}
          >
            {langCode === 'es' ? '🇲🇽 Español' : langCode === 'en' ? '🇺🇸 English' : '🇧🇷 Português'}
          </button>
        ))}
      </div>

      {/* Translation Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '8px' }}>
        {uiStrings.map((key) => (
          <label key={key} style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '6px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {key === 'sectionLabel' && 'Etiqueta de la Sección de Festivales'}
            {key === 'footerBrand' && 'Marca del Pie de Página'}
            {key === 'aboutTitle' && 'Título Sobre Chiapas'}
            {key === 'aboutText' && 'Texto Sobre Chiapas'}

            <textarea
              style={{
                padding: '10px 12px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'IM Fell English, serif',
                minHeight: key === 'aboutText' ? '80px' : '45px',
                resize: 'vertical',
              } as React.CSSProperties}
              value={getTranslationValue(key, selectedLang)}
              onChange={(e) => handleTranslationChange(key, selectedLang, e.target.value)}
            />
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(201, 168, 76, 0.3)' }}>
        <button
          onClick={handleStartTranslation}
          disabled={isTranslating}
          style={{
            padding: '8px 14px',
            border: '1.5px solid rgba(201, 168, 76, 0.4)',
            background: isTranslating ? 'rgba(150, 150, 150, 0.3)' : 'transparent',
            color: isTranslating ? 'rgba(255,255,255,0.5)' : 'var(--gold)',
            borderRadius: '6px',
            cursor: isTranslating ? 'not-allowed' : 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {isTranslating ? <><X size={14} style={{ display: 'inline', marginRight: '4px' }} /> Traduciendo...</> : <><Flag size={14} style={{ display: 'inline', marginRight: '4px' }} /> Auto-Traducir</>}
        </button>

        <button
          onClick={saveTranslations}
          style={{
            padding: '8px 14px',
            border: '1.5px solid var(--gold)',
            background: 'rgba(201, 168, 76, 0.2)',
            color: 'var(--gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <Save size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Guardar Interfaz
        </button>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
        ℹ️ Use a tradução automática para gerar traduções iniciais, depois edite conforme necessário para melhor qualidade.
      </p>

      {/* Translation Modal as Card */}
      {showTranslationModal && (
        <div
          style={{
            background: '#1a1a1a',
            border: '2px solid var(--gold)',
            borderRadius: '12px',
            padding: '30px',
            marginTop: '20px',
            fontFamily: 'Cinzel, serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '16px', textTransform: 'uppercase', margin: 0 }}>
              <Flag size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Elegir Idiomas para Traducción
            </h3>
            <button
              onClick={() => setShowTranslationModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold)',
                cursor: 'pointer',
                fontSize: '20px',
                padding: 0,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* From Language */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              De (Origem):
            </label>
            <select
              value={translateFromLang}
              onChange={(e) => {
                setTranslateFromLang(e.target.value)
                if (e.target.value === translateToLang) {
                  const available = ['es', 'en', 'pt'].filter((l) => l !== e.target.value)
                  setTranslateToLang(available[0])
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'IM Fell English, serif',
                cursor: 'pointer',
              }}
            >
              <option value="es">🇲🇽 Español</option>
              <option value="en">🇺🇸 English</option>
              <option value="pt">🇧🇷 Português</option>
            </select>
          </div>

          {/* To Language */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Para (Destino):
            </label>
            <select
              value={translateToLang}
              onChange={(e) => setTranslateToLang(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'IM Fell English, serif',
                cursor: 'pointer',
              }}
            >
              {['es', 'en', 'pt']
                .filter((l) => l !== translateFromLang)
                .map((l) => (
                  <option key={l} value={l}>
                    {l === 'es' ? '🇲🇽 Español' : l === 'en' ? '🇺🇸 English' : '🇧🇷 Português'}
                  </option>
                ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' }}>
            <button
              onClick={() => setShowTranslationModal(false)}
              disabled={isTranslating}
              style={{
                padding: '8px 16px',
                border: '1.5px solid rgba(201, 168, 76, 0.4)',
                background: 'transparent',
                color: 'var(--gold)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmTranslation}
              disabled={isTranslating}
              style={{
                padding: '8px 16px',
                border: '1.5px solid var(--gold)',
                background: 'rgba(201, 168, 76, 0.2)',
                color: 'var(--gold)',
                borderRadius: '6px',
                cursor: isTranslating ? 'not-allowed' : 'pointer',
                fontFamily: 'Cinzel, serif',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                opacity: isTranslating ? 0.6 : 1,
              }}
            >
              {isTranslating ? <><X size={14} style={{ display: 'inline', marginRight: '4px' }} /> Traduciendo...</> : <><Check size={14} style={{ display: 'inline', marginRight: '4px' }} /> Traducir</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SocialEditor: React.FC<SocialEditorProps> = ({ socialLinks = {}, onUpdateSocialLinks }) => {
  const [localLinks, setLocalLinks] = useState<Record<string, string>>(socialLinks)

  const handleChange = (platform: string, value: string): void => {
    setLocalLinks((prev) => ({ ...prev, [platform]: value }))
  }

  const handleSave = (): void => {
    onUpdateSocialLinks?.(localLinks)
    alert('¡Redes Sociales actualizadas con éxito!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
        Edite os links das redes sociais ou deixe em branco para não exibir o ícone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Facebook */}
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '8px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          URL de Facebook
          <input
            type="url"
            style={{
              padding: '12px 14px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            placeholder="https://facebook.com/seu-perfil"
            value={localLinks.facebook || ''}
            onChange={(e) => handleChange('facebook', e.target.value)}
          />
        </label>

        {/* Instagram */}
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', color: 'rgba(255,255,255,0.8)', gap: '8px', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          URL de Instagram
          <input
            type="url"
            style={{
              padding: '12px 14px',
              border: '1.5px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'IM Fell English, serif',
            }}
            placeholder="https://instagram.com/seu-perfil"
            value={localLinks.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
          />
        </label>
      </div>

      {/* Info */}
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
        ℹ️ Deixe o campo vazio para ocultar o ícone. Inclua o protocolo (https://) no link.
      </p>

      {/* Botões */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(201, 168, 76, 0.3)', paddingTop: '16px' }}>
        <button
          onClick={() => setLocalLinks(socialLinks)}
          style={{
            padding: '10px 20px',
            border: '1.5px solid rgba(201, 168, 76, 0.4)',
            background: 'transparent',
            color: 'var(--gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            border: '1.5px solid var(--gold)',
            background: 'rgba(201, 168, 76, 0.2)',
            color: 'var(--gold)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
          }}
        >
          <Save size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Guardar Redes Sociales
        </button>
      </div>
    </div>
  )
}

/* ── PhotoUploader ─────────────────────────────────────────── */

interface PhotoUploaderProps {
  photos: Photo[]
  onChange: (photos: Photo[]) => void
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photos, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const toRead = Array.from(files)
    let loaded = 0
    const newPhotos: Photo[] = []

    toRead.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          newPhotos.push({
            id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            url: result,
          })
        }
        loaded++
        if (loaded === toRead.length) {
          onChange([...photos, ...newPhotos])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id))
  }

  const updateCaption = (id: string, caption: string) => {
    onChange(photos.map((p) => (p.id === id ? { ...p, caption } : p)))
  }

  const movePhoto = (from: number, to: number) => {
    const arr = [...photos]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    onChange(arr)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Header label */}
      <div style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Cinzel, serif',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <ImageIcon size={14} />
        Galería de Fotos
        <span style={{ color: 'rgba(201,168,76,0.6)', fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}>
          ({photos.length} foto{photos.length !== 1 ? 's' : ''})
        </span>
      </div>

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          padding: '10px 16px',
          border: '1.5px dashed rgba(201, 168, 76, 0.5)',
          borderRadius: '8px',
          background: 'rgba(201, 168, 76, 0.05)',
          color: 'rgba(201,168,76,0.85)',
          cursor: 'pointer',
          fontFamily: 'Cinzel, serif',
          fontSize: '12px',
          letterSpacing: '0.06em',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201, 168, 76, 0.12)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.8)'
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201, 168, 76, 0.05)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201, 168, 76, 0.5)'
        }}
      >
        <Plus size={15} />
        Agregar Fotos
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.currentTarget.files)}
      />

      {/* Photo grid preview */}
      {photos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '8px',
          marginTop: '4px',
        }}>
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'visible',
                border: '1.5px solid rgba(201, 168, 76, 0.25)',
                background: '#000',
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '5px 5px 0 0' }}>
                <img
                  src={photo.url}
                  alt={`Foto ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.75)',
                    border: '1px solid rgba(255,100,100,0.5)',
                    color: '#ff6464',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    fontSize: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <X size={11} />
                </button>
                {/* Order badge */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  background: 'rgba(0,0,0,0.65)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: 'rgba(201,168,76,0.9)',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontFamily: 'Cinzel, serif',
                }}>
                  {idx + 1}
                </div>
              </div>

              {/* Caption input */}
              <input
                type="text"
                placeholder="Leyenda..."
                value={photo.caption || ''}
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  borderTop: '1px solid rgba(201,168,76,0.15)',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '10px',
                  fontFamily: 'IM Fell English, serif',
                  borderRadius: '0 0 5px 5px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />

              {/* Move arrows */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '2px 4px',
                background: 'rgba(0,0,0,0.4)',
                borderTop: '1px solid rgba(201,168,76,0.1)',
              }}>
                <button
                  type="button"
                  onClick={() => idx > 0 && movePhoto(idx, idx - 1)}
                  disabled={idx === 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: idx === 0 ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.7)',
                    cursor: idx === 0 ? 'default' : 'pointer',
                    fontSize: '14px',
                    padding: '0 4px',
                    lineHeight: 1,
                  }}
                >←</button>
                <button
                  type="button"
                  onClick={() => idx < photos.length - 1 && movePhoto(idx, idx + 1)}
                  disabled={idx === photos.length - 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: idx === photos.length - 1 ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.7)',
                    cursor: idx === photos.length - 1 ? 'default' : 'pointer',
                    fontSize: '14px',
                    padding: '0 4px',
                    lineHeight: 1,
                  }}
                >→</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin
