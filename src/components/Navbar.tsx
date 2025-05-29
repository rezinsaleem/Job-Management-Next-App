import Image from 'next/image';
import React, { useState } from 'react';
import JobForm from './JobForm';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

 

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Find Jobs', href: '#' },
    { name: 'Find Talents', href: '#' },
    { name: 'About us', href: '#' },
    { name: 'Testimonials', href: '#' },
  ];

  return (
    <div className="bg-white px-4 py-5">
      <nav
        className={`max-w-[824px] mx-auto bg-white rounded-full shadow-[3px_3px_3px_3px_rgba(0.05,0.05,0.05,0.05)] py-3 px-4 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'rounded-none' : 'rounded-full'
        }`}
      >
        <div className="flex items-center justify-between">
            <a href="" className="flex items-center">
              <Image src="./logo.svg" alt="Logo" width={40} height={46} />
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className=" text-black font-medium text-sm transition-all duration-200 ease-in-out hover:translate-y-0.5 hover:translate-x-1 hover:bg-white hover:shadow-lg px-3 py-2 rounded-md group"
                >
                  {link.name}
                </a>
              ))}
            </div>

          <div className="hidden md:block">
            <button
              onClick={openForm}
              className="bg-purple-700 hover:bg-purple-800 hover:translate-y-0.5 hover:translate-x-1 hover:scale-103 text-white font-medium py-2 px-5 rounded-full text-sm transition-colors  cursor-pointer relative overflow-hidden hover:transform group w-30 transition-all duration-400 ease-in-out"
            >
             <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-hover:opacity-0">
                Create Jobs
              </span>
              <span className="absolute inset-0 flex items-center justify-center translate-y-full opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                Login
              </span>


            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none relative w-6 h-6"
            >
              <span className="sr-only">Toggle menu</span>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-800 my-1.5 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-2 mt-4 pb-4 bg-white">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-800 hover:text-purple-600 font-medium text-sm px-4 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 px-4">
              <button
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-5 rounded-full text-sm transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  openForm();
                }}
              >
                Create Jobs
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen overflow-y-auto">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={closeForm}
          ></div>
           <div className="relative z-10">
            <JobForm closeForm={closeForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;