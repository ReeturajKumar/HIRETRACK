"use client";

import Link from "next/link";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-8 py-8">
      <div className="w-full px-4 mx-auto">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-5">
          <div className="space-y-4">
  <h2 className="text-2xl font-bold text-black dark:text-white">HireTrack</h2>
  <p className="text-sm text-gray-700 dark:text-gray-300">
    HireTrack helps employers find top talent quickly and efficiently. We make job hiring effortless.
  </p>
  <div className="flex space-x-4 mt-2">
    <Link href="https://facebook.com" target="_blank">
      <svg className="w-5 h-5 text-black dark:text-white hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.2L16 14.9h-2v7A10 10 0 0022 12z" />
      </svg>
    </Link>
    <Link href="https://instagram.com" target="_blank">
      <svg className="w-5 h-5 text-black dark:text-white hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4H7zm10 2c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10zM12 8a4 4 0 100 8 4 4 0 000-8zm6.5-1a1.5 1.5 0 11-3.001-.001A1.5 1.5 0 0118.5 7z" />
      </svg>
    </Link>
    <Link href="https://twitter.com" target="_blank">
      <svg className="w-5 h-5 text-black dark:text-white hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.65 8.65 0 01-2.73 1.04 4.29 4.29 0 00-7.4 3.92 12.16 12.16 0 01-8.83-4.48 4.28 4.28 0 001.32 5.72A4.28 4.28 0 012 9.3v.05a4.29 4.29 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.3 4.3 0 004.01 2.98A8.62 8.62 0 012 19.53a12.18 12.18 0 006.59 1.93c7.91 0 12.23-6.55 12.23-12.23 0-.19 0-.39-.01-.58A8.74 8.74 0 0022.46 6z" />
      </svg>
    </Link>
    <Link href="https://youtube.com" target="_blank">
      <svg className="w-5 h-5 text-black dark:text-white hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.6 3.3H4.4A1.4 1.4 0 003 4.7v14.6a1.4 1.4 0 001.4 1.4h15.2a1.4 1.4 0 001.4-1.4V4.7a1.4 1.4 0 00-1.4-1.4zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    </Link>
  </div>
</div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Sitemap
                </Link>
                </li>
                <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white">
             Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Employer
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Job Posting Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Teams & Services
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>

               <li>
                <Link
                  href="/"
                  className="text-base text-black dark:text-white hover:text-primary"
                >
                  Credits
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
         <div className="space-y-2">
  <h3 className="text-[20px] font-semibold text-black dark:text-white">
    Contact
  </h3>

  <div className="">
    <h4 className="text-base text-black dark:text-white mb-2">Subscribe to our newsletter</h4>
    <form className="flex-col items-center space-x-2 space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-transparent text-black dark:text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
      >
        Subscribe
      </button>
    </form>
  </div>
</div>

        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} HireTrack. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
