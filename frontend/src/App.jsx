import Upload from './components/Upload';
import Chat from './components/Chat';

function App() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-8 mt-4">
        AI Lecture Review Platform
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Upload Component */}
        <div>
          <Upload />
        </div>

        {/* Right Side: Chat Component */}
        <div>
          {/* Abhi testing ke liye ek dummy videoId pass kar rahe hain */}
          <Chat videoId="test-video-id" />
        </div>
      </div>
    </div>
  );
}

export default App;