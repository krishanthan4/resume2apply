import { Text, View } from "@react-pdf/renderer";

function ExperienceSection({ styles,config,expBulletsEnabled, expBulletsLimit }: { styles: any; config: any; expBulletsEnabled: boolean; expBulletsLimit?: number }) {
  return (
  <View>
             <View style={styles.sectionTitleBox}><Text style={styles.sectionTitle}>Experience</Text></View>
             {config?.experiences?.map((exp: any, i: number) => {
               const achievements = expBulletsLimit ? exp.achievements?.slice(0, expBulletsLimit) : exp.achievements;
               return (
               <View key={i} style={{marginBottom: 6}}>
                 <View style={styles.experienceHeader}>
                    <Text style={styles.experienceTitleLeft}>
                       {exp.company && <Text style={{ fontWeight: 'bold' }}>{exp.company}</Text>}
                       {exp.company && exp.title && <Text>: </Text>}
                       {exp.title && <Text style={{ fontWeight: exp.company ? 'normal' : 'bold', fontStyle: exp.company ? 'italic' : 'normal' }}>{exp.title}</Text>}
                    </Text>
                    <Text style={styles.dateItalicText}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                 </View>
                 {expBulletsEnabled && achievements?.map((point: string, j: number) => (
                   <View key={j} style={styles.bulletRow}>
                     <Text style={styles.bulletLabel}>•</Text>
                     <Text style={styles.bulletText}>{point}</Text>
                   </View>
                 ))}
               </View>
             )})}
          </View>
  )
}

export default ExperienceSection