import Header from './components/Header';
import Hero from './components/Hero';
import ImageEditor from './components/ImageEditor';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />
      
      <main>
        {/* Hero Section - Introduction */}
        <Hero />
        
        {/* Main Tool - Image Editor */}
        <div id="editor" className="relative bg-gradient-to-b from-purple-50/50 to-white">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(139,92,246,0.05)_0%,rgba(255,255,255,0)_100%)]" />
          <div className="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Start Creating
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                  Beautiful Frames
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Upload your image and customize it with our powerful tools
              </p>
            </div>
            <ImageEditor />
          </div>
        </div>
        
        {/* Features Section - Additional Information */}
        <div id="features">
          <FeatureSection />
          </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
