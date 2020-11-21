import React, { Fragment } from 'react'
import Project from './project';
import { Element } from 'react-scroll'

export default function works() {
    return (
        <Fragment>
            {/* h-screen for 100vh */}
            <div id="projects" className="bg-gray-100">
                <Project />
                
            </div>
        </Fragment>
            
        
    )
}
