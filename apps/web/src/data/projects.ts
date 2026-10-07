export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Live URL of the deployed app. */
  url?: string;
  /** Source repository URL. */
  repo?: string;
}

// Add new projects here; the page renders them automatically.
export const projects: Project[] = [
  {
    title: "Language Flashcards",
    description: "A flashcard app for studying languages.",
    tags: ["Flashcards", "Full-stack"],
    // url: "https://...",
  },
  {
    title: "Scorekeeper",
    description: "A frontend-only app for keeping score during games.",
    tags: ["Frontend"],
    // url: "https://...",
  },
];
