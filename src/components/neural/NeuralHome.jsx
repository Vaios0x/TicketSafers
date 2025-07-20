import React, { useState, lazy, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaTicketAlt, 
  FaLock, 
  FaChartLine, 
  FaUsers, 
  FaNetworkWired,
  FaGasPump,
  FaExchangeAlt,
  FaShieldAlt 
} from 'react-icons/fa';
import HeroSearch from './HeroSearch';
import BlockchainIcons from './BlockchainIcons';
import AnimatedSubtitle from './AnimatedSubtitle';
import useMobileOptimization from '../../hooks/useMobileOptimization';
import '../../styles/event-card.css';
import { eventsData } from '../../data/events.js';
import TicketModal from './TicketModal';

// Lazy load componentes pesados
const EventsGrid = lazy(() => import('./EventsGrid'));
const FeaturedEventsCarousel = lazy(() => import('./FeaturedEventsCarousel'));
const UpcomingEventsBanner = lazy(() => import('./UpcomingEventsBanner'));
const RealTimeStats = lazy(() => import('./RealTimeStats'));
const TestimonialsCarousel = lazy(() => import('./TestimonialsCarousel'));

// Componente de carga para componentes lazy
const LazyLoadingFallback = () => (
  <div style={{ 
    width: '100%', 
    height: '200px', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px'
  }}>
    <div className="loading-spinner" />
  </div>
);

// Datos de ejemplo para los componentes
const featuredEvents = [
  {
    id: 1,
    title: "Concierto de Rock en Vivo",
    date: "2024-07-15",
    location: "Arena Ciudad de México",
    price: "0.1 ETH",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "Festival de Arte Digital",
    date: "2024-08-20",
    location: "Centro Cultural Digital",
    price: "0.05 ETH",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "Conferencia Blockchain 2024",
    date: "2024-09-10",
    location: "Centro de Convenciones",
    price: "0.15 ETH",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2070&q=80"
  }
];

const upcomingEvents = eventsData.filter(e => e.type === 'proximos').slice(0, 4);

const testimonials = [
  {
    id: 1,
    text: "TicketSafer ha revolucionado la forma en que compro entradas. La seguridad blockchain y la facilidad de uso son increíbles.",
    name: "María González",
    role: "Organizadora de Eventos",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=128&h=128&q=80"
  },
  {
    id: 2,
    text: "Como artista, me encanta la transparencia y la protección contra la reventa que ofrece la plataforma.",
    name: "Carlos Ruiz",
    role: "Músico Independiente",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=128&h=128&q=80"
  },
  {
    id: 3,
    text: "La integración multichain es brillante. Puedo usar la red que prefiera con tarifas mínimas.",
    name: "Ana Martínez",
    role: "Crypto Entusiasta",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=128&h=128&q=80"
  }
];

