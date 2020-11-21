import React, { Fragment } from 'react';
import {ProjectsList} from './ProjectsList';
import sampleImage from '../images/pexels-pixabay-270637.jpg'

const Projects = () => {ProjectsList.map(project => {
    return (
console.log(project)
    )
    
} )}
export default function project() {
  
    return (
        <Fragment>
            <h1 className="font-semibold text-3xl tracking-tight mb-4 px-6 py-4">Projects</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mx-auto">
            {
                ProjectsList.map(project => {
                    // let thumbnail = `http://free.pagepeeker.com/v2/thumbs.php?size=m&url=${project.liveUrl}`
                    let thumbnail = `https://www.google.com/s2/favicons?domain=${project.liveUrl}`
                    let repoUrl = `https://www.github.com/rahulnayanegali/${project.repoName}`
                    return (
                        <div class="max-w-sm rounded overflow-hidden shadow-lg">
                            {/* <img class="block h-auto w-full" src={thumbnail} alt="Sunset in the mountains" /> */}
                            <div class="px-6 py-4">
                                <div class="font-bold text-xl mb-2"><a href={repoUrl} target="_blank">{project.repoName}</a></div>
                                <p class="text-gray-700 text-base">
                                    {project.description}
                                </p>
                                {/* <p className="text-gray-700 text-base"> */}
                                    <a className="font-bold hover:no-underline" target="_blank" href={project.liveUrl}>{project.liveUrl}</a>
                                {/* </p> */}
                            </div>
                            <div class="px-6 pt-4 pb-2">
                                {project.hashTags.map(hashTag => {
                                    return(
                                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{hashTag}</span>
                                    )
                                })}
                                
                                
                            </div>
                        </div>
                    )
                })
            }
            
            
            </div>
            
            
        </Fragment>
    )
}