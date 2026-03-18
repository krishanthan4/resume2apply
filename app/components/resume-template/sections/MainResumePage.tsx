import { Page, Document} from '@react-pdf/renderer';
import getVisitorStyles from '../styles/visitorResumeStyles';
import getEditorStyles from "../styles/editorResumeStyles";
import HeaderSection from './HeaderSection';
import SummerySection from './SummerySection';
import ProjectSection from './ProjectSection';
import SkillSection from './SkillSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';

const ResumeDocument = ({ config, type, isEditor = false }: { config: any, type: string, isEditor?: boolean }) => {
  const isSingle = type === 'single';
  
  // Use config directly for styling since we inject raw flat styles in custom builder
  const stylingConfig = config?.styling ? { ...config.styling, ...config } : config;
  const styles = isEditor ? getEditorStyles(stylingConfig) : getVisitorStyles(stylingConfig);
  
  // In the custom builder, some personalDetails might be flat on config so merge them
  const common = { 
    ...config?.personalDetails, 
    enableIcons: config.enableIcons !== undefined ? config.enableIcons : true,
    showPhoneNumber: config.showPhoneNumber !== false,
    showWebsite: config.showWebsite !== false,
    showLocation: config.showLocation !== false,
    showGithub: config.showGithub !== false,
    showLinkedin: config.showLinkedin !== false,
    noHyperlinks: config.noHyperlinks === true
  };

  // General limit config
  const maxExperienceBullets = config?.maxExperienceBullets ?? (isSingle ? 3 : 7);
  const maxProjectBullets = config?.maxProjectBullets ?? (isSingle ? 3 : 4);
  const maxProjects = config?.maxProjects ?? (isSingle ? 2 : 4);

  const expBulletsEnabled = true;
  const projectBulletsEnabled = true;
  const projectsLimit = maxProjects;
  
  let summaryText = config?.generalExecutiveSummary?.detailedSummery;
  if (isSingle && config?.generalExecutiveSummary?.shortSummery) {
    summaryText = config.generalExecutiveSummary.shortSummery;
  }
  
  // Allow overriding with template text if selected in custom builder
  if (config?.selectedExecutiveSummaryText) {
    summaryText = config.selectedExecutiveSummaryText;
  }

  if (summaryText) {
    if (config?.targetCompany) {
      summaryText = summaryText.replace(/\{\{company\}\}/gi, config.targetCompany);
    }
    if (config?.targetPosition) {
      summaryText = summaryText.replace(/\{\{position\}\}/gi, config.targetPosition);
    }
  }

  const skillCategoriesEnabled = isSingle ? config?.singlePageConfig?.enableSkillCategories : true;
  const skillsLimit = isSingle ? config?.singlePageConfig?.skillsLimit : 999;

  const defaultOrder = ["executiveSummary", "experience", "projects", "skills", "education"];
  const sectionsOrder = config?.sectionsOrder || defaultOrder;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case "executiveSummary":
        if (config?.showExecutiveSummary !== false && config?.sections?.executiveSummaryEnabled && summaryText) {
          return <SummerySection key="summary" styles={styles} summaryText={summaryText} />;
        }
        return null;
      case "experience":
        if (config?.sections?.experienceEnabled && config?.experiences?.length > 0) {
          return (
            <ExperienceSection 
              key="exp"
              styles={styles}
              config={config}
              expBulletsEnabled={expBulletsEnabled}
              expBulletsLimit={maxExperienceBullets}
            />
          );
        }
        return null;
      case "projects":
        if (config?.sections?.projectsEnabled && config?.projects?.length > 0) {
          return (
             <ProjectSection key="proj" styles={styles} config={config} projectsLimit={projectsLimit} projectBulletsEnabled={projectBulletsEnabled} projectBulletsLimit={maxProjectBullets} />
          );
        }
        return null;
      case "skills":
        if (config?.sections?.skillsEnabled && config?.skillsData?.length > 0) {
          return (
             <SkillSection key="skills" styles={styles} config={config} skillCategoriesEnabled={skillCategoriesEnabled} skillsLimit={skillsLimit} isSingle={isSingle} />
          );
        }
        return null;
      case "education":
        if (config?.sections?.educationEnabled && config?.educations?.length > 0) {
          return (
             <EducationSection key="edu" styles={styles} config={config} showGraduationDate={config?.showGraduationDate ?? config?.educationConfig?.showGraduationDate ?? true} />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
       <HeaderSection styles={styles} common={common} />

       {sectionsOrder.map(renderSection)}

      </Page>
    </Document>
  );
};

export default ResumeDocument;