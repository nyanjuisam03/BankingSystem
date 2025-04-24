import React from 'react';

function WaitingModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-900 bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[500px] h-[300px] flex flex-col items-center justify-center space-y-6">
        <div className="animate-spin border-8 border-gray-300 border-t-blue-600 rounded-full w-20 h-20"></div>
        <p className="text-xl font-semibold text-gray-800">Please wait a moment...</p>
      </div>
    </div>
  );
}

export default WaitingModal;
