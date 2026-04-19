import React from 'react'
import type { ModalProps } from '../types'
import PhotoGallery from './PhotoGallery'
import styles from './Modal.module.css'

const Modal: React.FC<ModalProps> = ({ data, onClose }) => {
  if (!data) return null

  const photos = (() => {
    if (data.photos && data.photos.length > 0) return data.photos
    if (data.image) return [{ id: 'legacy', url: data.image }]
    return []
  })()

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* ── PICTURE ── */}
        {photos.length > 0 && (
          <div className={styles.pictureWrap}>
            <PhotoGallery photos={photos} title={data.title} />
          </div>
        )}

        <div className={styles.infoStack}>

          {/* ── INFO 1: tipo + título + descrição ── */}
          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>
              <span className={styles.infoDot} />
              {data.type}
            </div>
            <div className={styles.infoTitle}>{data.title}</div>
            {data.municipality && (
              <div className={styles.infoMunicipality}>📍 {data.municipality}</div>
            )}
            <p className={styles.infoText}>{data.text}</p>
          </div>

          {/* ── INFO 2: datas + visitantes + destaque ── */}
          {(data.dates || data.population || data.specialty) && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>
                <span className={styles.infoDot} />
                Detalhes
              </div>
              <div className={styles.infoGrid}>
                {data.dates && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoItemIcon}>📅</span>
                    <div>
                      <div className={styles.infoItemLabel}>Datas</div>
                      <div className={styles.infoItemValue}>{data.dates}</div>
                    </div>
                  </div>
                )}
                {data.population && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoItemIcon}>👥</span>
                    <div>
                      <div className={styles.infoItemLabel}>Visitantes</div>
                      <div className={styles.infoItemValue}>{data.population}</div>
                    </div>
                  </div>
                )}
                {data.specialty && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoItemIcon}>⭐</span>
                    <div>
                      <div className={styles.infoItemLabel}>Destaque</div>
                      <div className={styles.infoItemValue}>{data.specialty}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INFO 3: história + tags ── */}
          {(data.history || (data.tags && data.tags.length > 0)) && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>
                <span className={styles.infoDot} />
                História &amp; Categorias
              </div>
              {data.history && (
                <p className={styles.infoHistory}>{data.history}</p>
              )}
              {data.tags && data.tags.length > 0 && (
                <div className={styles.tags}>
                  {data.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Modal
