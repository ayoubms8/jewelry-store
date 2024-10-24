"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AddJewelry from './add';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Jewelry Collection</h1>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add Jewelry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jewelry.map((item) => (
          <Card key={item.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-xl">{item.name}</span>
                <span className="text-lg font-semibold text-green-600">
                  ${item.price.toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleEdit(item)}
                className="flex items-center gap-1"
              >
                <Pencil size={16} />
                Edit
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Jewelry Item</CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <AddJewelry onAddSuccess={handleAddSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;