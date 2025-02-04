import React from 'react';
import linkedinIcon from '../images/linkedin2.svg';
import githubIcon from '../images/github.svg';

export default function Contact() {
  return (
    <div id="contact" className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between p-4 bg-gray-200 mt-8">
      <div className="flex flex-col gap-y-3 items-center sm:items-start">
        <p className="text-md text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-500 sm:py-2 sm:mt-0 mt-4">
          {/* <a href="/" className="text-gray-300 ml-1 hover:no-underline">
            Rahul Nayanegali
          </a> */}
          <a href="/" className="text-gray-700 ml-1 hover:no-underline">
            Made with React and Tailwind
          </a>
        </p>
        <span className="inline-flex  sm:mt-0 mt-4 justify-center sm:justify-start">
          <a
            className="text-gray-700 mx-2 text-xl transform hover:scale-150 transition ease-in-out duration-300"
            href="https://www.linkedin.com/in/rahulnayanegali"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: 50, height: 50 }}
              src={linkedinIcon}
              alt="LinkedIn"
            />
          </a>
          <a
            className="text-gray-700 mx-2 text-xl transform hover:scale-150 transition ease-in-out duration-300"
            href="https://github.com/rahulnayanegali"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: 48, height: 48 }}
              src={githubIcon}
              alt="GitHub"
            />
          </a>
        </span>
      </div>
      <div className="text-center sm:text-left mt-4 sm:mt-0">
        <p className="text-gray-700">
          © 2020 - 2025 Rahul Nayanegali.
        </p>
        <p className="text-gray-700">
          If you find this template useful, feel free to clone it and create your own portfolio site!
        </p>
      </div>
    </div>
  );
}