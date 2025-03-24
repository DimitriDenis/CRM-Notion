// src/components/notion/ExportModal.tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api/axios';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'contacts' | 'deals' | 'pipelines' | 'tags';
  selectedIds?: string[];
  entityName: string; // Nom au pluriel (ex: "Contacts")
}

export default function ExportModal({
  isOpen,
  onClose,
  entityType,
  selectedIds,
  entityName,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [exportAll, setExportAll] = useState(!selectedIds || selectedIds.length === 0);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(10);
    setError(null);
    
    try {
      const payload: any = {
        entities: [entityType],
      };
      
      if (!exportAll && selectedIds && selectedIds.length > 0) {
        payload.ids = {
          [entityType]: selectedIds
        };
      }
      
      setProgress(30);
      const response = await api.post('/api/export/notion', payload);
      setProgress(100);
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        throw new Error(response.data.message || 'Export failed');
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const resetModal = () => {
    setIsExporting(false);
    setProgress(0);
    setError(null);
    setResult(null);
    onClose();
  };

  const openInNotion = () => {
    if (result?.page_id) {
      window.open(`https://notion.so/${result.page_id.replace(/-/g, '')}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => !isExporting && resetModal()} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Exporter {entityName} vers Notion
            </Dialog.Title>
            <button 
              type="button"
              onClick={resetModal}
              disabled={isExporting}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {!isExporting && !result && !error && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Cela exportera votre {entityName.toLowerCase()} vers une base de données Notion.
              </p>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportAll}
                    onChange={() => setExportAll(!exportAll)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Export all {entityName.toLowerCase()}
                  </span>
                </label>
                
                {!exportAll && selectedIds && (
                  <p className="mt-2 text-sm text-gray-500">
                    You are about to export {selectedIds.length} selected {
                      selectedIds.length === 1 
                        ? entityName.substring(0, entityName.length - 1) 
                        : entityName.toLowerCase()
                    }.
                  </p>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetModal}
                  disabled={isExporting}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Export to Notion
                </button>
              </div>
            </div>
          )}
          
          {isExporting && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
              Exportation {entityName.toLowerCase()} vers Notion...
              </p>
              
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 text-right">
                  {progress}%
                </p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Échec de l'exportation
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          
          {result && (
            <div className="mt-4">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <DocumentArrowUpIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Exportation réussie
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Ton {entityName.toLowerCase()} ont été exportés vers Notion.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={openInNotion}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View in Notion
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}