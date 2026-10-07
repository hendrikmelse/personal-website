import ProjectCard from "./components/ProjectCard";
import { projects } from "./data/projects";

import SocialIcon, { type SocialIconName } from "./components/SocialIcons";

const socials: { label: string; icon: SocialIconName; url: string }[] = [
  { label: "GitHub", icon: "github", url: "https://github.com/hendrikmelse" },
  {
    label: "LinkedIn",
    icon: "linkedin",
    url: "https://www.linkedin.com/in/hendrik-melse-4493b014a/",
  },
];

export default function App() {
  return (
    <>
      <header className="hero">
        <h1>Hendrik Melse</h1>
        <p>Open source, ad-free webapps.</p>
      </header>
      <main>
        <h2>Projects</h2>
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </main>
      <footer>
        <nav className="socials" aria-label="Social links">
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
              <SocialIcon name={s.icon} />
            </a>
          ))}
        </nav>
        © {new Date().getFullYear()} Hendrik Melse
      </footer>
    </>
  );
}
