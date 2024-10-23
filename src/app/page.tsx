"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddJewelry from './add'; // Import the AddJewelry component

interface JewelryItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Home = () => {
  const [jewelry, setJewelry] = useState<JewelryItem[]>([]);
  const [editingItem, setEditingItem] = useState<JewelryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to control the display of AddJewelry
  const router = useRouter();

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
    <div>
      <h1>Jewelry List</h1>
      <button onClick={() => setShowAddForm(true)}>Add Jewelry</button> {/* Add button to show AddJewelry form */}
      <ul>
        {jewelry.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingItem && (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={editingItem.name}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <textarea
            value={editingItem.description}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
          />
          <input
            type="number"
            value={editingItem.price}
            onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
          />
          <button type="submit">Update Jewelry</button>
        </form>
      )}
      {showAddForm && <AddJewelry onAddSuccess={handleAddSuccess} />} {/* Conditionally render AddJewelry component */}
    </div>
  );
};

export default Home;