import type { Project } from "../data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const href = project.url ?? project.repo;

  const body = (
    <>
      <div className="shot">
        {project.screenshot ? (
          <img
            src={`${import.meta.env.BASE_URL}screenshots/${project.screenshot}`}
            alt={`Screenshot of ${project.title}`}
            loading="lazy"
          />
        ) : (
          <div className="shot-placeholder" aria-hidden="true">
            {project.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="card-text">
        <h3>
          {project.title}
          {href && <span className="arrow" aria-hidden="true">↗</span>}
        </h3>
        <p>{project.description}</p>
      </div>
    </>
  );

  return href ? (
    <a className="card" href={href} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className="card card-static">{body}</div>
  );
}
