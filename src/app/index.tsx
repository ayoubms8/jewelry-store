import { useEffect, useState } from 'react';

interface JewelryItem {
  id: number;
  name: string;
  price: number;
}

const Home = () => {
  const [jewelry, setJewelry] = useState<JewelryItem[]>([]);

  useEffect(() => {
    fetch('/api/jewelry')
      .then((res) => res.json())
      .then((data) => setJewelry(data));
  }, []);

  return (
    <div>
      <h1>Jewelry List</h1>
      <ul>
        {jewelry.map((item) => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;