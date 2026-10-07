import ProjectCard from "./components/ProjectCard";
import { projects } from "./data/projects";

export default function App() {
  return (
    <>
      <header className="hero">
        <h1>Hendrik Melse</h1>
        <p>A collection of things I've built.</p>
      </header>
      <main>
        <h2>Projects</h2>
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </main>
      <footer>© {new Date().getFullYear()} Hendrik Melse</footer>
    </>
  );
}
