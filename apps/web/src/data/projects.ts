export interface Project {
  title: string;
  description: string;
  /** Screenshot filename in public/screenshots/ (e.g. "flashcards.png"). 16:10 works best. */
  screenshot?: string;
  /** Live URL of the deployed app. The whole card links here. */
  url?: string;
  /** Source repository URL. Used as the card link when there is no live URL. */
  repo?: string;
}

// Add new projects here; the page renders them automatically.
export const projects: Project[] = [
  {
    title: "Language Flashcards",
    description: "A flashcard app for studying language vocabulary.",
    screenshot: "flashcards.png",
    url: "https://flashcards.hendrikmelse.com",
  },
  {
    title: "Scoreplot",
    description: "An app for keeping score during game night.",
    screenshot: "scoreplot.png",
    url: "https://scoreplot.com",
  },
];
