// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const BackendTest = () => {
//   const [status, setStatus] = useState<'testing' | 'online' | 'offline' | 'error'>('testing');
//   const [details, setDetails] = useState<string>('');

//   useEffect(() => {
//     testBackend();
//   }, []);

//   const testBackend = async () => {
//     const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://localhost:7080';
//     setStatus('testing');
//     setDetails(`Testing connection to: ${baseUrl}`);

//     try {
//       // Test basic connectivity
//       const response = await axios.get(`${baseUrl}/api/health`);
      
//       if (response.status === 200) {
//         setStatus('online');
//         setDetails(`Backend is online! Health check response: ${JSON.stringify(response.data)}`);
//       } else {
//         setStatus('error');
//         setDetails(`Unexpected response: ${response.status} - ${response.statusText}`);
//       }
//     } catch (error: any) {
//       setStatus('offline');
      
//       if (error.code === 'ECONNREFUSED') {
//         setDetails('Connection refused. Backend is not running on port 7080.');
//       } else if (error.code === 'TIMEOUT' || error.code === 'ECONNABORTED') {
//         setDetails('Connection timeout. Backend may be slow or not responding.');
//       } else if (error.response) {
//         setDetails(`Server responded with error: ${error.response.status} - ${error.response.statusText}`);
//       } else if (error.request) {
//         setDetails('No response from server. Check if backend is running and CORS is configured.');
//       } else {
//         setDetails(`Network error: ${error.message}`);
//       }
//     }
//   };

//   if (process.env.NODE_ENV !== 'development') return null;

//   const getStatusColor = () => {
//     switch (status) {
//       case 'testing': return 'bg-blue-900/90 border-blue-700';
//       case 'online': return 'bg-green-900/90 border-green-700';
//       case 'offline': return 'bg-red-900/90 border-red-700';
//       case 'error': return 'bg-yellow-900/90 border-yellow-700';
//     }
//   };

//   const getStatusIcon = () => {
//     switch (status) {
//       case 'testing': return '🔄';
//       case 'online': return '✅';
//       case 'offline': return '❌';
//       case 'error': return '⚠️';
//     }
//   };

//   return (
//     <div className="fixed top-4 right-4 z-50">
//       <div className={`px-4 py-2 rounded-lg shadow-lg border text-white transition-all duration-300 ${getStatusColor()} max-w-md`}>
//         <div className="flex items-center space-x-2 mb-2">
//           <span className="text-lg">{getStatusIcon()}</span>
//           <span className="font-semibold">Backend Status: {status.toUpperCase()}</span>
//           <button 
//             onClick={testBackend}
//             className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs"
//           >
//             Retry
//           </button>
//         </div>
//         <p className="text-xs text-gray-200">{details}</p>
//         {status === 'offline' && (
//           <div className="mt-2 text-xs">
//             <p className="font-semibold">To fix:</p>
//             <ol className="list-decimal list-inside ml-2 text-gray-300">
//               <li>Start the backend server</li>
//               <li>Ensure it's running on port 7080</li>
//               <li>Check CORS configuration (should allow localhost:3000-3002)</li>
//             </ol>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BackendTest;