import { useNavigate } from "react-router-dom";
import ROUTES from "@/routePath";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <footer 
      id="contact" 
      className="py-12 px-4 bg-wedshare-dark-surface dark:bg-wedshare-dark-bg border-t border-gray-800 transition-colors"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-lg text-wedshare-dark-text-primary">
              WedShare
            </h4>
            <p className="text-wedshare-dark-text-secondary text-sm leading-relaxed">
              Making wedding memories shareable and unforgettable
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h5 className="font-bold text-wedshare-dark-text-primary">
              Product
            </h5>
            <ul className="space-y-2 text-wedshare-dark-text-secondary text-sm">
              <li>
                <a 
                  href="#features" 
                  className="hover:text-wedshare-dark-primary transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="hover:text-wedshare-dark-primary transition-colors duration-200"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-4">
            <h5 className="font-bold text-wedshare-dark-text-primary">
              Account
            </h5>
            <ul className="space-y-2 text-wedshare-dark-text-secondary text-sm">
              <li>
                <button 
                  onClick={() => handleNavigate(ROUTES.LOGIN)}
                  className="hover:text-wedshare-dark-primary transition-colors duration-200 cursor-pointer text-left"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate(ROUTES.SIGNUP)}
                  className="hover:text-wedshare-dark-primary transition-colors duration-200 cursor-pointer text-left"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-2">
            <h5 className="font-bold text-wedshare-dark-text-primary">
              Contact
            </h5>
            <p className="text-wedshare-dark-text-secondary text-sm space-y-1">
              <a 
                href="mailto:support@wedshare.com"
                className="hover:text-wedshare-dark-primary transition-colors duration-200 block"
              >
                support@wedshare.com
              </a>
              <a 
                href="tel:+15551234567"
                className="hover:text-wedshare-dark-primary transition-colors duration-200 block"
              >
                +1 (555) 123-4567
              </a>
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-wedshare-dark-text-secondary text-sm">
          <p>&copy; 2025 WedShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
