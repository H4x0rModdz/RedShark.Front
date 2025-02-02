export function Trending() {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-3">Today Trending</h2>
        <ul className="space-y-2">
          <li className="flex justify-between text-sm"><span>Figma maintenance</span> <span>125 posts</span></li>
          <li className="flex justify-between text-sm"><span>Blender Update</span> <span>117 posts</span></li>
          <li className="flex justify-between text-sm"><span>Slackoverflow server</span> <span>57 posts</span></li>
          <li className="flex justify-between text-sm"><span>Javascript new</span> <span>32 posts</span></li>
        </ul>
      </div>
    );
  }