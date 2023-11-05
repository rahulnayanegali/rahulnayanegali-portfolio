import React from 'react';
import HeaderRight from '../hero/HeaderRight';

export default function about() {
  return (
    <div className="flex flex-col justify-center lg:flex-row lg:justify-evenly">
      <div className=" my-12 flex flex-col items-start">
        <h1 className="text-6xl">Hi I'm Rahul</h1>
        <h2 className="text-5xl text-gray-700">I'm a ReactJS Developer</h2>
        <div className="md:w-1/3">
          <a href="#contact">
            <button
              type="button"
              className="shadow bg-blue-450 focus:shadow-outline
              focus:outline-none text-gray-700 font-bold py-2 px-4 rounded">
              Hire Me
            </button>
          </a>
        </div>
        <div className="md:w-2/3" />
      </div>
      <div className="flex justify-center lg:justify-end">
        <HeaderRight />
      </div>
    </div>
  );
}
