import {Text, View } from "@react-pdf/renderer";

function SkillSection({ styles, config, skillCategoriesEnabled, skillsLimit, isSingle }: { styles: any; config: any; skillCategoriesEnabled: boolean; skillsLimit: number; isSingle?: boolean }) {
  // If single page, only include programming languages, technologies, and databases
  const allowedCategories = ['Programming Languages', 'Technologies', 'Databases & ORMS', 'Databases', 'Databases & ORMs'];
  let displaySkills = config?.skillsData || [];

  if (isSingle) {
    displaySkills = displaySkills.filter((cat: any) => 
      allowedCategories.some(allowed => cat.category.toLowerCase().includes(allowed.toLowerCase()))
    );
  }

  return (
  <View>
             <View style={styles.sectionTitleBox}><Text style={styles.sectionTitle}>Skills</Text></View>
             {skillCategoriesEnabled && !isSingle ? (
                // Show Categories (Detailed)
                displaySkills.map((categoryObj: any, i: number) => (
                  <Text key={i} style={styles.skillTextRow}>
                    <Text style={{fontWeight: 'bold'}}>{categoryObj.category}: </Text>
                    {categoryObj.skills?.join(', ')}
                  </Text>
                ))
             ) : (
               // Flatten everything into bullet points for Single Page mode
               <View>
                  {isSingle && config?.customSkillBullet1 && (
                     <View style={styles.bulletRow}>
                        <Text style={styles.bulletLabel}>•</Text>
                        <Text style={styles.bulletText}>{config.customSkillBullet1}</Text>
                     </View>
                  )}
                  {isSingle && config?.customSkillBullet2 && (
                     <View style={styles.bulletRow}>
                        <Text style={styles.bulletLabel}>•</Text>
                        <Text style={styles.bulletText}>{config.customSkillBullet2}</Text>
                     </View>
                  )}

                  {/* Fallback to original logic if no custom skills provided */}
                  {(!isSingle || (!config?.customSkillBullet1 && !config?.customSkillBullet2)) && displaySkills.slice(0, skillsLimit || 2).map((categoryObj: any, i: number) => (
                    <View key={i} style={styles.bulletRow}>
                       <Text style={styles.bulletLabel}>•</Text>
                       <Text style={styles.bulletText}>
                         {/* Optional depending if we still show the category label in the bullet */}
                         <Text style={{fontWeight: 'bold'}}>{isSingle ? '' : `${categoryObj.category}: `}</Text>
                         {categoryObj.skills?.join(', ')}
                       </Text>
                    </View>
                  ))}
               </View>
             )}
          </View>  )
}

export default SkillSection