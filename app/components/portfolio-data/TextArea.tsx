function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="textarea-field" style={{ minHeight: 88 }} {...props} />;
}

export default Textarea;
