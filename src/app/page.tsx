"use client";

import { useEffect, useState } from 'react';
import AddJewelry from './add';
import './page.css';

interface JewelryItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Home = () => {
  const [jewelry, setJewelry] = useState<JewelryItem[]>([]);
  const [editingItem, setEditingItem] = useState<JewelryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch('/api/jewelry')
      .then((res) => res.json())
      .then((data) => setJewelry(data));
  }, []);

  const handleDelete = async (id: number) => {
    await fetch('/api/jewelry', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setJewelry(jewelry.filter((item) => item.id !== id));
  };

  const handleEdit = (item: JewelryItem) => {
    setEditingItem(item);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingItem) {
      await fetch('/api/jewelry', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });
      setJewelry(jewelry.map((item) => (item.id === editingItem.id ? editingItem : item)));
      setEditingItem(null);
    }
  };

  const handleAddSuccess = async () => {
    setShowAddForm(false);
    const res = await fetch('/api/jewelry');
    const data = await res.json();
    setJewelry(data);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Jewelry Collection</h1>
        <button 
          className="button button-primary"
          onClick={() => setShowAddForm(true)}
        >
          <svg className="icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M12 5v14M5 12h14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Jewelry
        </button>
      </div>

      <div className="grid">
        {jewelry.map((item) => (
          <div key={item.id} className="card">
            <div className="card-header">
              <div className="card-title">
                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="card-content">
              <p className="item-description">{item.description}</p>
            </div>
            <div className="card-footer">
              <button 
                className="button button-outline"
                onClick={() => handleEdit(item)}
              >
                <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
              <button 
                className="button button-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3-3h6M10 11v6M14 11v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="card-header">
              <h2 className="card-title">Edit Jewelry Item</h2>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="card-content">
                <div className="form-group">
                  <label htmlFor="edit-name">Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-price">Price</label>
                  <input
                    id="edit-price"
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="card-footer">
                <button 
                  type="button" 
                  className="button button-outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddJewelry onAddSuccess={handleAddSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;