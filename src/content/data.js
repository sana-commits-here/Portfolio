// ─────────────────────────────────────────────────────────────
// CONTENT — single source of truth for the whole site.
// Everything here comes from Sana's existing portfolio. Nothing is
// invented: where information is missing (education, resume PDF,
// per-project repo links, DOIs) the field is left empty and the UI
// adapts instead of showing a placeholder.
// ─────────────────────────────────────────────────────────────

export const IDENTITY = {
  name: 'Sana Badagan',
  first: 'Sana',
  last: 'Badagan',
  role: 'AI / ML Engineer',
  currentRole: 'AI, Frontend & Automation Developer',
  currentOrg: 'Codetrappers',
  location: 'Bangalore, India',
  timezone: 'Asia/Kolkata',
  statement:
    'I architect agentic AI workflows, production RAG pipelines, and edge computer vision systems to solve complex operational challenges.',
  about:
    'I specialize in Agentic AI and intelligent digital products, and help businesses solve complex problems through thoughtful, effective digital solutions.',
  portrait: '/images/portrait.webp',
  site: 'https://sanabadagan.vercel.app',
};

export const CHANNELS = {
  email: 'sanabadagan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sanabadagan',
  github: 'https://github.com/sana-commits-here',
  // Drop a PDF into /public (e.g. /Sana_Badagan_Resume.pdf) and set the path
  // here. While it is null, "Download PDF" prints the on-site system profile.
  resumeUrl: null,
};

// Education is intentionally empty: the previous portfolio did not list it,
// and this site never invents credentials. Add entries and the
// "Knowledge progression" strip appears automatically in the Research layer.
// Shape: { stage: 'FOUNDATION', degree: '', institution: '', period: '', note: '' }
export const EDUCATION = [];

// Focus areas, each backed by evidence that exists elsewhere in this file.
// x / y place the point in the "embedding" plot (0–1).
export const FOCUS = [
  { id: 'cv', label: 'Computer Vision', x: 0.22, y: 0.3, evidence: ['amakh', 'amr', 'vanguard'] },
  { id: 'edge', label: 'Edge AI', x: 0.34, y: 0.62, evidence: ['amr', 'vanguard', 'amakh'] },
  { id: 'robotics', label: 'Robotics', x: 0.16, y: 0.8, evidence: ['amr', 'icammae'] },
  { id: 'genai', label: 'Generative AI', x: 0.7, y: 0.24, evidence: ['tripify', 'medibuddy'] },
  { id: 'agentic', label: 'Agentic AI & RAG', x: 0.84, y: 0.5, evidence: ['tripify'] },
  { id: 'nlp', label: 'NLP', x: 0.62, y: 0.72, evidence: ['stagezero', 'medibuddy'] },
  { id: 'xai', label: 'Explainable AI', x: 0.47, y: 0.4, evidence: ['docuwise'] },
  { id: 'web', label: 'Frontend & Automation', x: 0.9, y: 0.93, evidence: ['codetrappers', 'tripify'] },
];

