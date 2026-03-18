import renderContactDetails from "./RenderContactDetailsSection";
import { Text, View } from "@react-pdf/renderer";

function HeaderSection({ styles, common }: { styles: any; common: any }) {
  return (
    <View>
      <Text style={styles.headerName}>{common?.name || "Your Name"}</Text>
      {renderContactDetails({ common, styles })}
    </View>
  );
}

export default HeaderSection;
