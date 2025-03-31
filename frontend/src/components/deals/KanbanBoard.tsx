// src/components/deals/KanbanBoard.tsx
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableStateSnapshot, DraggableProvided } from '@hello-pangea/dnd';
import { dealsApi, Deal } from '@/lib/api/deals';
import { Pipeline, Stage } from '@/lib/api/pipelines';
import { DealCard } from './DealCard';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface KanbanBoardProps {
  pipeline: Pipeline;
}

export function KanbanBoard({ pipeline }: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <div className="animate-pulse p-4 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // S'assurer que toutes les étapes ont un ID défini
  const validStages = pipeline.stages.filter(stage => stage.id !== undefined);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-6 space-x-4">
        {validStages.map(stage => {
          // Utiliser une assertion de type non-null (!) puisqu'on a déjà filtré les étapes sans ID
          const stageId = stage.id!;
          
          return (
            <div
              key={stageId}
              className="flex-shrink-0 w-72 bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex justify-between items-center">
                <span>{stage.name}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {getDealsForStage(stageId).length} deals
                </span>
              </h3>
              <Droppable droppableId={stageId}
              isDropDisabled={false}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[12rem] space-y-3 ${
                      snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    {getDealsForStage(stageId).map((deal, index) => (
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
                              snapshot.isDragging ? 'shadow-lg dark:shadow-gray-900' : ''
                            }`}
                          >
                            <DealCard deal={deal} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Link
                      href={`/deals/new?pipelineId=${pipeline.id || ''}&stageId=${stageId}`}
                      className="flex items-center p-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
  );
}