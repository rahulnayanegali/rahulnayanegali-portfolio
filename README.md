<p align="left"> <img src="https://komarev.com/ghpvc/?username=rahulnayanegali&label=Profile%20views&color=0e75b6&style=flat" alt="rahulnayanegali" /> </p>

# Personal Portfolio - Rahul Nayanegali 👋

[![Live Site](https://img.shields.io/badge/-Live_Site-4285F4?style=flat-square&logo=google-chrome&logoColor=white)](https://rahulnayanegali.netlify.app)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/rahulnayanegali/)
[![Email](https://img.shields.io/badge/-Email-D14836?style=flat-square&logo=Gmail&logoColor=white)](mailto:nayanegali.rahul@gmail.com)
[![Twitter](https://img.shields.io/badge/-Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/rahulnayanegali)

## About Me

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=000000&background=FFFFFF00&random=false&width=435&lines=Senior+Software+Engineer;AI+Enthusiast;Full+Stack+Developer" alt="Typing SVG" /></a>

With 5+ years of experience in full-stack development, I specialize in frontend technologies and AI integration. I'm passionate about crafting efficient, scalable solutions and leveraging cutting-edge technologies.

## 🛠️ Portfolio Technical Implementation

This portfolio showcases not just my projects, but also demonstrates my technical skills through its implementation:

### Architecture

- **Frontend**: React with Vite for optimized builds
- **Styling**: Styled Components with responsive design
- **Deployment**: Netlify with CI/CD pipeline
- **Serverless Functions**: Netlify Functions for backend APIs

### Key Technical Features

#### Advanced Twitter Integration

The portfolio implements a sophisticated Twitter feed with:
- Multi-layered caching strategy (memory, file system, and browser)
- Serverless API using Netlify Functions
- Stale-while-revalidate pattern for optimal performance
- Rate limit handling with graceful degradation
- Responsive masonry layout for tweets

**Technical Implementation Details:**
- **Frontend**: React component with responsive masonry grid layout for tweets
- **Backend**: Netlify serverless function with Twitter API integration
- **Caching**: 
  - In-memory cache for fast responses
  - File-based persistence in `/tmp` directory
  - Browser localStorage for instant loading on repeat visits
  - HTTP Cache-Control headers for CDN/browser optimization
- **Resilience**: 
  - Stale data served for up to 24 hours when API is unavailable
  - Background data refreshing that doesn't block the UI
  - Graceful degradation with helpful user messaging
- **Performance**:
  - Skeleton loading states for better perceived performance
  - Optimized Twitter embed styling for consistency
  - Automatic grid recalculation to prevent layout shifts

This implementation demonstrates advanced serverless architecture concepts, modern caching strategies, and user experience best practices while working within API rate limits and serverless computing constraints.

#### Performance Optimizations

- Code splitting for faster initial load
- Image optimization with lazy loading
- Critical CSS inlining
- Modern Cache-Control implementation

#### Responsive Design

- Mobile-first approach
- Fluid typography and spacing
- Optimized for all device sizes
- Accessibility compliance

## 🚀 Featured Projects

### AI-Based Common Thorax Disease Detector
A deep learning CNN model using PyTorch for X-ray image classification, achieving 93% accuracy.
- **Tech Stack:** PyTorch, React, Flask
- [GitHub Repo](https://github.com/rahulnayanegali/MedX.ai)

### Sorting Algorithms Simulation
A web application visualizing sorting algorithms using React.js and Spring Boot API.
- **Tech Stack:** React.js, Spring Boot, Server-Sent Events
- [Backend Spring Boot GitHub Repo](https://github.com/rahulnayanegali/backend-algos-simulation)
- [Frontend React GitHub Repo](https://github.com/rahulnayanegali/algos-frontend)

## 📊 GitHub Stats

![Rahul's GitHub stats](https://github-readme-stats.vercel.app/api?username=rahulnayanegali&show_icons=true&theme=radical)

![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=rahulnayanegali&layout=compact&theme=radical)

## 🧠 Technical Skills

![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![AWS](https://img.shields.io/badge/-AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![PyTorch](https://img.shields.io/badge/-PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)

## 🏆 Achievements

- Computer Science Departmental Award recipient at Pace University
- AWS Certified Cloud Practitioner
- Experienced in AI and Machine Learning projects
- Teaching Assistant for Data Structures and Algorithms

## 🌱 Currently Learning

- Advanced AI and Machine Learning techniques
- Microservices architecture
- Cloud-native development

## 🚀 Running This Portfolio Locally

```bash
# Clone the repository
git clone https://github.com/rahulnayanegali/portfolio.git

# Install dependencies
npm install

# Setup environment variables
# Create a .env file with the following:
TWITTER_BEARER_TOKEN=your_token_here
VITE_API_URL=/api

# Start the development server
npm run dev
```

## 📫 Let's Connect!

I'm always open to interesting conversations and collaboration opportunities. Feel free to reach out!

[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/rahulnayanegali/)
[![Twitter](https://img.shields.io/badge/-Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/rahulnayanegali)
[![Email](https://img.shields.io/badge/-Email-D14836?style=flat-square&logo=Gmail&logoColor=white)](mailto:nayanegali.rahul@gmail.com)
