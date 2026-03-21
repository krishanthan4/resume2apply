import React from "react";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => {
  return (
    <select
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
        cursor: "pointer",
        ...props.style,
      }}
    />
  );
});

Select.displayName = "Select";
