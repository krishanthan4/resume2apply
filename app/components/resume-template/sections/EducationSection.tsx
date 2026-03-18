import {Text, View } from "@react-pdf/renderer";

function EducationSection({ styles, config, showGraduationDate }: { styles: any; config: any; showGraduationDate?: boolean }) {
  return (
 <View>
             <View style={styles.sectionTitleBox}><Text style={styles.sectionTitle}>Education</Text></View>
             {config?.educations?.map((edu: any, i: number) => (
                <View key={i} style={{marginBottom: 5}}>
                  <View style={styles.educationRow}>
                     <Text style={styles.educationDegree}>{edu.degree}</Text>
                     {showGraduationDate !== false && <Text style={styles.educationDate}>{edu.endDate}</Text>}
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 1}}>
                    <Text style={styles.educationUni}>{edu.institution}</Text>
                    {edu.location && <Text style={styles.educationLocation}>{edu.location}</Text>}
                  </View>
                </View>
             ))}
          </View>
  )
}


export default EducationSection