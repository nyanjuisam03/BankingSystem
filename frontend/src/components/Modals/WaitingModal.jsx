import React from 'react'

function WaitingModal() {
   
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="animate-spin border-4 border-gray-300 border-t-gray-800 rounded-full w-12 h-12 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Please wait a moment...</p>
      </div>
    </div>

  )
}

export default WaitingModal
