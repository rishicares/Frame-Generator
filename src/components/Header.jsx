const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm bg-white/90">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="7" y="7" width="10" height="10" />
              </svg>
              <h1 className="text-lg font-semibold text-gray-900">Frame Generator</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#editor" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                Editor
              </a>
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                Features
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <a 
                href="https://rishikesh.info.np" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-purple-600 hover:border-purple-100 transition duration-150 ease-in-out"
              >
                Visit Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
