export function SuggestedCommunities() {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-3">Suggested Community</h2>
        <div className="flex items-center space-x-3">
          <img src="/figma.png" alt="Figma Desainer" className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-sm font-bold">Figma Desainer</p>
            <p className="text-xs text-gray-500">1425 members</p>
          </div>
        </div>
      </div>
    );
  }