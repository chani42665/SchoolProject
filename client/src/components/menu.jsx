import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  // מערך של דפים (ניתן להחליף את השמות והנתיבים)
  const pages = [
    { name: 'Students', path: '/students' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Classes', path: '/classes' },
    { name: 'Exams', path: '/exams' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      {/* Toolbar ברוחב מלא */}
      <div className="w-full bg-white shadow-md rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Main Menu</h1>
      </div>

      {/* תפריט ריבועים */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(page.path)}
          >
            <Button
              label={page.name}
              className="p-button-text text-lg font-semibold text-gray-800"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;