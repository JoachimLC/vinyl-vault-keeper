import React, { useState, useEffect } from 'react'; // Add useEffect
import { Button } from "@/components/ui/button";
import RecordGrid from '../components/RecordGrid';
import StatisticsPanel from '../components/StatisticsPanel';
import AddRecordModal from '../components/AddRecordModal';
import AlbumSuggestions from '../components/AlbumSuggestions';
import axios from 'axios'; // Import axios

const VinylCollection = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userCollection, setUserCollection] = useState([]); // State for user collection

  useEffect(() => {
    // Function to fetch user collection
    const fetchUserCollection = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/records', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCollection(response.data); // Set the user collection data
      } catch (error) {
        console.error('Error fetching user collection:', error);
      }
    };

    fetchUserCollection();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="container mx-auto pt-20 px-4">
      <AlbumSuggestions userCollection={userCollection} /> {/* Pass userCollection as prop */}
      <div className="flex justify-between items-center my-8">
        <h1 className="text-3xl font-bold text-[#333333]">My Vinyl Collection</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#1DB954] hover:bg-[#1ed760]">
          Add New Record
        </Button>
      </div>
      <div className="space-y-8">
        <RecordGrid />
        <StatisticsPanel />
      </div>
      <AddRecordModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default VinylCollection;
