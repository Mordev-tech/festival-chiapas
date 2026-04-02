import styles from '../App.module.css'

export default function Pages({ currentPage, onNavigate }) {
  return (
    <div className={styles.pagesOverlay}>
      <div className={styles.pagesBox}>
        <h2 className={styles.pagesTitle}>Páginas</h2>
        <div className={styles.pagesList}>
          <button
            className={styles.pageButton}
            disabled={currentPage === 'home'}
            onClick={() => onNavigate('home')}
          >
            Início
          </button>
          <button
            className={styles.pageButton}
            disabled={currentPage === 'pages'}
            onClick={() => onNavigate('pages')}
          >
            Pages
          </button>
        </div>
        <p className={styles.pagesHint}>
          Use estes botões para alternar entre a tela principal e esta página de apoio.
        </p>
        <button className={styles.modalButton} onClick={() => onNavigate('home')}>
          Fechar
        </button>
      </div>
    </div>
  )
}
