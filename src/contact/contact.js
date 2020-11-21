import React, {Fragment } from 'react'
import linkedinIcon from '../images/linkedin2.svg'
import githubIcon from '../images/github.svg'

export default function contact() {
    return (
        <Fragment>
            <div id="contact" className=" flex items-center sm:flex-row flex-col">
                <p className="text-md text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-500 sm:py-2 sm:mt-0 mt-4 flex flex-col items-center md:items-start">
                    <a className="text-gray-700 ml-1 hover:no-underline">Rahul Nayanegali</a>
                    <a className="text-gray-700 ml-1 hover:no-underline">Made using React and Tailwind CSS</a>
                </p>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                    <a className="text-gray-700 mx-2 text-xl transform hover:scale-150 transition ease-in-out duration-300" href="https://www.linkedin.com">
                            <img style={{width: 50, height: 50}} className="" src={linkedinIcon} alt="https://freeicons.io/social-media-icons-4/linkedin-icon-15649#" />
                    </a>
                    <a className="text-gray-700 mx-2 text-xl transform hover:scale-150 transition ease-in-out duration-300" href="https://www.github.com">
                            <img style={{width: 48, height: 48}} className="" src={githubIcon} alt="https://freeicons.io/common-style-icons-8/github-icon-11674" />
                    </a>
                </span>
                
                    
              
                
            </div>
            {/* h-screen for 100vh */}
            {/* <div id="contact" className="flex justify-between">
            <h1 className="font-semibold text-xl tracking-tight">Rahul Nayanegali</h1>
            <div >
                <a href="https://www.github.com"> <span> Github </span> </a>
                <a href="https://www.linkedin.com"> <span> Linkedin </span> </a>
            </div>
        </div> */}
        </Fragment>
        
    )
}
