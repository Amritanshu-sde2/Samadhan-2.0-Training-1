
import React from 'react';
import './index.css';

const products = [
  { id: 1, name: 'Wireless Headphones', description: 'Experience crystal-clear audio with these comfortable over-ear headphones.', price: 99.99, image: 'https://via.placeholder.com/400x300.png?text=Headphones' },
  { id: 2, name: 'Smartwatch', description: 'Track your fitness goals and stay connected with this sleek smartwatch.', price: 199.99, image: 'https://via.placeholder.com/400x300.png?text=Smartwatch' },
  { id: 3, name: 'Portable Speaker', description: 'Take your music anywhere with this powerful and compact Bluetooth speaker.', price: 75.50, image: 'https://via.placeholder.com/400x300.png?text=Speaker' },
  { id: 4, name: 'Ergonomic Keyboard', description: 'Designed for comfort and efficiency, reducing strain during long work sessions.', price: 125.00, image: 'https://via.placeholder.com/400x300.png?text=Keyboard' },
  { id: 5, name: 'Laptop Backpack', description: 'A stylish and secure way to carry your laptop and essentials on the go.', price: 59.99, image: 'https://via.placeholder.com/400x300.png?text=Backpack' },
  { id: 6, name: 'VR Headset', description: 'Immerse yourself in virtual worlds with stunning visuals and realistic sounds.', price: 349.99, image: 'https://via.placeholder.com/400x300.png?text=VR+Headset' },
];


const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};


const ProductList = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};


const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ProductList />
    </div>
  );
};

export default App;
