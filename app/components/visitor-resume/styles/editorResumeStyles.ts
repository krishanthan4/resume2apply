import { StyleSheet, Font } from "@react-pdf/renderer";
import path from "path";

Font.register({
  family: "Calibri",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/calibri/calibri-regular.ttf"),
    },
    {
      src: path.join(process.cwd(), "public/fonts/calibri/calibri-bold.ttf"),
      fontWeight: "bold",
    },
    {
      src: path.join(process.cwd(), "public/fonts/calibri/calibri-italic.ttf"),
      fontStyle: "italic",
    },
    {
      src: path.join(
        process.cwd(),
        "public/fonts/calibri/calibri-bold-italic.ttf",
      ),
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

const getStyles = (configStyles: any) => {
  const fontSizeBase = configStyles?.fontSizeBase ?? 11.5;
  const fontSizeTitle = configStyles?.fontSizeTitle ?? 12;
  const lineHightBase = configStyles?.lineHeightBase ?? 1.3;
  const textBulletSpace = configStyles?.textBulletSpace ?? 1;
  const subTitlesSpaceBottom = configStyles?.subTitlesSpaceBottom ?? 2;
  const pagePaddingTop = configStyles?.pagePaddingTop ?? 0.3;
  const pagePaddingBottom = configStyles?.pagePaddingBottom ?? 0.3;
  const pagePaddingLeft = configStyles?.pagePaddingLeft ?? 0.4;
  const pagePaddingRight = configStyles?.pagePaddingRight ?? 0.4;
  
  const headerNameMarginBottom = configStyles?.headerNameMarginBottom ?? 3;
  const sectionTitleBoxMarginTop = configStyles?.sectionTitleBoxMarginTop ?? 8;
  const sectionTitleBoxMarginBottom = configStyles?.sectionTitleBoxMarginBottom ?? 5;
  const sectionTitleBoxPaddingTop = configStyles?.sectionTitleBoxPaddingTop ?? 8;

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      paddingTop: pagePaddingTop + "in",
      paddingBottom: pagePaddingBottom + "in",
      paddingLeft: pagePaddingLeft + "in",
      paddingRight: pagePaddingRight + "in",
      fontFamily: "Calibri",
    },
    headerName: {
      fontSize: 20,
      fontWeight: "bold",
      color: configStyles?.titleColor || "#000000",
      textAlign: "center",
      marginBottom: headerNameMarginBottom,
      textTransform: "uppercase",
    },
    sectionTitleBox: {
      borderTopWidth: configStyles?.dividerPosition === "top" ? 1 : 0,
      borderBottomWidth: configStyles?.dividerPosition === "bottom" ? 1 : 0,
      borderTopColor: configStyles?.dividerPosition === "top" ? (configStyles?.borderColor || "#000000") : "transparent",
      borderBottomColor: configStyles?.dividerPosition === "bottom" ? (configStyles?.borderColor || "#000000") : "transparent",
      marginTop: sectionTitleBoxMarginTop,
      marginBottom: sectionTitleBoxMarginBottom,
      paddingTop: sectionTitleBoxPaddingTop,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: configStyles?.titleColor || "#000000",
      textTransform: configStyles?.sectionTitlesUppercase === false ? "none" : "uppercase",
    },

    // PERSONAL DETAILS
    personalDetailsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      // marginBottom: 3,
    },
    personalDetailItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    personalDetailText: {
      fontSize: fontSizeBase,
      color: "#000000",
      textDecoration: "none",
    },
    personalDetailLink: {
      fontSize: fontSizeBase,
      color: "#000000",
      textDecoration: configStyles?.underlineLinks === false ? "none" : "underline",
    },
    personalDetailIcon: {
      marginRight: 3,
      marginTop: -3,
    },
    detailSeparator: {
      marginHorizontal: 2,
      fontSize: fontSizeBase,
      color: "#000000",
    },

    // EXECUTIVE SUMMARY
    summary: {
      fontSize: fontSizeBase,
      lineHeight: lineHightBase,
      // textAlign: "justify",
    },

    // EXPERIENCE
    experienceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      // lineHeight: lineHightBase,
      marginBottom: subTitlesSpaceBottom,
    },
    experienceTitleLeft: {
      fontSize: fontSizeTitle,
    },
    dateItalicText: {
      fontSize: fontSizeBase,
      fontStyle: "italic",
    },

    // BULLETS
    bulletRow: {
      flexDirection: "row",
      marginTop: textBulletSpace,
    },
    bulletLabel: {
      width: 12,
      fontSize: fontSizeBase,
      textAlign: "center",
    },
    bulletText: {
      flex: 1,
      fontSize: fontSizeBase,
    },

    // PROJECTS
    projectHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      // lineHeight: lineHightBase,
      marginBottom: subTitlesSpaceBottom,
    },
    projectTitle: {
      fontSize: fontSizeTitle,
      fontWeight: "bold",
    },
    projectLink: {
      fontSize: fontSizeBase,
      color: "#000000",
      textDecoration: configStyles?.underlineLinks === false ? "none" : "underline",
    },
    techStackRow: {
      flexDirection: "row",
      // marginTop: 2,
      // lineHeight: 1.25,
    },

    // SKILLS
    skillTextRow: {
      fontSize: fontSizeBase,
      lineHeight: lineHightBase,
      // marginTop: 2,
    },

    // EDUCATION
    educationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      // marginTop: 4,
      // lineHeight: 1,
    },
    educationDegree: {
      fontSize: fontSizeTitle,
      fontWeight: "bold",
    },
    educationUni: {
      fontSize: fontSizeTitle,
    },
    educationLocation: {
      fontSize: fontSizeTitle,
      fontStyle: "italic",
    },
    educationDate: {
      fontSize: fontSizeTitle,
      fontWeight: "bold",
    },
  });
};

export default getStyles;
