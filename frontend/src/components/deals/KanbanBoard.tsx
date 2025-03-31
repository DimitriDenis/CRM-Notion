// src/components/deals/KanbanBoard.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableStateSnapshot, DraggableProvided } from '@hello-pangea/dnd';
import { dealsApi, Deal } from '@/lib/api/deals';
import { Pipeline, Stage } from '@/lib/api/pipelines';
import { DealCard } from './DealCard';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface KanbanBoardProps {
  pipeline: Pipeline;
}

export function KanbanBoard({ pipeline }: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchDeals = async () => {
    try {
        if (!pipeline.id) {
            setError('ID du pipeline non défini');
            setIsLoading(false);
            return;
          }
      setIsLoading(true);
      const fetchedDeals = await dealsApi.getDealsByPipeline(pipeline.id);
      setDeals(fetchedDeals);
      setError(null);
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Une erreur est survenue lors du chargement des deals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [pipeline.id]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the deal
    const dealId = draggableId;
    const newStageId = destination.droppableId;

    // Update the deal in the UI
    setDeals(prev =>
      prev.map(deal =>
        deal.id === dealId ? { ...deal, stageId: newStageId } : deal
      )
    );

    // Update the deal in the backend
    try {
      await dealsApi.updateDeal(dealId, { stageId: newStageId });
    } catch (err) {
      console.error('Error updating deal stage:', err);
      setError('Erreur lors de la mise à jour du deal');
      // Revert the change in the UI
      fetchDeals();
    }
  };

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => deal.stageId === stageId);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const getTotalValue = (stageId: string) => {
    return getDealsForStage(stageId)
      .reduce((total, deal) => total + (deal.value || 0), 0)
      .toLocaleString('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
  };

  if (isLoading) {
    <div className="animate-pulse p-4 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg my-4 border border-gray-200 dark:border-gray-700"></div>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // S'assurer que toutes les étapes ont un ID défini
  const validStages = pipeline.stages.filter(stage => stage.id !== undefined);

  return (
    <div className="relative">
      {/* Navigation buttons for mobile/tablet */}
      <div className="md:hidden flex justify-between mb-2 px-2">
        <button 
          onClick={scrollLeft}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Défiler à gauche"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={scrollRight}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Défiler à droite"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 space-x-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {validStages.map(stage => {
            // Utiliser une assertion de type non-null (!) puisqu'on a déjà filtré les étapes sans ID
            const stageId = stage.id!;
            const stageDeals = getDealsForStage(stageId);
            
            return (
              <div
                key={stageId}
                className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-gray-100 dark:bg-gray-700/50 p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex justify-between items-center">
                    <span>{stage.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                      {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                    </span>
                  </h3>
                  {stageDeals.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Total: {getTotalValue(stageId)}
                    </div>
                  )}
                </div>
                <Droppable droppableId={stageId} isDropDisabled={false}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[12rem] p-2 space-y-3 transition-colors duration-150 ${
                        snapshot.isDraggingOver ? 'bg-blue-50/80 dark:bg-blue-900/20' : 'bg-transparent'
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id || ''}
                          index={index}
                        >
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging ? 'shadow-lg dark:shadow-gray-900 scale-105 z-10' : ''
                              } transition-transform duration-200`}
                            >
                              <DealCard deal={deal} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <Link
                        href={`/deals/new?pipelineId=${pipeline.id || ''}&stageId=${stageId}`}
                        className="flex items-center p-2 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-white/50 dark:bg-gray-700/30 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Ajouter un deal
                      </Link>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Desktop Navigation (hidden on mobile) */}
      <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 -ml-4">
        <button 
          onClick={scrollLeft}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Défiler à gauche"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 -mr-4">
        <button 
          onClick={scrollRight}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Défiler à droite"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}