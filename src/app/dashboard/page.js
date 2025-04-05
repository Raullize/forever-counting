'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

// REFERENCE_DATE é a data de referência do contador no formato YYYY-MM-DD
const REFERENCE_DATE = new Date('2022-12-22T00:00:00');

// IMAGES é o array de imagens do carrossel
const IMAGES = [
  `https://placehold.co/800x600/ffafbd/ffffff?text=Foto+1`,
  `https://placehold.co/800x600/ffc3a0/ffffff?text=Foto+2`,
  `https://placehold.co/800x600/ff69b4/ffffff?text=Foto+3`,
  `https://placehold.co/800x600/ffd1dc/ffffff?text=Foto+4`,
  `https://placehold.co/800x600/ff1493/ffffff?text=Foto+5`,
];

// SPOTIFY_PLAYLIST_URI é o URI da playlist do Spotify, substitua pelo URI da sua playlist
const SPOTIFY_PLAYLIST_URI = 'spotify:playlist:37i9dQZF1DX7rOY2tZUw1k';

export default function Dashboard() {
  const router = useRouter();
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [animateCards, setAnimateCards] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const spotifyPlayerRef = useRef(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Função para calcular o tempo decorrido
  const calculateTimeElapsed = () => {
    const now = new Date();
    const diff = now - REFERENCE_DATE;
    
    // Calculando anos, dias, horas, minutos e segundos
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    let remainingDiff = diff % (1000 * 60 * 60 * 24 * 365);
    
    const days = Math.floor(remainingDiff / (1000 * 60 * 60 * 24));
    remainingDiff = remainingDiff % (1000 * 60 * 60 * 24);
    
    const hours = Math.floor(remainingDiff / (1000 * 60 * 60));
    remainingDiff = remainingDiff % (1000 * 60 * 60);
    
    const minutes = Math.floor(remainingDiff / (1000 * 60));
    remainingDiff = remainingDiff % (1000 * 60);
    
    const seconds = Math.floor(remainingDiff / 1000);
    
    setTimeElapsed({ years, days, hours, minutes, seconds });
  };

  // Efeito para atualizar o tempo a cada segundo
  useEffect(() => {
    calculateTimeElapsed();
    const timer = setInterval(calculateTimeElapsed, 1000);
    return () => clearInterval(timer);
  }, []);

  // Efeito para trocar a imagem do carrossel automaticamente
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(imageInterval);
  }, []);

  // Efeito para animar os cards
  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Efeito para carregar o script do Spotify Embed
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
    script.async = true;
    
    script.onload = () => {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const element = document.getElementById('spotify-embed');
        
        if (element) {
          const options = {
            theme: 'dark',
            uri: 'spotify:playlist:37i9dQZF1DX7rOY2tZUw1k'
          };
          
          // Criar o player
          const callback = (EmbedController) => {
            spotifyPlayerRef.current = EmbedController;
            
            // Registrar event listener para mudanças de estado do player
            spotifyPlayerRef.current.addListener('playback_update', (e) => {
              setIsMusicPlaying(!e.data.isPaused);
            });
            
            // Apenas garantir que não tenha bordas
            try {
              const iframe = document.querySelector('iframe[src*="spotify"]');
              if (iframe) {
                iframe.style.border = 'none';
                iframe.style.borderRadius = '12px';
              }
            } catch (error) {
              console.error('Erro ao estilizar iframe:', error);
            }
          };
          
          IFrameAPI.createController(element, options, callback);
        }
      };
    };
    
    document.body.appendChild(script);
    
    // Limpar ao desmontar
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Função para controlar a reprodução de música
  const toggleMusic = () => {
    try {
      if (spotifyPlayerRef.current) {
        if (isMusicPlaying) {
          spotifyPlayerRef.current.pause();
        } else {
          spotifyPlayerRef.current.play();
        }
      }
    } catch (error) {
      console.error('Erro ao controlar o player do Spotify:', error);
    }
  };

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Função para avançar ou voltar no carrossel
  const navigateCarousel = (direction) => {
    if (direction === 'next') {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    } else {
      setCurrentImage((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.glassOverlay}></div>
      
      {isLoggingOut && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.loadingCircle}></div>
            <div className={styles.loadingCircle}></div>
            <div className={styles.loadingHeart}>❤️</div>
            <div className={styles.loadingMessage}>Saindo...</div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <h1 className={styles.title}>
            <span className={styles.titleFirst}>Forever</span>
            <span className={styles.titleSecond}>Counting</span>
          </h1>
        </div>
        <div className={styles.headerControls}>
          <button 
            onClick={toggleMusic} 
            className={styles.musicButton}
            title={isMusicPlaying ? "Pausar música" : "Tocar música"}
          >
            {isMusicPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
            <span>Música</span>
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </header>

      <section className={styles.dashboardContainer}>
        <div className={styles.loveSection}>
          <div className={styles.loveQuote}>
            <span className={styles.quoteSubtext}>Nosso amor em números</span>
            <h2 className={styles.quoteText}>Eu te amo há:</h2>
          </div>

          <div className={styles.counterContainer}>
            <div className={`${styles.timeCard} ${animateCards ? styles.animate : ''}`} style={{ animationDelay: '0.1s' }}>
              <div className={styles.timeCardInner}>
                <span className={styles.count}>{timeElapsed.years}</span>
                <span className={styles.label}>Anos</span>
              </div>
            </div>
            <div className={`${styles.timeCard} ${animateCards ? styles.animate : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className={styles.timeCardInner}>
                <span className={styles.count}>{timeElapsed.days}</span>
                <span className={styles.label}>Dias</span>
              </div>
            </div>
            <div className={`${styles.timeCard} ${animateCards ? styles.animate : ''}`} style={{ animationDelay: '0.3s' }}>
              <div className={styles.timeCardInner}>
                <span className={styles.count}>{timeElapsed.hours}</span>
                <span className={styles.label}>Horas</span>
              </div>
            </div>
            <div className={`${styles.timeCard} ${animateCards ? styles.animate : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className={styles.timeCardInner}>
                <span className={styles.count}>{timeElapsed.minutes}</span>
                <span className={styles.label}>Minutos</span>
              </div>
            </div>
            <div className={`${styles.timeCard} ${animateCards ? styles.animate : ''}`} style={{ animationDelay: '0.5s' }}>
              <div className={styles.timeCardInner}>
                <span className={styles.count}>{timeElapsed.seconds}</span>
                <span className={styles.label}>Segundos</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.photoSection}>
          <h3 className={styles.sectionTitle}>Nossos Momentos</h3>
          
          <div className={styles.carouselContainer}>
            <button 
              className={`${styles.carouselNav} ${styles.prevBtn}`}
              onClick={() => navigateCarousel('prev')}
              aria-label="Foto anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className={styles.carousel}>
              <div className={styles.imageWrapper} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                {IMAGES.map((src, index) => (
                  <div key={index} className={styles.imageContainer}>
                    <img 
                      src={src} 
                      alt={`Foto do casal ${index + 1}`}
                      className={styles.carouselImage}
                    />
                  </div>
                ))}
              </div>
              
              <div className={styles.imageProgress}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${((currentImage + 1) / IMAGES.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              className={`${styles.carouselNav} ${styles.nextBtn}`}
              onClick={() => navigateCarousel('next')}
              aria-label="Próxima foto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <div className={styles.thumbnailsRow}>
            {IMAGES.map((src, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnail} ${index === currentImage ? styles.activeThumbnail : ''}`}
                onClick={() => setCurrentImage(index)}
              >
                <img src={src} alt={`Miniatura ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Player do Spotify */}
        <div className={styles.musicSection}>
          <div className={styles.playerWrapper}>
            <div id="spotify-embed" className={styles.spotifyPlayer}></div>
          </div>
        </div>
      </section>

      <div className={styles.backgroundHearts}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`${styles.heart} ${styles['heart' + (i % 5)]}`}>
            ❤️
          </div>
        ))}
      </div>
    </main>
  );
} 