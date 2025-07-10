import React, { useState, lazy, Suspense } from 'react';
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Encuentra tu <span className="neon-highlight-word highlight-multichain">próxima</span> <span className="neon-highlight-word highlight-tickets">experiencia</span>
          </motion.h1>
          
          <motion.p 
            className="neural-hero-subtitle-enhanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Descubre eventos únicos, artistas increíbles y momentos inolvidables
          </motion.p>
          
          <BlockchainIcons />
          
          <motion.div 
            className="neural-hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button 
              className="neural-button primary"
              onClick={() => navigate('/eventos')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar Eventos
              <div className="button-glow" />
            </motion.button>
            <motion.button 
              className="neural-button secondary"
              onClick={() => navigate('/crear-evento')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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

      {/* TicketModal para checkout */}
      {isModalOpen && selectedEvent && (
        <TicketModal isOpen={isModalOpen} onClose={handleCloseCheckout} event={selectedEvent} />
      )}
    </div>
  );
};

export default NeuralHome; 