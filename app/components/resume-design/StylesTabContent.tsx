import React from "react";
import { Settings } from "lucide-react";
import RadiusLine from "./RadiusLine";
import ToggleOption from "./ToggleOption";
import SectionTitleWithReset from "./SectionTitleWithReset";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";

interface StylesTabContentProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

export default function StylesTabContent({ config, setConfig }: StylesTabContentProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Section: Typography & Spacing */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionTitleWithReset 
          title="Basic Styles" 
          icon={<Settings size={14} />} 
          onReset={() => setConfig({
              ...config,
              fontSizeBase: 11.5,
              fontSizeTitle: 12,
              lineHeightBase: 1.3,
              subTitlesSpaceBottom: 2,
              textBulletSpace: 1,
              headerNameMarginBottom: 3,
              sectionTitleBoxMarginTop: 8,
              sectionTitleBoxMarginBottom: 5,
              sectionTitleBoxPaddingTop: 8,
              titleColor: "#000000"
          })} 
        />
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <RadiusLine label="Base Font Size" value={config.fontSizeBase} min={8} max={14} step={0.5} unit="pt" onChange={(v) => setConfig({ ...config, fontSizeBase: v })} />
          <RadiusLine label="Title Font Size" value={config.fontSizeTitle} min={10} max={18} step={0.5} unit="pt" onChange={(v) => setConfig({ ...config, fontSizeTitle: v })} />
          <RadiusLine label="Line Height" value={config.lineHeightBase} min={1} max={2} step={0.1} unit="" onChange={(v) => setConfig({ ...config, lineHeightBase: v })} />
          <RadiusLine label="Section Subtitle Space Bottom" value={config.subTitlesSpaceBottom} min={0} max={20} step={1} onChange={(v) => setConfig({ ...config, subTitlesSpaceBottom: v })} />
          <RadiusLine label="Text Bullet Space" value={config.textBulletSpace} min={0} max={20} step={1} onChange={(v) => setConfig({ ...config, textBulletSpace: v })} />
          <RadiusLine label="Header Margin Bottom" value={config.headerNameMarginBottom} min={0} max={20} step={1} onChange={(v) => setConfig({ ...config, headerNameMarginBottom: v })} />
          <RadiusLine label="Section Title Margin Top" value={config.sectionTitleBoxMarginTop} min={0} max={20} step={1} onChange={(v) => setConfig({ ...config, sectionTitleBoxMarginTop: v })} />
          <RadiusLine label="Section Title Margin Bottom" value={config.sectionTitleBoxMarginBottom} min={0} max={20} step={1} onChange={(v) => setConfig({ ...config, sectionTitleBoxMarginBottom: v })} />
          <RadiusLine label="Section Title Padding Top" value={config.sectionTitleBoxPaddingTop} min={0} max={20} step={1} onChange={(v) => setConfig({ ...config, sectionTitleBoxPaddingTop: v })} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          <Label style={{ fontSize: 13, fontWeight: 500, color: "#52525b" }}>Title Color</Label>
          <Input
            type="color"
            value={config.titleColor}
            onChange={(e) => setConfig({ ...config, titleColor: e.target.value })}
            style={{ width: "100%", height: 36, cursor: "pointer", borderRadius: 8, border: "1px solid #e4e4e7", background: "transparent", padding: 2 }}
          />
        </div>
      </div>

      {/* TOGGLE options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionTitleWithReset 
          title="Toggles & Options" 
          icon={<Settings size={14} />} 
          onReset={() => setConfig({
              ...config,
              enableIcons: true,
              underlineLinks: true,
              sectionTitlesUppercase: true,
              showGraduationDate: true,
              showPhoneNumber: true,
              showWebsite: true,
              showLocation: true,
              showGithub: true,
              showLinkedin: true,
              showExecutiveSummary: true,
              noHyperlinks: false,
              dividerPosition: "top",
              borderColor: "#707070",
          })} 
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <ToggleOption label="Personal Icons" checked={config.enableIcons} onChange={(v) => setConfig({ ...config, enableIcons: v })} />
          <ToggleOption label="Underline Links" checked={config.underlineLinks} onChange={(v) => setConfig({ ...config, underlineLinks: v })} />
          <ToggleOption label="Uppercase Titles" checked={config.sectionTitlesUppercase} onChange={(v) => setConfig({ ...config, sectionTitlesUppercase: v })} />
          <ToggleOption label="Graduation Dates" checked={config.showGraduationDate} onChange={(v) => setConfig({ ...config, showGraduationDate: v })} />
          <ToggleOption label="Phone Number" checked={config.showPhoneNumber} onChange={(v) => setConfig({ ...config, showPhoneNumber: v })} />
          <ToggleOption label="Website" checked={config.showWebsite} onChange={(v) => setConfig({ ...config, showWebsite: v })} />
          <ToggleOption label="Location" checked={config.showLocation} onChange={(v) => setConfig({ ...config, showLocation: v })} />
          <ToggleOption label="GitHub" checked={config.showGithub} onChange={(v) => setConfig({ ...config, showGithub: v })} />
          <ToggleOption label="LinkedIn" checked={config.showLinkedin} onChange={(v) => setConfig({ ...config, showLinkedin: v })} />
          <ToggleOption label="Exec Summary" checked={config.showExecutiveSummary} onChange={(v) => setConfig({ ...config, showExecutiveSummary: v })} />
          <ToggleOption label="No Hyperlinks" checked={config.noHyperlinks} onChange={(v) => setConfig({ ...config, noHyperlinks: v })} />
        </div>
      </div>

      {/* page configurations */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "#18181b", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e4e4e7", paddingBottom: 8 }}>
          <Settings size={14} /> Page Margins (inch)
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Top ({config.pagePaddingTop})</Label>
            <Input type="number" step="0.1" value={config.pagePaddingTop} onChange={(e) => setConfig({...config, pagePaddingTop: parseFloat(e.target.value)})} className="input-field" style={{ padding: "8px 10px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Bottom ({config.pagePaddingBottom})</Label>
            <Input type="number" step="0.1" value={config.pagePaddingBottom} onChange={(e) => setConfig({ ...config, pagePaddingBottom: parseFloat(e.target.value) })} className="input-field" style={{ padding: "8px 10px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Left ({config.pagePaddingLeft})</Label>
            <Input type="number" step="0.1" value={config.pagePaddingLeft} onChange={(e) => setConfig({ ...config, pagePaddingLeft: parseFloat(e.target.value) })} className="input-field" style={{ padding: "8px 10px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Right ({config.pagePaddingRight})</Label>
            <Input type="number" step="0.1" value={config.pagePaddingRight} onChange={(e) => setConfig({ ...config, pagePaddingRight: parseFloat(e.target.value) })} className="input-field" style={{ padding: "8px 10px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
