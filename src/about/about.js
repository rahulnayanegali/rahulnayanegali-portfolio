import React, {Fragment} from 'react'
import { Route } from 'react-router-dom';
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
                        
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <HeaderRight />
                    </div>
            </div>
            {/* </Route> */}
            
        </Fragment>
        
    )
}   
