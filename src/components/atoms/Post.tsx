interface PostProps {
    name: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
  }
  

function Post({ name , time, content, likes, comments, shares }: PostProps) {
    return (
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-bold">{name}</span>
          <span className="text-gray-500 text-sm">{time}</span>
        </div>
        <p className="mb-2">{content}</p>
        <div className="flex space-x-4 text-gray-600 text-sm">
          <span>👍 {likes} Liked</span>
          <span>💬 {comments} Comments</span>
          <span>🔄 {shares} Shares</span>
        </div>
      </div>
    );
  }