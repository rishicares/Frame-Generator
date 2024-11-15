const Footer = () => {
    return (
        <footer className="bg-white border-t mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About</h3>
                        <p className="text-gray-600">
                            Create beautiful framed images for your favorite teams and share them with the world.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Twitter</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Facebook</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center text-gray-600">
                    <p>© 2024 Frame Generator. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 