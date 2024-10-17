import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';

const AddRecordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: '',
    label: '',
    genre: '',
    cover: null,
    rating: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, genre: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cover: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('artist', formData.artist);
    formDataObj.append('year', formData.year);
    formDataObj.append('label', formData.label);
    formDataObj.append('genre', formData.genre);
    formDataObj.append('rating', parseInt(formData.rating, 10));
  
    if (formData.cover) {
      formDataObj.append('cover', formData.cover);
    }
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('http://localhost:5000/records', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,  // Include the JWT token
        },
      });
      console.log('New record added:', response.data);
      onClose();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="artist" className="text-right">
                Artist
              </Label>
              <Input
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Year
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Label
              </Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cover" className="text-right">
                Cover
              </Label>
              <Input
                id="cover"
                name="cover"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordModal;
