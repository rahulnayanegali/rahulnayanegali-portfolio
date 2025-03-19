import React, { Fragment } from 'react'
import Project from './project';
import {ProjectsList} from './ProjectsList';
import SocialFeed from '../components/SocialFeed';

export default function Projects() {
    return (
        <Fragment>
            {/* h-screen for 100vh */}
            <h1 className="font-bold text-3xl tracking-tight mb-4 px-6 py-4">Projects</h1>
            <div id="projects" className="bg-gray-100">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                    {
                        ProjectsList.map(project => {
                            return (
                                <Project key={project.id} project={project} />
                            )
                            
                            
                        })
                    }
                </div>
            </div>
                    </Fragment>
    )
}
