export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  liveLink?: string;
  githubLink?: string;
  imageColor: string;
  techGlow: string;
  keyMetrics: string[];
  category?: "AI & Agents" | "Fullstack Web" | "Systems & Visuals";
  installation?: string;
  architectureDetails?: string;
  detailedFeatures?: string[];
}

export interface HackathonEntry {
  id: string;
  title: string;
  achievement: string;
  description: string;
  date: string;
  tags: string[];
  glowColor: string;
}

export interface SkillItem {
  name: string;
  iconName: string;
  description: string;
  glowColor: string;
  details: string[];
}

export interface SkillCategory {
  title: string;
  glowColor: string;
  skills: SkillItem[];
}
