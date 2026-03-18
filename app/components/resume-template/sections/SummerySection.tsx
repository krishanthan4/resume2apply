import { Text, View } from "@react-pdf/renderer";

function SummerySection({ styles, summaryText }: { styles: any; summaryText: string }) {
  return (
  <View>
            <View style={styles.sectionTitleBox}><Text style={styles.sectionTitle}>Executive Summary</Text></View>
            <Text style={styles.summary}>{summaryText}</Text>
          </View>  )
}

export default SummerySection