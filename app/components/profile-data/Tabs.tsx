import { User, Briefcase, FolderGit2, Code2, GraduationCap } from "lucide-react";

export const TABS = [
  { id: "personal", label: "Personal Info", icon: <User size={15} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={15} /> },
  { id: "projects", label: "Projects", icon: <FolderGit2 size={15} /> },
  { id: "skills", label: "Skills", icon: <Code2 size={15} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={15} /> },
];