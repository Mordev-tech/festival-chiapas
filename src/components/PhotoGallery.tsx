import React, { useState, useCallback, useEffect } from 'react'
import type { Photo } from '../types'
import styles from './PhotoGallery.module.css'

interface PhotoGalleryProps {
  photos: Photo[]
  title?: string
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, title }) => {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const total = photos?.length ?? 0

  useEffect(() => {
    setCurrent(0)
  }, [photos])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

  if (!total) return null

  const photo = photos[current]
  const isSingle = total === 1

  return (
    <>
      <div className={styles.slideshow}>
        <div className={styles.imageWrapper} onClick={() => setLightbox(true)}>
          {photos.map((p, i) => (
            <img
              key={p.id}
              src={p.url}
              alt={p.caption || `${title ?? 'Foto'} ${i + 1}`}
              className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
            />
          ))}

          <div className={styles.zoomHint}>🔍</div>

          {!isSingle && (
            <>
              <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Foto anterior"
                type="button"
              >
                ‹
              </button>
              <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Próxima foto"
                type="button"
              >
                ›
              </button>
            </>
          )}

          {!isSingle && (
            <div className={styles.counter}>
              {current + 1} / {total}
            </div>
          )}
        </div>

        {photo.caption && (
          <div className={styles.caption}>{photo.caption}</div>
        )}

        {!isSingle && (
          <div className={styles.dots}>
            {photos.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Foto ${i + 1}`}
                type="button"
              />
            ))}
          </div>
        )}

        {total > 1 && (
          <div className={styles.thumbStrip}>
            {photos.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
                onClick={() => setCurrent(i)}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
              >
                <img src={p.url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <button
            className={styles.lightboxClose}
            onClick={() => setLightbox(false)}
            type="button"
          >
            ✕
          </button>

          {!isSingle && (
            <button
              className={`${styles.lightboxArrow} ${styles.lightboxLeft}`}
              onClick={(e) => { e.stopPropagation(); prev() }}
              type="button"
            >
              ‹
            </button>
          )}

          <img
            src={photo.url}
            alt={photo.caption || ''}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />

          {!isSingle && (
            <button
              className={`${styles.lightboxArrow} ${styles.lightboxRight}`}
              onClick={(e) => { e.stopPropagation(); next() }}
              type="button"
            >
              ›
            </button>
          )}

          {photo.caption && (
            <div className={styles.lightboxCaption}>{photo.caption}</div>
          )}

          {!isSingle && (
            <div className={styles.lightboxCounter}>{current + 1} / {total}</div>
          )}
        </div>
      )}
    </>
  )
}

export default PhotoGallery
