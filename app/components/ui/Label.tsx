import React from "react";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>((props, ref) => {
  return (
    <label
      ref={ref}
      {...props}
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "#52525b",
        marginBottom: 5,
        display: "block",
        ...props.style,
      }}
    />
  );
});

Label.displayName = "Label";