// Tools placed around the focus areas they serve (labels come from SKILLS).
// `left` puts the label on the left of the dot near the right edge.
export const FOCUS_TOOLS = [
  { skill: 'python', x: 0.34, y: 0.1, focus: ['cv', 'edge', 'robotics', 'genai', 'agentic', 'nlp', 'xai'] },
  { skill: 'pytorch', x: 0.4, y: 0.21, focus: ['cv', 'edge'] },
  { skill: 'tensorflow', x: 0.46, y: 0.06, focus: ['cv'] },
  { skill: 'docker', x: 0.03, y: 0.06, focus: ['web', 'agentic'] },
  { skill: 'git', x: 0.15, y: 0.06, focus: ['web'] },
  { skill: 'opencv', x: 0.08, y: 0.2, focus: ['cv', 'robotics'] },
  { skill: 'yolo', x: 0.2, y: 0.17, focus: ['cv', 'edge', 'robotics'] },
  { skill: 'lowlat', x: 0.05, y: 0.41, focus: ['cv', 'edge'] },
  { skill: 'shap', x: 0.45, y: 0.32, focus: ['xai'] },
  { skill: 'lime', x: 0.56, y: 0.33, focus: ['xai'] },
  { skill: 'sklearn', x: 0.4, y: 0.51, focus: ['xai'] },
  { skill: 'xgboost', x: 0.57, y: 0.51, focus: ['xai'] },
  { skill: 'ncnn', x: 0.2, y: 0.53, focus: ['edge', 'robotics'] },
  { skill: 'rpi', x: 0.23, y: 0.7, focus: ['edge', 'robotics'] },
  { skill: 'cuda', x: 0.3, y: 0.89, focus: ['edge', 'cv'] },
  { skill: 'pwm', x: 0.03, y: 0.91, focus: ['robotics'] },
  { skill: 'cpp', x: 0.05, y: 0.71, focus: ['robotics', 'edge'] },
  { skill: 'ollama', x: 0.64, y: 0.13, focus: ['genai', 'agentic'] },
  { skill: 'langchain', x: 0.79, y: 0.32, focus: ['genai', 'agentic'] },
  { skill: 'rag', x: 0.98, y: 0.57, focus: ['agentic', 'genai'], left: true },
  { skill: 'fastapi', x: 0.98, y: 0.39, focus: ['agentic', 'web'], left: true },
  { skill: 'nlp', x: 0.5, y: 0.82, focus: ['nlp'] },
  { skill: 'annot', x: 0.67, y: 0.63, focus: ['nlp'] },
  { skill: 'react', x: 0.72, y: 0.82, focus: ['web'] },
  { skill: 'tailwind', x: 0.99, y: 0.86, focus: ['web'], left: true },
  { skill: 'motion', x: 0.99, y: 0.71, focus: ['web'], left: true },
  { skill: 'vercel', x: 0.8, y: 0.8, focus: ['web'] },
];

