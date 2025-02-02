export function Feed() {
    return (
      <div>
        <div className="bg-white p-4 rounded shadow mb-4">
          <input 
            type="text" 
            placeholder="What’s on your mind?" 
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2 mt-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Post</button>
          </div>
        </div>
        
        <Post 
          name="Lucky Andreas" 
          time="12 minutes ago" 
          content="What is the reason guys yesterday I uploaded same kind of content they approved it but when today I tried to upload they say we no longer accept this type of content"
          likes={1700}
          comments={45}
          shares={12}
        />
      </div>
    );
  }