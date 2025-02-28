const FeatureSection = () => {
  const features = [
    {
      title: 'Beautiful Frames',
      description: 'Choose from our collection of elegant frames designed to enhance your photos perfectly.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10v8H7V8z" />
        </svg>
      )
    },
    {
      title: 'Smart Controls',
      description: 'Intuitive controls for perfect image positioning, scaling, and rotation with real-time preview.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
    {
      title: 'Quick Export',
      description: 'Download your beautifully framed images in high quality with just one click.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 right-1/2 -translate-x-1/2 w-[800px] h-full bg-gradient-to-r from-transparent via-purple-100/20 to-transparent" />
        <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-purple-100/20 to-transparent" />
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%238B5CF6' fill-opacity='0.07'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Craft Perfect Images with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              Powerful Features
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Transform your photos with our easy-to-use framing tools
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="h-full relative bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 transition duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
                {/* Purple Gradient Border */}
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
                
                {/* Icon */}
                <div className="relative mb-4 inline-flex">
                  <div className="absolute inset-0 rounded-xl bg-purple-100 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative rounded-xl bg-gradient-to-br from-purple-50 to-white p-3 text-purple-600 ring-1 ring-purple-100">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-100/10 to-transparent blur-3xl -z-10" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-gradient-radial from-purple-100/20 to-transparent blur-2xl" />
        <div className="absolute right-1/4 top-1/4 w-24 h-24 bg-gradient-radial from-purple-100/20 to-transparent blur-xl" />
      </div>
    </section>
  );
};

export default FeatureSection;
