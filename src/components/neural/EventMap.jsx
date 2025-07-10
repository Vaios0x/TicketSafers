import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import Map, { 
  Marker, 
  Popup, 
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl
} from 'react-map-gl';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaCompass, FaArrowRight, FaClock, FaUsers } from 'react-icons/fa';
import TicketModal from './TicketModal';
import '../../styles/event-map.css';

// Constantes del mapa
const INITIAL_VIEW_STATE = {
  latitude: 19.4326,
  longitude: -99.1332,
  zoom: 11,
  bearing: 0,
  pitch: 0
};

// Opciones de estilos de mapas
const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v12',
  VIBRANT: 'mapbox://styles/mapbox/navigation-day-v1',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11'
};

const MAP_STYLE = MAP_STYLES.SATELLITE; // Cambiado a estilo satélite por defecto

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidmFpb3M0NCIsImEiOiJjbWNjZDN3a24wN2NiMmpwcnJ3ejdiZnQ5In0.OSq9I4OIDU8aJFLqRclkZw';

// Configurar Mapbox para desarrollo
if (import.meta.env.DEV) {
  // Deshabilitar analytics en desarrollo
  mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
}

const EventMap = ({ events = [], searchTerm = '', filters = {} }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState(INITIAL_VIEW_STATE);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState(MAP_STYLE);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [is3D, setIs3D] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);

  // Memoizar los marcadores de eventos
  const eventMarkers = useMemo(() => 
    filteredEvents
      .filter(event => {
        // Validar que las coordenadas sean números válidos
        return !isNaN(event.latitude) && 
               !isNaN(event.longitude) && 
               event.latitude !== null && 
               event.longitude !== null;
      })
      .map((event) => (
        <Marker
          key={`${event.id}-${event.latitude}-${event.longitude}`}
          latitude={event.latitude}
          longitude={event.longitude}
          anchor="bottom"
        >
          <motion.div
            className="event-marker"
            onClick={() => handleMarkerClick(event)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: event.isFeatured ? '#7c3aed' : '#2563eb',
              border: `2px solid ${event.isFeatured ? '#a78bfa' : '#60a5fa'}`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            <FaMapMarkerAlt />
          </motion.div>
        </Marker>
      )), [filteredEvents]);

  const handleMarkerClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleViewTickets = useCallback((event) => {
    setSelectedEventForModal(event);
    setIsModalOpen(true);
    setSelectedEvent(null); // Cerrar el popup
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEventForModal(null);
  }, []);

  const handleViewportChange = useCallback((newViewport) => {
    setViewport(prev => ({
      ...prev,
      ...newViewport
    }));
  }, []);

  const toggle3D = useCallback(() => {
    setIs3D(prev => !prev);
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.easeTo({
        pitch: !is3D ? 60 : 0,
        bearing: !is3D ? 45 : 0,
        duration: 1000
      });
    }
  }, [is3D]);

  useEffect(() => {
    try {
      // Filtrar eventos
      const filtered = events.filter(event => {
        const searchMatch = !searchTerm || 
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const categoryMatch = !filters.category || filters.category === 'todo' || 
          event.category?.toLowerCase() === filters.category.toLowerCase();

        const locationMatch = !filters.location || 
          event.location?.toLowerCase().includes(filters.location.toLowerCase());

        const dateMatch = !filters.date || 
          new Date(event.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString();

        return searchMatch && categoryMatch && locationMatch && dateMatch;
      });

      setFilteredEvents(filtered);

      // Ajustar el viewport para mostrar todos los eventos filtrados
      if (filtered.length > 0 && mapRef.current && mapboxgl) {
        try {
          const coordinates = filtered
            .filter(event => !isNaN(event.latitude) && !isNaN(event.longitude))
            .map(event => [event.longitude, event.latitude]);
          
          if (coordinates.length > 0) {
            const map = mapRef.current.getMap();
            if (map && mapboxgl.LngLatBounds) {
              const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
              }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

              map.fitBounds(bounds, {
                padding: 50,
                duration: 1000
              });
            }
          }
        } catch (boundsError) {
          console.warn('Error al ajustar bounds del mapa:', boundsError);
        }
      }
    } catch (err) {
      console.error('Error al procesar eventos:', err);
      setError(err.message);
    }
  }, [events, searchTerm, filters]);

  if (error) {
    return (
      <div className="map-error">
        <h3>Error al cargar el mapa</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Reintentar</button>
      </div>
    );
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="map-error">
        <h3>Error: Token de Mapbox no encontrado</h3>
        <p>Por favor, configura VITE_MAPBOX_TOKEN en tu archivo .env</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="map-container">
      <Map
        ref={mapRef}
        reuseMaps
        initialViewState={INITIAL_VIEW_STATE}
        {...viewport}
        style={{width: '100%', height: '100%'}}
        mapStyle={currentMapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={() => setMapLoaded(true)}
        onMove={evt => handleViewportChange(evt.viewState)}
        onError={(err) => {
          // Ignorar errores de analytics bloqueados
          if (err.message && err.message.includes('ERR_BLOCKED_BY_CLIENT')) {
            console.warn('Analytics de Mapbox bloqueados por el navegador');
            return;
          }
          setError(err.message);
        }}
        trackResize={false}
        attributionControl={false}
      >
        <GeolocateControl 
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
        />
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" showCompass showZoom />
        <ScaleControl />
        
        {eventMarkers}

        {selectedEvent && !isNaN(selectedEvent.latitude) && !isNaN(selectedEvent.longitude) && (
          <Popup
            latitude={selectedEvent.latitude}
            longitude={selectedEvent.longitude}
            onClose={() => setSelectedEvent(null)}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -30]}
          >
            <div className="event-popup">
              <h3>{selectedEvent.title}</h3>
              <p>{selectedEvent.description}</p>
              <div className="event-details">
                <p><FaCalendarAlt /> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p><FaClock /> {selectedEvent.time || '20:00'} hrs</p>
                <p><FaMapMarkerAlt /> {selectedEvent.location}</p>
                <p><FaTicketAlt /> {selectedEvent.price} {selectedEvent.currency}</p>
                <p><FaUsers /> {selectedEvent.availableTickets} tickets disponibles</p>
                <button 
                  className="view-tickets-button"
                  onClick={() => handleViewTickets(selectedEvent)}
                >
                  Ver Tickets <FaArrowRight />
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      <div className="map-controls">
        <button 
          className={`map-control-button ${is3D ? 'active' : ''}`}
          onClick={toggle3D}
        >
          <FaCompass /> {is3D ? '2D' : '3D'}
        </button>
        <select 
          value={Object.keys(MAP_STYLES).find(key => MAP_STYLES[key] === currentMapStyle)}
          onChange={(e) => setCurrentMapStyle(MAP_STYLES[e.target.value])}
          className="map-style-select"
        >
          {Object.keys(MAP_STYLES).map(style => (
            <option key={style} value={style}>
              {style.charAt(0) + style.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {isModalOpen && selectedEventForModal && (
        <TicketModal
          event={selectedEventForModal}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default EventMap; 