import React from 'react';

const RightSidebar = () => {
  return (
    <aside className="fixed right-0 top-16 w-1/5 p-4 mt-20 border-l border-gray-700 h-full hidden lg:block">
      <h3 className="text-lg font-bold mb-4">Tendências</h3>
      <ul>
        <li className="mb-2 cursor-pointer hover:text-gray-300">#NextJs - 1080 new posts today</li>
        <li className="mb-2 cursor-pointer hover:text-gray-300">#React - 1000 new posts today</li>
        <li className="mb-2 cursor-pointer hover:text-gray-300">#TailwindCSS - 831 new posts today</li>
      </ul>
    </aside>
  );
};

export default RightSidebar;