const NeuralHome = () => {
  const navigate = useNavigate();
  const { getMotionConfig } = useMobileOptimization();
  const motionConfig = getMotionConfig();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    date: '',
    dateRange: 'all',
    chain: 'all',
    type: 'destacados',
    currency: 'all',
    priceRange: 'all',
    venue: 'all'
  });
  // Estado para el modal de checkout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 1. Agregar estado para loading y recomendaciones
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  // 2. Simular carga de recomendaciones (mock)
  useEffect(() => {
    setIsLoadingRecommendations(true);
    setTimeout(() => {
      // Mock de recomendaciones personalizadas
      setRecommendedEvents([
        {
          id: 101,
          title: "Jazz & Wine Night",
          date: "2024-07-22",
          location: "Foro Indie Rocks!",
          price: "0.08 ETH",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          availableTickets: 50,
          currency: "ETH"
        },
        {
          id: 102,
          title: "Expo Arte Urbano",
          date: "2024-08-05",
          location: "Museo Tamayo",
          price: "0.03 ETH",
          image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
          availableTickets: 120,
          currency: "ETH"
        },
        {
          id: 103,
          title: "Startup Night CDMX",
          date: "2024-08-18",
          location: "WeWork Reforma",
          price: "0.06 ETH",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", // Nueva imagen probada
          availableTickets: 80,
          currency: "ETH"
        }
      ]);
      setIsLoadingRecommendations(false);
    }, 1200);
  }, []);

  const handleSearch = (searchData) => {
    if (searchData.query) {
      setSearchTerm(searchData.query);
    }
    if (searchData.filters) {
      setFilters(prev => ({
        ...prev,
        ...searchData.filters
      }));
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleOpenCheckout = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const handleCloseCheckout = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="neural-home">
      {/* Hero Section */}
      <section className="neural-hero particle-field-neural">
        <div className="neural-hero-content">
          <motion.h1 
            className="neon-hero-title"
            {...motionConfig}
          >
            Encuentra tu <span className="neon-highlight-word highlight-multichain">próxima</span> <span className="neon-highlight-word highlight-tickets">experiencia</span>
          </motion.h1>
          
          <motion.p 
            className="neural-hero-subtitle-enhanced"
            {...motionConfig}
            transition={{ ...motionConfig.transition, delay: 0.2 }}
          >
            Descubre eventos únicos, artistas increíbles y momentos inolvidables
          </motion.p>
          
          <BlockchainIcons />
          
          <motion.div 
            className="neural-hero-cta"
            {...motionConfig}
            transition={{ ...motionConfig.transition, delay: 0.4 }}
          >
            <motion.button 
              className="neural-button primary"
              onClick={() => navigate('/eventos')}
              whileHover={motionConfig.whileHover}
              whileTap={motionConfig.whileTap}
            >
              Explorar Eventos
              <div className="button-glow" />
            </motion.button>
            <motion.button 
              className="neural-button secondary"
              onClick={() => navigate('/crear-evento')}
              whileHover={motionConfig.whileHover}
              whileTap={motionConfig.whileTap}
            >
              Crear Evento
              <div className="button-glow" />
            </motion.button>
          </motion.div>
        </div>
        <div className="ai-scan-line" />
      </section>

      {/* Hero Search Section */}
      <section className="hero-search-section">
        <div className="neural-container">
          <motion.div
            {...motionConfig}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HeroSearch onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Featured Events Section */}
      <Suspense fallback={<LazyLoadingFallback />}>
        <FeaturedEventsCarousel events={featuredEvents} />
      </Suspense>

      {/* Upcoming Events Banner */}
      <Suspense fallback={<LazyLoadingFallback />}>
        <UpcomingEventsBanner events={upcomingEvents} onEventClick={handleOpenCheckout} />
      </Suspense>

      {/* Real Time Stats */}
      <Suspense fallback={<LazyLoadingFallback />}>
        <RealTimeStats />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<LazyLoadingFallback />}>
        <TestimonialsCarousel testimonials={testimonials} />
      </Suspense>

      {/* Sección de recomendaciones personalizadas */}
      <section className="recommended-events-section">
        <div className="neural-container">
          <h2 className="section-title">Recomendado para ti</h2>
          {isLoadingRecommendations ? (
            <div className="events-loading">
              <div className="loading-spinner"></div>
              <p>Cargando recomendaciones...</p>
            </div>
          ) : recommendedEvents.length === 0 ? (
            <div className="no-events-message">
              <h3>No se encontraron recomendaciones</h3>
              <p>Pronto tendrás sugerencias personalizadas.</p>
            </div>
          ) : (
            <div className="recommended-events-grid">
              {recommendedEvents.map((event) => (
                <div key={event.id} className="recommended-event-card neural-glass">
                  <div className="recommended-event-image-wrapper">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="recommended-event-image"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'recommended-image-fallback';
                        fallback.innerHTML = `
                          <svg width='48' height='48' fill='none' viewBox='0 0 24 24' style='display:block;margin:0 auto 8px auto;'><path fill='#667eea' d='M21 7.24V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1.24a1 1 0 0 1 0 1.52V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.76a1 1 0 0 1 0-1.52ZM7 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'/></svg>
                          <div style='color:#a0aec0;font-size:1rem;text-align:center;'>${event.title}</div>
                        `;
                        e.target.parentNode.appendChild(fallback);
                      }}
                    />
                  </div>
                  <div className="recommended-event-content">
                    <div className="recommended-event-date-badge">{event.date}</div>
                    <h3 className="recommended-event-title">{event.title}</h3>
                    <div className="recommended-event-location-price">
                      <span className="recommended-event-location">{event.location}</span>
                      <span className="recommended-event-price">{event.price}</span>
                    </div>
                    <button className="recommended-buy-button" onClick={() => handleOpenCheckout(event)}>
                      Ver Tickets
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TicketModal para checkout */}
      {isModalOpen && selectedEvent && (
        <TicketModal isOpen={isModalOpen} onClose={handleCloseCheckout} event={selectedEvent} />
      )}
    </div>
  );
};

export default NeuralHome; 