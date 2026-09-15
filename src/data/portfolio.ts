export const personalInfo = {
  name: 'Aditya Koushal',
  headline: 'Frontend Developer',
  tagline: 'Building clean, reliable web interfaces.',
  bio: 'Frontend developer with 1.5 years of experience building web applications with Angular and TypeScript. I focus on clean component structure, responsive layouts and interfaces that stay fast and easy to use.',
  location: 'India',
  email: 'aditya.koushal@email.com',
  resumeUrl: '/resume.pdf',
  social: {
    linkedin: 'https://www.linkedin.com/in/aditya-koushal-b58b39280',
  },
}

export const aboutCards = [
  {
    title: 'What I do',
    description: 'I build and maintain Angular applications — components, forms, routing and API integration for products that are used every day.',
    icon: '💻',
  },
  {
    title: 'Experience',
    description: '1.5 years of professional frontend experience working on production Angular projects with real users and real deadlines.',
    icon: '💼',
  },
  {
    title: 'How I work',
    description: 'Reusable components, readable code and responsive layouts that behave the same on every screen size.',
    icon: '🧩',
  },
  {
    title: 'Right now',
    description: 'Getting deeper into RxJS, state management with NgRx and Angular performance patterns.',
    icon: '🎯',
  },
]

/**
 * The employer name lives in one constant because the same company appears on
 * more than one timeline entry — the role changed, the company did not.
 * CHANGE IT HERE and every card that references it updates.
 */
export const currentEmployer = 'Current Company'

export interface ExperienceEntry {
  company: string
  role: string
  duration: string
  location: string
  /** Marks the role being held right now — renders a "Current role" pill. */
  current?: boolean
  /** Optional line under the company, e.g. to explain a role change. */
  note?: string
  achievements: string[]
  technologies: string[]
}

export const experience: ExperienceEntry[] = [
  {
    company: currentEmployer,
    role: 'Frontend Developer',
    duration: 'Jan 2025 - Present',
    location: 'India',
    current: true,
    achievements: [
      'Building and maintaining responsive web applications using Angular and TypeScript',
      'Creating reusable components with Angular Material and SCSS',
      'Integrating REST APIs with RxJS and handling application state',
      'Working with designers and backend developers to ship features end to end',
    ],
    technologies: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Angular Material'],
  },
  {
    company: currentEmployer,
    role: 'Junior Frontend Developer',
    duration: 'Jun 2024 - Dec 2024',
    location: 'India',
    note: 'Where I started at the same company, before moving up to Frontend Developer.',
    achievements: [
      'Developed shared component libraries used across multiple modules',
      'Built reactive forms with validation for data-heavy screens',
      'Implemented responsive layouts and fixed cross-browser issues',
      'Took part in code reviews and day-to-day bug fixing',
    ],
    technologies: ['Angular', 'TypeScript', 'JavaScript', 'SCSS', 'Git'],
  },
  {
    company: 'Internship Company',
    role: 'Frontend Intern',
    duration: 'Jan 2024 - May 2024',
    location: 'India',
    achievements: [
      'Assisted in building landing pages and internal dashboard screens',
      'Learned Angular fundamentals, Git workflows and code review practices',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Angular', 'Bootstrap'],
  },
]

export const education = [
  {
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'University Name',
    duration: '2020 - 2024',
    description: 'Computer science fundamentals, data structures, algorithms and web technologies.',
  },
  {
    degree: 'Higher Secondary Education',
    institution: 'School Name',
    duration: '2018 - 2020',
    description: 'Science stream with Mathematics and Computer Science.',
  },
]

export const skills = [
  { name: 'Angular', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'JavaScript', level: 88 },
  { name: 'HTML / CSS', level: 92 },
  { name: 'SCSS', level: 85 },
  { name: 'RxJS', level: 80 },
  { name: 'Angular Material', level: 85 },
  { name: 'REST APIs', level: 82 },
  { name: 'Responsive Design', level: 90 },
  { name: 'Git', level: 85 },
]

export interface Project {
  title: string
  description: string
  techStack: string[]
  /** Public URL. Leave it out entirely when there is nothing to link to —
   *  the card then renders without a button rather than with a dead one. */
  live?: string
  role?: string
  duration?: string
  features: string[]
}

export const projects: Project[] = [
  {
    title: 'WeatherMax',
    description: 'A weather platform with local forecasts, live conditions and severe weather alerts. I worked on the frontend — the dashboard layout, forecast views and the charts that present the data.',
    techStack: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Chart.js'],
    live: 'https://weathmax.co.uk',
    role: 'Frontend Developer',
    duration: '3 months',
    features: [
      '15-day and hourly forecast views',
      'Live weather conditions dashboard',
      'Severe weather alerts',
      'Multi-location support',
    ],
  },
  {
    title: 'CLCRM Phase V2',
    description: 'A SaaS CRM platform for managing clients, leads and day-to-day sales activity. I built the dashboard screens, the lead pipeline and the shared component library used across the app.',
    techStack: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Angular Material'],
    live: 'https://mycrm.wealthmax.co.uk',
    role: 'Frontend Developer',
    duration: '6 months',
    features: [
      'Dashboard with KPI metrics and charts',
      'Lead pipeline with drag-and-drop',
      'Client management screens',
      'Role-based access control',
    ],
  },
  {
    title: 'Protection & Mortgage CLCRM',
    description: 'A CRM built for mortgage and protection advisers to track applications, clients and tasks. I worked on the adviser dashboard, the application workflow screens and reporting views.',
    techStack: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Angular Material'],
    role: 'Frontend Developer',
    duration: '8 months',
    features: [
      'Mortgage application workflow',
      'Adviser dashboard with live metrics',
      'Client portfolio tracking',
      'Task management and reminders',
    ],
  },
]

export const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'About', icon: '👋' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'skills', label: 'Skills', icon: '🧠' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'contact', label: 'Contact', icon: '📞' },
]
