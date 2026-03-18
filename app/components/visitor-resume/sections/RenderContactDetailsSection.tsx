import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import {
  EmailIcon,
  LinkIcon,
  GithubIcon,
  LinkedInIcon,
  LocationIcon,
  PhoneIcon,
} from "@/app/components/visitor-resume/contactIcons";
import { stripUrl } from "@/app/utils/helpers";

// Render Header details with separators
const renderContactDetails = ({
  common,
  styles,
}: {
  common: any;
  styles: any;
}) => {
  const items = [];
  if (common?.showPhoneNumber !== false && common?.phone?.enable && common?.phone?.number) {
    items.push(
      <View style={styles.personalDetailItem} key="phone">
        {common?.enableIcons && (
          <View style={styles.personalDetailIcon}>
            <PhoneIcon />
          </View>
        )}
        {common?.noHyperlinks ? (
          <Text style={styles.personalDetailText}>{common.phone.number}</Text>
        ) : (
          <Link style={styles.personalDetailText} src={`tel:${common.phone.number}`}>
            {common.phone.number}
          </Link>
        )}
      </View>,
    );
  }
  if (common?.email) {
    items.push(
      <View style={styles.personalDetailItem} key="email">
        {common?.enableIcons && (
          <View style={styles.personalDetailIcon}>
            <EmailIcon />
          </View>
        )}
        {common?.noHyperlinks ? (
          <Text style={styles.personalDetailText}>{common.email}</Text>
        ) : (
          <Link style={styles.personalDetailText} src={`mailto:${common.email}`}>
            {common.email}
          </Link>
        )}
      </View>,
    );
  }
  if (common?.showWebsite !== false && common?.personalWebsite) {
    items.push(
      <View style={styles.personalDetailItem} key="website">
        {common?.enableIcons && (
          <View style={styles.personalDetailIcon}>
            <LinkIcon />
          </View>
        )}
        {common?.noHyperlinks ? (
          <Text style={styles.personalDetailText}>{stripUrl(common.personalWebsite)}</Text>
        ) : (
          <Link style={styles.personalDetailLink} src={common.personalWebsite}>
            {stripUrl(common.personalWebsite)}
          </Link>
        )}
      </View>,
    );
  }
  if (common?.showLinkedin !== false && common?.linkedin) {
    items.push(
      <View style={styles.personalDetailItem} key="linkedin">
        {common?.enableIcons && (
          <View style={styles.personalDetailIcon}>
            <LinkedInIcon />
          </View>
        )}
        {common?.noHyperlinks ? (
          <Text style={styles.personalDetailText}>{stripUrl(common.linkedin)}</Text>
        ) : (
          <Link style={styles.personalDetailLink} src={common.linkedin}>
            LinkedIn
          </Link>
        )}
      </View>,
    );
  }
  if (common?.showGithub !== false && common?.github) {
    items.push(
      <View style={styles.personalDetailItem} key="github">
        {common?.enableIcons && (
          <View style={styles.personalDetailIcon}>
            <GithubIcon />
          </View>
        )}
        {common?.noHyperlinks ? (
          <Text style={styles.personalDetailText}>{stripUrl(common.github)}</Text>
        ) : (
          <Link style={styles.personalDetailLink} src={common.github}>
            GitHub
          </Link>
        )}
      </View>,
    );
  }
  if (common?.showLocation !== false && common?.location) {
    items.push(
      <View style={styles.personalDetailItem} key="location">
        {common?.enableIcons && (
          <View style={styles.personalDetailIcon}>
            <LocationIcon />
          </View>
        )}
        <Text style={styles.personalDetailText}>{common.location}</Text>
      </View>,
    );
  }

  return (
    <View style={styles.personalDetailsContainer}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item}
          {i < items.length - 1 && (
            <Text style={styles.detailSeparator}>|</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default renderContactDetails;
