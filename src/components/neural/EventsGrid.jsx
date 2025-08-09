import React, { useState, useEffect, useCallback, useRef } from 'react';
import EventCard from './EventCard';
import TicketModal from './TicketModal';
import { eventsData } from '../../data/events.js';
import '../../styles/events-grid.css';

const EventsGrid = ({ searchTerm = '', filters = {}, maxEvents = null, enablePagination = false }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const eventsGridRef = useRef(null);
  const eventsPerPage = 12;
  const [filteredEvents, setFilteredEvents] = useState([]);

  const filterEvents = useCallback(() => {
    let filtered = [...eventsData];

    // Filtrar por término de búsqueda
    if (filters.query) {
      const searchLower = filters.query.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por categoría
    if (filters.category && filters.category !== 'todo') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Filtrar por ubicación
    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.includes(filters.location)
      );
    }

    // Filtrar por fecha
    if (filters.date) {
      const selectedDate = new Date(filters.date);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Limitar el número de eventos si se especifica
    if (maxEvents) {
      filtered = filtered.slice(0, maxEvents);
    }

    setFilteredEvents(filtered);
  }, [filters, maxEvents]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  // Calcular páginas
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Manejar cambio de página
  const handlePageChange = useCallback(async (page) => {
    if (page === currentPage) return;
    
    setIsLoading(true);
    setCurrentPage(page);
    setShouldScroll(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsLoading(false);
  }, [currentPage]);

  // Efecto para scroll
  useEffect(() => {
    if (shouldScroll && eventsGridRef.current && !isLoading) {
      const gridTop = eventsGridRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offset = 100; // Ajustado para mejor visibilidad
      
      window.scrollTo({ 
        top: Math.max(0, gridTop - offset),
        behavior: 'smooth' 
      });
      
      setShouldScroll(false);
    }
  }, [shouldScroll, isLoading]);

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Manejar evento seleccionado
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="events-grid-container px-4 md:px-6 lg:px-8" ref={eventsGridRef}>
      {isLoading ? (
        <div className="events-loading flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="loading-spinner"></div>
          <p className="text-sm text-slate-300">Cargando eventos...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="no-events-message text-center py-16 space-y-2">
          <h3 className="text-lg font-semibold">No se encontraron eventos</h3>
          <p className="text-slate-300">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <>
          <div className="events-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={handleEventClick}
              />
            ))}
          </div>
          
          {enablePagination && totalPages > 1 && (
            <div className="pagination-container mt-8 flex flex-col items-center gap-4">
              <div className="pagination-info text-sm text-slate-300">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} de {filteredEvents.length} eventos
              </div>
              <div className="pagination-controls flex flex-wrap items-center gap-2">
                <button 
                  className="pagination-button px-3 py-2"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  Primera
                </button>
                <button
                  className="pagination-button px-3 py-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <div className="pagination-numbers flex gap-2"
                >
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-number ${currentPage === pageNum ? 'active' : ''} px-3 py-2`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  className="pagination-button px-3 py-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
                <button
                  className="pagination-button px-3 py-2"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Última
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedEvent && (
        <TicketModal 
          isOpen={isModalOpen}
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default EventsGrid; 