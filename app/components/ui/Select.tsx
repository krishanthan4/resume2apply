import React from "react";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      className="w-full px-3 py-[9px] bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 outline-none cursor-pointer "
      style={props.style}
    />
  );
});

Select.displayName = "Select";
