function Footer() {
    return (
      <footer className="bg-black text-gray-300 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">About Us</h2>
            <p className="text-sm">
              Food Redistribution is a community-driven platform connecting food donors with NGOs to minimize food wastage and fight hunger.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Quick Links</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Donor Dashboard</a></li>
              <li><a href="#" className="hover:text-white">NGO Dashboard</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
  
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Contact</h2>
            <ul className="text-sm space-y-2">
              <li>Email: support@foodredistribution.org</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>
  
        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Food Redistribution. All rights reserved.
        </div>
      </footer>
    );
  }
  
  export default Footer;
  