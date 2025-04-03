'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

// Data de referência: 22/12/2022
const REFERENCE_DATE = new Date('2022-12-22T00:00:00');

// Placeholders para o carrossel (em uma aplicação real, seriam fotos do casal)
const IMAGES = [
  `https://placehold.co/600x400/ffafbd/ffffff?text=Foto+1`,
  `https://placehold.co/600x400/ffc3a0/ffffff?text=Foto+2`,
  `https://placehold.co/600x400/ff69b4/ffffff?text=Foto+3`,
  `https://placehold.co/600x400/ffd1dc/ffffff?text=Foto+4`,
  `https://placehold.co/600x400/ff1493/ffffff?text=Foto+5`,
];

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

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>ForeverCounting</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.loveQuote}>
          <h2>Eu te amo há:</h2>
        </div>

        <div className={styles.counter}>
          <div className={styles.counterItem}>
            <span className={styles.count}>{timeElapsed.years}</span>
            <span className={styles.label}>Anos</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.count}>{timeElapsed.days}</span>
            <span className={styles.label}>Dias</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.count}>{timeElapsed.hours}</span>
            <span className={styles.label}>Horas</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.count}>{timeElapsed.minutes}</span>
            <span className={styles.label}>Minutos</span>
          </div>
          <div className={styles.counterItem}>
            <span className={styles.count}>{timeElapsed.seconds}</span>
            <span className={styles.label}>Segundos</span>
          </div>
        </div>

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
          <div className={styles.dots}>
            {IMAGES.map((_, index) => (
              <span 
                key={index} 
                className={`${styles.dot} ${index === currentImage ? styles.activeDot : ''}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>
      </div>

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