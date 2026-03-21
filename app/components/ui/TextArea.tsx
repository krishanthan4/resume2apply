import React from "react";

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      style={{
        width: "100%",
        padding: "9px 12px",
        background: "#fff",
        border: "1px solid #e4e4e7",
        borderRadius: 8,
        fontSize: 13,
        color: "#18181b",
        outline: "none",
        resize: "vertical",
        lineHeight: 1.6,
        fontFamily: "inherit",
        ...props.style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#d4d4d8";
        if (props.onFocus) props.onFocus(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#e4e4e7";
        if (props.onBlur) props.onBlur(e);
      }}
    />
  );
});

TextArea.displayName = "TextArea";
