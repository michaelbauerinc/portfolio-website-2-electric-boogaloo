// src/pages/projects.tsx
import React from "react";
import type { NextPage } from "next";
import Navbar from "../components/common/Navbar";
import ProjectCard, { ProjectProps } from "../components/projects/ProjectCard";
import GitHubApiClient from "../components/lib/GithubApiClient";
import IconsBackground from "../components/common/IconsBackground";

import "../app/globals.css";

interface ProjectsProps {
  projects: ProjectProps[];
}

const Projects: NextPage<ProjectsProps> = ({ projects }) => {
  return (
    <div>
      <IconsBackground />
      <Navbar />
      <div className="bg-gradient-to-r mx-auto p-8 text-black">
        <div className="text-center bg-purple-600/50 backdrop-blur-md rounded-xl p-4 mx-8 my-4 shadow-lg hover:scale-105 transition-transform">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 py-10 text-yellow-300">
            Fresh From The Hub
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const gitHubApiClient = new GitHubApiClient();
  const projectUrls = [
    "https://github.com/michaelbauerinc/portfolio-website-2-electric-boogaloo",
    "https://github.com/michaelbauerinc/llama-streaming-suite",
    "https://github.com/michaelbauerinc/titanic-machine-learning",
    "https://github.com/michaelbauerinc/top-down-engine",
    "https://github.com/michaelbauerinc/towers-of-hanoi",
    "https://github.com/michaelbauerinc/heap-fisher",
    "https://github.com/michaelbauerinc/class-hero",
    "https://github.com/michaelbauerinc/portfolio",
    "https://github.com/michaelbauerinc/choose-your-own-adventure-engine",
    "https://github.com/michaelbauerinc/dig-labs",
    "https://github.com/michaelbauerinc/leagueside",
    "https://github.com/michaelbauerinc/django-demo",
  ];

  const projects = await Promise.all(
    projectUrls.map((url) => gitHubApiClient.fetchRepoData(url))
  );

  return {
    props: {
      projects: projects.filter((project) => project !== null),
    },
  };
}

export default Projects;
