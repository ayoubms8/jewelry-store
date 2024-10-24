import { useState } from 'react';
import './add.css';

interface AddJewelryProps {
  onAddSuccess: () => void;
}

const AddJewelry = ({ onAddSuccess }: AddJewelryProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/jewelry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price: parseFloat(price) }),
    });
    onAddSuccess();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Add New Jewelry</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-content">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter jewelry name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter jewelry description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" className="button">Add Jewelry</button>
        </div>
      </form>
    </div>
  );
};

export default AddJewelry;