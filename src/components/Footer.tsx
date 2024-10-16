import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mt-2 text-xs">
              Still under development, users may clear their local storage in
              the browser console to reset the search results.
            </p>
            <p>&copy; {currentYear} renocrypt. All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="https://github.com/renocrypt/lumina-research-renocrypt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
