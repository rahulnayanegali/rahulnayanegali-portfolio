import React, { Fragment } from 'react';

export default function Project(props) {
    let project = props.project
    let repoUrl = `https://www.github.com/rahulnayanegali/${project.repoName}`

    return (
        <Fragment>
            {/* <h1 className="font-semibold text-3xl tracking-tight mb-4 px-6 py-4">Projects</h1> */}
            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mx-auto"> */}
            {/* {
                ProjectsList.map(project => {
                    let thumbnail = `http://free.pagepeeker.com/v2/thumbs.php?size=m&url=${project.liveUrl}`
                    let thumbnail = `https://www.google.com/s2/favicons?domain=${project.liveUrl}`
                    return ( */}
                        <div  className="max-w-sm rounded overflow-hidden shadow-lg">
                            {/* <img class="block h-auto w-full" src={thumbnail} alt="Sunset in the mountains" /> */}
                            <div className="px-6 py-4">
                                <div className="font-semibold text-xl mb-2"><a href={repoUrl} target="_blank" rel="noopener noreferrer">{project.repoName}</a></div>
                                <p className="text-gray-700 text-base">
                                    {project.description}
                                </p>
                                {/* <p className="text-gray-700 text-base"> */}
                                    <a className="font-bold hover:no-underline" target="_blank" rel="noopener noreferrer" href={project.liveUrl}>{project.liveUrl}</a>
                                {/* </p> */}
                            </div>
                            <div className="px-6 pt-4 pb-2">
                                {project.hashTags.map(hashTag => {
                                    return(
                                    <span key={hashTag}className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{hashTag}</span>
                                    )
                                })}
                            </div>
                        </div>
                    {/* )
                 }
                 )
            } */}
            {/* </div> */}
                    </Fragment>
    )
}