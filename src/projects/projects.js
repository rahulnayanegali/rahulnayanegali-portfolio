import React, { Fragment, useEffect, useState } from 'react'
import Project from './project';
import { supabase } from '../supabaseClient';

export default function Projects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*');
  
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Fetched data:', data);
        setProjects(data)
      }
    };
  
    fetchData();
  }, []);

    return (
        <Fragment>
            {/* h-screen for 100vh */}
            <h1 className="font-bold text-3xl tracking-tight mb-4 px-6 py-4">Projects</h1>
            <div id="projects" className="bg-gray-100">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mx-auto">
                    {
                        projects.map(project => {
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
