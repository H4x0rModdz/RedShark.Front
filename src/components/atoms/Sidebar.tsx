export function Sidebar() {
    return (
      <aside className="w-64 bg-white border-r min-h-screen p-4">
        <h1 className="text-xl font-bold mb-4">Kaloka</h1>
        <input 
          type="text" 
          placeholder="Explore kaloka..." 
          className="w-full p-2 border rounded mb-4"
        />
        <nav className="space-y-2">
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200">Home</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200">Community</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200">Marketplace</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200">Kaloka events</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-200">News feed</a>
        </nav>
      </aside>
    );
  }