const Hero = () => {
  const scrollToEditor = () => {
    const editorElement = document.getElementById('editor');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(139,92,246,0.08)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute h-32 w-32 -left-12 top-1/3 bg-purple-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob" />
        <div className="absolute h-32 w-32 -right-12 top-2/3 bg-purple-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-2000" />
      </div>
      
      <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-600 ring-1 ring-purple-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No sign up required
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Create stunning
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400 mt-1">
                framed photos
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Transform your images instantly with beautiful frames. Perfect for social media and portfolios.
            </p>

            <button 
              onClick={scrollToEditor}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            >
              Start Creating
              <svg className="ml-2.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Preview */}
          <div className="relative">
            <div className="relative max-w-sm mx-auto lg:mr-0">
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-xl rotate-12 animate-float" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-200 rounded-lg -rotate-12 animate-float animation-delay-2000" />
              
              {/* Main Frame */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-white">
                  {/* Sample Frame */}
                  <div className="h-full bg-white rounded-lg shadow-lg border-[16px] border-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-purple-50/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -20px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
    50% { transform: translateY(-10px) rotate(var(--tw-rotate)); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`;
document.head.appendChild(style);

export default Hero;