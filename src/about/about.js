import React, {Fragment} from 'react'
// import { Route } from 'react-router-dom';
import HeaderRight from '../hero/HeaderRight';
export default function about() {
    return (
        <Fragment>
            {/* <Route path="/about" component={about}> */}
    {/* h-screen for 100vh */}
                {/* <div className="flex mb-4 auto-rows-max max-h-full p-8"> */}
                <div className="flex flex-col justify-center lg:flex-row lg:justify-evenly">
                    <div className=" my-12 flex flex-col items-start">
                            <h1 className="text-6xl">Hi I'm Rahul</h1>
                            <h2 className="text-5xl text-gray-700">I'm a ReactJS Developer</h2>
                            {/* <div className="md:flex md:items-center"> */}
                                <div className="md:w-1/3">
                                <a href="#contact"> <button className="shadow bg-blue-450 focus:shadow-outline focus:outline-none text-gray-700 font-bold py-2 px-4 rounded" type="">
                                    Hire Me
                                </button></a>
                                </div>
                                <div className="md:w-2/3"></div>
                                {/* </div> */}
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <HeaderRight />
                    </div>
            </div>
            {/* </Route> */}
            
        </Fragment>
        
    )
}   
