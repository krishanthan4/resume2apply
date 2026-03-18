import { Link, Text, View } from "@react-pdf/renderer";

function ProjectSection({ styles, config, projectsLimit, projectBulletsEnabled, projectBulletsLimit }: { styles: any; config: any; projectsLimit: number; projectBulletsEnabled: boolean; projectBulletsLimit?: number }) {
  return (
   <View>
             <View style={styles.sectionTitleBox}><Text style={styles.sectionTitle}>Projects</Text></View>
             {config?.projects?.slice(0, projectsLimit).map((proj: any, i: number) => {
                const showGithub = config?.projectsConfig?.linkDisplay === 'Both' || config?.projectsConfig?.linkDisplay === 'GitHub Only';
                const showLive = config?.projectsConfig?.linkDisplay === 'Both' || config?.projectsConfig?.linkDisplay === 'Live Only';
                const achievements = projectBulletsLimit ? proj.description?.slice(0, projectBulletsLimit) : proj.description;

                return (
                  <View key={i} style={{marginBottom: 6}}>
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectTitle}>{proj.title}</Text>
                      <View style={{flexDirection: 'row', gap: 6}}>
                        {showGithub && proj.githubUrl && !config?.noHyperlinks && (
                          <Link style={styles.projectLink} src={proj.githubUrl}>GitHub Link</Link>
                        )}
                        {showLive && proj.liveUrl && !config?.noHyperlinks && (
                          <Link style={styles.projectLink} src={proj.liveUrl}>Live Link</Link>
                        )}
                      </View>
                    </View>
                    
                    {config?.projectsConfig?.enableTechStack && proj.techStack && (
                       <View style={styles.techStackRow}>
                         <Text style={styles.bulletLabel}>•</Text>
                         <Text style={styles.bulletText}>Tech stack: {proj.techStack}</Text>
                       </View>
                    )}

                    {projectBulletsEnabled && achievements?.map((point: string, j: number) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bulletLabel}>•</Text>
                        <Text style={styles.bulletText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                )
             })}
          </View>  )
}

export default ProjectSection