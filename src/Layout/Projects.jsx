import React from 'react';

const Projects = () => {
  const projects = [
    {
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=457,fit=crop/mnlWbq8nWRC78GJ6/beautiful-indoor-koi-fish-pond-design-proposed-for-our-tirur-client.-2-Y4LD9voJNkFkxzND.jpg",
      title: "Indoor Koi Pond Design - Tirur Client",
      description: "This project aims to develop a user-friendly mobile application that enhances productivity and organization. Through intuitive design and seamless functionality, users can efficiently manage tasks, set reminders, and collaborate with team members."
    },
    {
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=457,fit=crop/mnlWbq8nWRC78GJ6/469029445_18035708309364843_5626666576497912423_n-YBg7wbLrLQHaljjZ.jpg",
      title: "Premium Aquatic Installation",
      description: "This project aims to develop a user-friendly mobile application that enhances productivity and organization. Through intuitive design and seamless functionality, users can efficiently manage tasks, set reminders, and collaborate with team members."
    },
    {
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=1091,fit=crop/mnlWbq8nWRC78GJ6/beautiful-indoor-pond-design-for-our-kannur-client-mr.-sajid.-going-to-implement-it-soon.-wait-for-the-finised-video-A3Q297PGkBSaJwy4.jpg",
      title: "Indoor Pond Design - Kannur Client",
      description: "Beautiful indoor pond design for our Kannur client Mr. Sajid. This stunning aquatic feature will transform the interior space into a serene natural environment."
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Provide a short summary of your recent projects, highlighting the most important things.
          </p>
        </div>

        <div className="space-y-16">
          {projects.map((project, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <h3 className="text-3xl font-bold text-gray-900">{project.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>
                <div className="flex space-x-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;