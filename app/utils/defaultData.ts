// Default data for seeding and UI fallbacks
export interface ExecutiveSummaryTemplate {
    title: string;
    shortSummary: string;
    detailedSummary: string;
}

export interface CoverLetterTemplate {
    title: string;
    subject: string;
    body: string;
}

export const defaultExecutiveSummaryTemplates: ExecutiveSummaryTemplate[] = [
    {
        title: "general executive summary",
        shortSummary: "Adaptable Software Engineer with 1+ years of experience in full-stack development. Proficient in building modern, scalable applications from conception to deployment.",
        detailedSummary: "Dedicated Software Engineer with over a year of experience specializing in web and mobile solutions. Expertise spans the full development lifecycle, from designing highly responsive front-end components with React and Next.js to architecting efficient back-end services with Node.js. Committed to writing clean, maintainable code and solving complex technical challenges while delivering high-impact products that align with strategic business goals."
    },
    {
        title: "Full-Stack Developer",
        shortSummary: "Versatile developer with a strong grasp of both front-end and back-end ecosystems. Expert at delivering end-to-end features with Next.js and Node.js.",
        detailedSummary: "Dynamic Full-Stack Developer with 1+ years of professional experience across modern web technologies. I am excited about the {{position}} opportunity at {{company}}, where I can leverage my expertise in the JavaScript/TypeScript ecosystem to build performant user interfaces and robust server-side systems. Skilled in managing databases, optimizing API performance, and creating seamless user experiences through integrated, high-performance software architectures.",
    },
    {
        title: "Frontend Developer",
        shortSummary: "UI/UX-focused engineer specializing in creating intuitive, high-performance web applications using React, Next.js, and modern CSS frameworks.",
        detailedSummary: "Detail-oriented Frontend Developer with 1+ years of experience crafting visually stunning and highly interactive user interfaces. I am particularly interested in the {{position}} role at {{company}}, applying my expertise in modern React patterns and performance optimization to drive user engagement. Focused on building accessible, mobile-first designs and scalable component libraries that translate complex design requirements into pixel-perfect, performant code.",
    },
    {
        title: "Backend Developer",
        shortSummary: "Scale-oriented engineer specializing in distributed systems, microservices, and high-concurrency API design using Node.js and cloud technologies.",
        detailedSummary: "Results-driven Backend Developer with a deep focus on architectural integrity and server-side performance. I am eager to apply for the {{position}} position at {{company}}, bringing my experience in designing RESTful APIs and managing relational databases to your server-side infrastructure. Proven track record in optimizing data processing pipelines and building resilient, secure systems that scale seamlessly to meet high user demand.",
    },
    {
        title: "Mobile Developer (Cross-Platform)",
        shortSummary: "Experienced mobile engineer building high-quality, native-feeling applications for iOS and Android using Flutter and React Native.",
        detailedSummary: "Passionate Mobile Developer specialized in cross-platform development with a strong emphasis on consistent performance and native user experiences. I am excited to apply for the {{position}} position at {{company}}, where I can contribute my skills in Flutter and React Native to build high-quality mobile applications. Experienced in the entire app deployment lifecycle, ensuring bug-free releases that align with user expectations and technical excellence.",
    }
];


export const defaultCoverLetterTemplates: CoverLetterTemplate[] = [
    {
        title: "General Professional",
        subject: "Application for {{position}} - {{company}}",
        body: "Dear Hiring Team,\n\nI am writing to express my strong interest in the {{position}} role at {{company}}. My background in building scalable web and mobile applications aligns perfectly with the requirements of this role. I have consistently delivered high-quality solutions using modern JavaScript technologies and thrive in fast-paced, collaborative environments.\n\nThank you for considering my application. I look forward to discussing how my skills can contribute to {{company}}'s upcoming projects.\n\nBest regards,\nCandidate"
    },
    {
        title: "Full-Stack Developer",
        subject: "Full-Stack Developer Application: {{position}} at {{company}}",
        body: "Hello,\n\nI'm reaching out to apply for the {{position}} position at {{company}}. As a Full-Stack Developer with a focus on the Next.js and Node.js ecosystems, I excel at bridgeing the gap between front-end aesthetics and back-end performance. In my previous work, I've built end-to-end features that improved user engagement and system reliability.\n\nI'm particularly drawn to {{company}}'s innovative approach and would love to bring my versatility and problem-solving skills to your team.\n\nSincerely,\nCandidate"
    },
    {
        title: "Frontend Specialist",
        subject: "Frontend Developer Inquiry - {{position}} @ {{company}}",
        body: "Dear Team,\n\nI am excited to submit my application for the {{position}} role at {{company}}. With a passion for creating intuitive, high-performance user interfaces, I specialize in building responsive web applications using React and Next.js. I have a proven ability to translate complex designs into smooth, accessible code that provides a top-tier user experience.\n\nI look forward to the possibility of discussing my technical background and design-first mindset with you.\n\nBest,\nCandidate"
    },
    {
        title: "Backend Specialist",
        subject: "Backend Engineer Application - {{position}} - {{company}}",
        body: "Dear Hiring Manager,\n\nI am applying for the {{position}} position at {{company}}. My expertise in server-side engineering, database management, and API design makes me a strong fit for your backend infrastructure needs. I have experience in building highly scalable microservices and maintaining data integrity in high-traffic environments.\n\nI'm eager to bring my architectural focus and performance-driven approach to {{company}}.\n\nRegards,\nCandidate"
    },
    {
        title: "Mobile App Developer",
        subject: "Mobile Developer Application for {{position}} at {{company}}",
        body: "Hi,\n\nI am writing to apply for the {{position}} role at {{company}}. Having built and deployed several cross-platform applications using Flutter and React Native, I am confident in my ability to deliver high-quality mobile experiences for your users. I focus on achieving native performance while maintaining a single codebase, ensuring fast development cycles without compromising on quality.\n\nThank you for your time and consideration!\n\nBest,\nCandidate"
    }
];