import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FrameGenerator from './components/FrameGenerator.jsx';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
                <FrameGenerator />
            </main>
            <Footer />
        </div>
    );
}

export default App; 