export const EXPERIENCE = [
  {
    id: 'codetrappers',
    org: 'Codetrappers',
    role: 'AI, Frontend & Automation Developer',
    location: '',
    period: 'Nov 2026 – Present',
    start: '2026-11',
    type: 'Current role',
    summary:
      'A role spanning AI integration, frontend engineering and automation: take a requirement, research it independently, and turn it into a working solution.',
    stats: [
      { value: '15', label: 'Outreach site templates' },
      { value: '6', label: 'Business niches' },
      { value: '6', label: 'Regional markets' },
    ],
    highlights: [
      'Designed and built 15 sales-outreach website templates across six business niches (auto repair & garages, detailing, weddings, tourism, fitness and industrial), localised for markets including Mexico, the UAE, Saudi Arabia, Oman, the UK and British Columbia.',
      'Made every template data-driven: each business’s details live in a single lead file, so a new prospect demo comes from swapping data instead of rewriting code.',
      'Built with React, Vite and Tailwind CSS v4, using GSAP and Framer Motion for motion design, and shipped live demos to production on Vercel.',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS v4', 'GSAP', 'Framer Motion', 'Vercel', 'Git'],
  },
  {
    id: 'amakh',
    org: 'Amakh Technologies',
    role: 'Research and AI Developer',
    location: 'Hyderabad, India',
    period: 'Sep 2025 – 2026',
    start: '2025-09',
    type: 'Full-time',
    summary:
      'Led real-time ML inference architecture, edge computer vision deployments, and engineering standardization across client projects.',
    stats: [
      { value: '50+', label: 'AI/ML pipelines shipped' },
      { value: '30+', label: 'FPS real-time vision' },
      { value: '50+', label: 'Project lifecycles mentored' },
    ],
    highlights: [
      'Architected and shipped 50+ production-grade AI/ML pipelines using Python, PyTorch, and TensorFlow, cutting failure rates through strict dataset curation and model tuning.',
      'Engineered automated, low-latency computer vision pipelines sustaining 30+ FPS for mission-critical client deployments.',
      'Directed end-to-end evaluation cycles, executing root-cause failure mode analysis and dataset refinements under physical hardware constraints.',
      'Mentored junior engineering contributors across 50+ project lifecycles, establishing modular code patterns and standardized validation workflows.',
    ],
    stack: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Low-Latency Vision', 'Failure Mode Analysis'],
    signal: {
      quote:
        'Exceptional communication and problem-solving skills. She is a disciplined, invaluable asset to our team.',
      name: 'Sayed Abdul Khadir',
      role: 'Founder & Director, Amakh Innovating Tomorrow pvt. Ltd.',
    },
  },
  {
    id: 'stagezero',
    org: 'StageZero Technologies',
    role: 'Data Science Intern',
    location: 'Helsinki, Finland (Remote)',
    period: 'May 2023 – Oct 2023',
    start: '2023-05',
    type: 'Internship',
    summary:
      'Automated ML/NLP data preparation pipelines and collaborated with cross-functional product teams on research publication delivery.',
    stats: [
      { value: '10+', label: 'Workflows automated' },
      { value: '25%', label: 'Faster data prep' },
      { value: '4+', label: 'Research publications' },
    ],
    highlights: [
      'Automated ML and NLP workflows across 10+ operational processes, boosting data annotation and prep efficiency by 25%.',
      'Collaborated directly with engineering and product squads to restructure delivery milestones, accelerating timelines by 15%.',
      'Synthesized complex model telemetry into accessible stakeholder insights, co-authoring 4+ research publications that increased platform visibility by 30%.',
    ],
    stack: ['Python', 'NLP Pipelines', 'Data Annotation', 'Stakeholder Communication', 'Research'],
    signal: {
      quote:
        'Sana has a sharp understanding of complex algorithms and a deep expertise in AI/ML, particularly in LLMs and NLP. She is fantastic at translating that theory into real-world applications.',
      name: 'Abdul Muthalib',
      role: 'Project Manager, StageZero Technologies',
    },
  },
];

export const PROJECTS = [
  {
    id: 'tripify',
    index: '01',
    name: 'Tripify',
    title: 'Smart AI Travel Planner',
    domain: 'Generative AI & Geospatial',
    context: 'Full-Stack AI Project',
    year: '2026',
    viz: 'route',
    vizLabel: 'RAG · route synthesis',
    capture: { src: '/media/tripify-planner.jpg', alt: 'Tripify AI Travel Studio: trip parameter form beside a Leaflet map of Goa with live POI markers', w: 1400, h: 673 },
    challenge:
      'Planning custom multi-day travel itineraries often leads to hallucinations in LLMs, unrealistic travel distances, and lack of verified localized attractions.',
    role:
      'Full-Stack AI Developer — architected the RAG retrieval pipeline, asynchronous FastAPI backend, stateful chat workflows, and the React Leaflet dashboard.',
    solution:
      'Engineered an offline-capable agentic planner pairing local Llama 3.2 (via Ollama) with live OpenTripMap geospatial data. Integrated Leaflet interactive routing, Chart.js budget breakdowns, and SQLite persistence for iterative conversational modifications.',
    results: [
      { value: '0', label: 'POI hallucinations' },
      { value: '100%', label: 'Local / offline inference' },
      { value: '< 2.5s', label: 'End-to-end generation' },
      { value: '94%', label: 'Itinerary acceptance rate' },
      { value: '$0', label: 'Cloud API token overhead' },
      { value: '50+ ms', label: 'Geospatial spatial query' },
    ],
    stack: ['FastAPI', 'LangChain', 'Llama 3.2 (Ollama)', 'React 18', 'Leaflet', 'Chart.js', 'SQLite', 'Tailwind CSS'],
  },
  {
    id: 'amr',
    index: '02',
    name: 'AMR',
    title: 'Autonomous Mobile Robot',
    domain: 'Edge AI & Robotics Research',
    context: 'Personal Project',
    year: '2026',
    viz: 'robot',
    vizLabel: 'human-following · move your cursor',
    capture: { src: '/media/amr-field.jpg', alt: 'The 4WD autonomous mobile robot: PVC frame, webcam on top, Raspberry Pi and motor drivers on a plywood base, in a lab corridor', w: 1100, h: 919 },
    challenge:
      'Executing real-time human detection and closed-loop obstacle avoidance under strict edge compute constraints, thermal limits, and sensor occlusions on physical mobile hardware.',
    role:
      'Robotics & Edge AI Developer — architected the quantized computer vision pipeline, wrote low-level PWM motor control firmware, and designed deterministic rule-based safety fallbacks.',
    solution:
      'Engineered an autonomous 4WD mobile robot powered by a Raspberry Pi 5. Quantized a custom YOLOv8n model via Tencent NCNN FP16 to sustain low-latency inference on ARM CPUs, paired with closed-loop PWM control and interrupt-driven collision avoidance.',
    results: [
      { value: '90%', label: 'Tracking precision' },
      { value: '92%', label: 'Obstacle avoidance' },
      { value: '18 FPS', label: 'Edge inference rate' },
      { value: '3–7 kg', label: 'Payload capacity' },
      { value: '61 ms', label: 'End-to-end latency' },
      { value: 'ICAMMAE', label: 'Research publication' },
    ],
    stack: ['Python', 'C++', 'Raspberry Pi 5', 'YOLOv8n', 'Tencent NCNN', 'OpenCV', 'PWM Motor Control', 'Edge Computing'],
  },
  {
    id: 'docuwise',
    index: '03',
    name: 'DocuWise',
    title: 'Explainable AI Placement Engine',
    domain: 'Explainable AI & Predictive Analytics',
    context: 'Amakh Innovating Tomorrow',
    year: '2025',
    viz: 'xai',
    vizLabel: 'feature attribution · schematic',
    capture: null,
    challenge:
      "Conventional placement classifiers operate as opaque 'black boxes' — they output raw binary odds without explaining underlying feature attributions or prescribing actionable recovery pathways for at-risk candidates.",
    role:
      'Lead ML Developer — built the automated multi-model training pipeline, engineered cooperative game-theory interpretability layers (SHAP & LIME), and authored the automated gap-analysis roadmap engine.',
    solution:
      'Developed an end-to-end framework evaluating SVM, XGBoost, and Random Forest models. Integrated SHAP KernelExplainers for global/local Shapley values and LIME for local surrogate decision boundaries, feeding into an automated 90-day upskilling roadmap generator.',
    results: [
      { value: '100%', label: 'Interpretable decisions (XAI)' },
      { value: '4 Models', label: 'Automated benchmarking' },
      { value: 'SHAP + LIME', label: 'Dual explainer framework' },
      { value: '90-Day', label: 'Actionable upskilling roadmaps' },
      { value: '< 150ms', label: 'Attribution inference latency' },
      { value: '5 Profiles', label: 'Domain career pathways' },
    ],
    stack: ['Python 3.10+', 'Scikit-Learn', 'XGBoost', 'SHAP', 'LIME', 'Flask', 'Chart.js', 'Glassmorphic UI'],
  },
  {
    id: 'vanguard',
    index: '04',
    name: 'Vanguard AI',
    title: 'Wildlife Poaching & Intrusion Detection',
    domain: 'Edge Computer Vision & Real-Time Alerting',
    context: 'Conservation AI & Edge Vision',
    year: '2024',
    viz: 'vision',
    vizLabel: 'detection · your cursor is the intruder',
    capture: null,
    challenge:
      'Detecting armed intruders, weapons, and unauthorized vehicles in dense, low-visibility wildlife habitats while avoiding false positives on native fauna and maintaining millisecond edge latency.',
    role:
      'Computer Vision & Edge Systems Engineer — trained the fine-grained custom detection model, built the automated FP16 CUDA inference pipeline, and implemented the webhook dispatch architecture.',
    solution:
      'Fine-tuned a YOLOv8 architecture across 72 discrete threat and wildlife classes utilizing FP16 Automatic Mixed Precision (AMP) on CUDA. Integrated an automated Discord alerting dispatcher with cooldown throttling, SQLite forensic logging, and an interactive cyber-agritech Streamlit dashboard.',
    results: [
      { value: '4.6 ms', label: 'Inference latency (RTX 2050)' },
      { value: '72 Classes', label: 'Fine-grained target ontology' },
      { value: '100%', label: 'Automated incident dispatch' },
      { value: 'FP16 AMP', label: 'Precision CUDA acceleration' },
      { value: '3 Modes', label: 'Image, video & live stream' },
      { value: '0 Loss', label: 'Forensic evidence logging' },
    ],
    stack: ['Python 3.10+', 'YOLOv8 (Ultralytics)', 'PyTorch (CUDA 12.7)', 'Streamlit', 'Discord Webhooks', 'OpenCV', 'SQLite', 'Plotly'],
  },
];

export const PUBLICATIONS = [
  {
    id: 'icammae',
    title: 'Design and Development of an Autonomous Human-Following Mobile Robot',
    venue: 'International Conference on Advances in Mechanical, Materials and Automotive Engineering (ICAMMAE)',
    venueShort: 'ICAMMAE',
    year: '2026',
    role: 'Co-Author & Lead AI/Robotics Researcher',
    kind: 'Peer-reviewed conference',
    abstract:
      'Investigates edge-quantized vision pipelines and deterministic closed-loop PWM control algorithms for 4WD mobile platforms using YOLOv8n and Tencent NCNN FP16 on Raspberry Pi hardware.',
    topics: ['Robotics', 'Edge AI', 'NCNN Quantization', 'YOLOv8', 'Computer Vision'],
    figure: ['Camera', 'YOLOv8n', 'NCNN FP16', 'PWM control', '4WD drive'],
    related: 'amr',
    link: null,
  },
  {
    id: 'medibuddy',
    title: 'Medibuddy — A Healthcare Chatbot using AI',
    venue: 'International Research Journal / Conference Proceedings',
    venueShort: 'Published paper',
    year: '2024',
    role: 'Lead Author',
    kind: 'Published paper',
    abstract:
      'Presents a conversational NLP architecture designed for preliminary clinical inquiry triage, patient intent parsing, and contextual health guidance.',
    topics: ['Natural Language Processing', 'Conversational AI', 'Healthcare Tech'],
    figure: ['Patient query', 'Intent parsing', 'Inquiry triage', 'Health guidance'],
    related: null,
    link: null,
  },
];

// Skills ecosystem. Every node points (refs) at the experience, project or
// publication where the skill was actually used.
export const SKILL_CLUSTERS = [
  { id: 'lang', label: 'Languages' },
  { id: 'ml', label: 'ML / DL' },
  { id: 'vision', label: 'Vision' },
  { id: 'llm', label: 'Language & GenAI' },
  { id: 'xai', label: 'Explainability' },
  { id: 'edge', label: 'Edge & Robotics' },
  { id: 'eng', label: 'Product Engineering' },
];

export const SKILLS = [
  { id: 'python', label: 'Python', cluster: 'lang', refs: ['amakh', 'stagezero', 'tripify', 'amr', 'docuwise', 'vanguard'] },
  { id: 'cpp', label: 'C++', cluster: 'lang', refs: ['amr'] },

  { id: 'pytorch', label: 'PyTorch', cluster: 'ml', refs: ['amakh', 'vanguard'] },
  { id: 'tensorflow', label: 'TensorFlow', cluster: 'ml', refs: ['amakh'] },
  { id: 'sklearn', label: 'Scikit-Learn', cluster: 'ml', refs: ['docuwise'] },
  { id: 'xgboost', label: 'XGBoost', cluster: 'ml', refs: ['docuwise'] },
  { id: 'fma', label: 'Failure-mode analysis', cluster: 'ml', refs: ['amakh'] },

  { id: 'opencv', label: 'OpenCV', cluster: 'vision', refs: ['amakh', 'amr', 'vanguard'] },
  { id: 'yolo', label: 'YOLOv8', cluster: 'vision', refs: ['amr', 'vanguard', 'icammae'] },
  { id: 'lowlat', label: 'Low-latency vision', cluster: 'vision', refs: ['amakh', 'vanguard'] },

  { id: 'langchain', label: 'LangChain', cluster: 'llm', refs: ['tripify'] },
  { id: 'ollama', label: 'Ollama · Llama 3.2', cluster: 'llm', refs: ['tripify'] },
  { id: 'rag', label: 'RAG pipelines', cluster: 'llm', refs: ['tripify'] },
  { id: 'nlp', label: 'NLP pipelines', cluster: 'llm', refs: ['stagezero', 'medibuddy'] },
  { id: 'annot', label: 'Data annotation', cluster: 'llm', refs: ['stagezero'] },

  { id: 'shap', label: 'SHAP', cluster: 'xai', refs: ['docuwise'] },
  { id: 'lime', label: 'LIME', cluster: 'xai', refs: ['docuwise'] },

  { id: 'rpi', label: 'Raspberry Pi 5', cluster: 'edge', refs: ['amr', 'icammae'] },
  { id: 'ncnn', label: 'NCNN FP16', cluster: 'edge', refs: ['amr', 'icammae'] },
  { id: 'cuda', label: 'CUDA · FP16 AMP', cluster: 'edge', refs: ['vanguard'] },
  { id: 'pwm', label: 'PWM motor control', cluster: 'edge', refs: ['amr', 'icammae'] },

  { id: 'fastapi', label: 'FastAPI', cluster: 'eng', refs: ['tripify'] },
  { id: 'flask', label: 'Flask', cluster: 'eng', refs: ['docuwise'] },
  { id: 'streamlit', label: 'Streamlit', cluster: 'eng', refs: ['vanguard'] },
  { id: 'react', label: 'React', cluster: 'eng', refs: ['tripify', 'codetrappers'] },
  { id: 'tailwind', label: 'Tailwind CSS', cluster: 'eng', refs: ['tripify', 'codetrappers'] },
  { id: 'motion', label: 'GSAP · Framer Motion', cluster: 'eng', refs: ['codetrappers'] },
  { id: 'vercel', label: 'Vercel', cluster: 'eng', refs: ['codetrappers'] },
  { id: 'sqlite', label: 'SQLite', cluster: 'eng', refs: ['tripify', 'vanguard'] },
  { id: 'docker', label: 'Docker', cluster: 'eng', refs: [] },
  { id: 'git', label: 'Git', cluster: 'eng', refs: ['codetrappers'] },
];

// Lookup for anything a ref can point to.
export const ENTITIES = Object.fromEntries([
  ...EXPERIENCE.map((e) => [e.id, { kind: 'Experience', label: `${e.role} · ${e.org}`, anchor: '#experience' }]),
  ...PROJECTS.map((p) => [p.id, { kind: 'Experiment', label: `${p.index} ${p.name} — ${p.title}`, anchor: `#experiment-${p.id}` }]),
  ...PUBLICATIONS.map((p) => [p.id, { kind: 'Publication', label: `${p.venueShort} ${p.year} — ${p.title}`, anchor: '#research' }]),
]);

// Unified chronology used by the trajectory log (real dates only).
export const CHRONOLOGY = [
  { year: '2023', items: [{ ref: 'stagezero', kind: 'role' }] },
  { year: '2024', items: [{ ref: 'vanguard', kind: 'experiment' }, { ref: 'medibuddy', kind: 'publication' }] },
  { year: '2025', items: [{ ref: 'amakh', kind: 'role' }, { ref: 'docuwise', kind: 'experiment' }] },
  { year: '2026', items: [{ ref: 'tripify', kind: 'experiment' }, { ref: 'amr', kind: 'experiment' }, { ref: 'icammae', kind: 'publication' }, { ref: 'codetrappers', kind: 'role' }] },
];

export const LAYERS = [
  { id: 'top', n: '00', label: 'Input', op: 'identity' },
  { id: 'about', n: '01', label: 'About', op: 'embed' },
  { id: 'experience', n: '02', label: 'Experience', op: 'layers' },
  { id: 'projects', n: '03', label: 'Projects', op: 'attention' },
  { id: 'skills', n: '04', label: 'Skills', op: 'graph' },
  { id: 'research', n: '05', label: 'Research', op: 'laboratory' },
  { id: 'contact', n: '06', label: 'Contact', op: 'response' },
];
