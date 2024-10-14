import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import RecordGrid from '../components/RecordGrid';
import StatisticsPanel from '../components/StatisticsPanel';
import AddRecordModal from '../components/AddRecordModal';

const VinylCollection = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="container mx-auto pt-20 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">My Vinyl Collection</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#1DB954] hover:bg-[#1ed760]">
          Add New Record
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <RecordGrid />
        </div>
        <div className="w-full md:w-1/3">
          <StatisticsPanel />
        </div>
      </div>
      <AddRecordModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default VinylCollection;