

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-700">
        You don’t have permission to access this page.
      </p>
      
    </div>
  );
}
