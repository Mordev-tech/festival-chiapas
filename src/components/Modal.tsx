import React from 'react'
import type { ModalProps } from '../types'
import PhotoGallery from './PhotoGallery'
import styles from './Modal.module.css'

const Modal: React.FC<ModalProps> = ({ data, onClose }) => {
  if (!data) return null

  // Build the photos array: prefer data.photos, fall back to legacy data.image
  const photos = (() => {
    if (data.photos && data.photos.length > 0) return data.photos
    if (data.image) return [{ id: 'legacy', url: data.image }]
    return []
  })()

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Slideshow / single photo at the top */}
        {photos.length > 0 && (
          <div className={styles.galleryWrap}>
            <PhotoGallery photos={photos} title={data.title} />
          </div>
        )}

        {/* Festival type + title */}
        <div className={styles.subtitle}>{data.type}</div>
        <div className={styles.title}>{data.title}</div>

        {/* Dates */}
        {data.dates && (
          <div style={{ marginBottom: '12px', padding: '10px 12px', backgroundColor: 'rgba(201, 168, 76, 0.15)', borderLeft: '2.5px solid rgba(201, 168, 76, 0.6)', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontFamily: 'Cinzel, serif', fontWeight: '600' }}>
              📅 Datas
            </div>
            <div style={{ fontSize: '14px', color: 'var(--gold-light)', fontWeight: '600', fontFamily: 'Cinzel, serif' }}>
              {data.dates}
            </div>
          </div>
        )}

        {/* Municipality */}
        {data.municipality && (
          <div style={{ marginBottom: '12px', fontSize: '12px', color: 'rgba(201, 168, 76, 0.8)', fontFamily: 'Cinzel, serif' }}>
            📍 {data.municipality}
          </div>
        )}

        <div className={styles.text}>{data.text}</div>

        {/* Additional details */}
        {(data.population || data.specialty || data.history) && (
          <div style={{ marginTop: '20px' }}>
            {data.population && (
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'Cinzel, serif' }}>
                  Visitantes Esperados
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(245, 237, 214, 0.9)' }}>{data.population}</div>
              </div>
            )}
            {data.specialty && (
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'Cinzel, serif' }}>
                  Destaque
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(245, 237, 214, 0.9)' }}>{data.specialty}</div>
              </div>
            )}
            {data.history && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'Cinzel, serif' }}>
                  História
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(245, 237, 214, 0.9)', lineHeight: '1.5' }}>{data.history}</div>
              </div>
            )}
          </div>
        )}

        <div className={styles.tags}>
          {data.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Modal
