import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/public/buka-logo.png";
import HelpCenterForm from "./HelpCenterForm";

function UserFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHelpCenterClick = () => {
    setIsModalOpen(true);
  };

  return (
    <footer className="bg-[#F1F1F1] text-black pt-8 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-evenly items-start">
        <article className="mb-6 md:mb-0">
          <img src={Logo} alt="logo" className="w-32 h-auto" />
        </article>
        <article className="mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-4">Get to know us</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/#" className="hover:text-gray-400">
                About us
              </Link>
            </li>
            <li>
              <Link to="/#" className="hover:text-gray-400">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/#" className="hover:text-gray-400">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/#" className="hover:text-gray-400">
                Policy
              </Link>
            </li>
            <li>
              <button
                onClick={handleHelpCenterClick}
                className="hover:text-gray-400 bg-transparent border-none"
              >
                Help Center
              </button>
            </li>
          </ul>
        </article>
        <article>
          <h3 className="text-lg font-semibold mb-4">Indulge us</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/#" className="hover:text-gray-400">
                Pre-Order
              </Link>
            </li>
            <li>
              <Link to="/cuisine" className="hover:text-gray-400">
                Catering
              </Link>
            </li>
            <li>
              <Link to="/#" className="hover:text-gray-400">
                24/7 Support
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-400">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-gray-400">
                Become a Cook
              </Link>
            </li>
          </ul>
        </article>
      </div>
      <div className="bg-gray-200 text-center py-4 mt-6">
        2024 © Buka. All rights reserved.
      </div>

      {/* Modal Component */}
      <HelpCenterForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </footer>
  );
}

export default UserFooter;
