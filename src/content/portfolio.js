// ============================================================
// FolioX — Interactive Portfolio for Digital Professionals
// EDIT THIS FILE TO CUSTOMIZE THE ENTIRE TEMPLATE.
// Replace name, role, bio, services, skills, projects,
// testimonials and social links — no other code changes needed.
// ============================================================

export const PROFILE = {
  name: "Sana",
  role: "AI/ML Engineer",
  // Structure: "I help [type of clients] achieve [result] through [your expertise]."
  tagline:
    "I architect agentic AI workflows, production RAG pipelines, and edge computer vision systems to solve complex operational challenges.",
  // Replace with your photo, avatar or illustration:
  portrait:
    "images/WhatsApp_Image_2026-11-04_at_1.46.23_AM-removebg-preview.png",
  // Structure: "I specialize in [skill] and help businesses solve [problem]..."
  aboutText:
    "I specialize in Agentic AI and intelligent digital products, and help businesses solve complex problems through thoughtful, effective digital solutions. Let's build something incredible together!",
};

export const METRICS = [
  { value: "1+", label: "Years Experience" },
  { value: "50+", label: "Projects" },
  { value: "45+", label: "Clients" },
  { value: "Remote", label: "Worldwide" },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "What I Do", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Publications", href: "#publications" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES = [
  {
    number: "01",
    name: "Main Service",
    description:
      "Helping clients solve their primary business or product challenge.",
  },
  {
    number: "02",
    name: "Secondary Service",
    description:
      "Additional expertise that complements the main service.",
  },
  {
    number: "03",
    name: "Strategy & Consulting",
    description:
      "Research, strategy, audits and professional guidance.",
  },
  {
    number: "04",
    name: "Custom Projects",
    description:
      "Tailored solutions for unique client requirements.",
  },
];

export const SKILLS = [
  "Python",
  "LangChain",
  "Ollama",
  "PyTorch",
  "FastAPI",
  "React",
  "Docker",
  "Git",
];

export const EXPERIENCES = [
  {
    role: "Research and AI Developer",
    company: "Amakh Technologies",
    location: "Hyderabad, India",
    period: "Sep 2025 – Present",
    type: "Full-time",
    description:
      "Leading real-time ML inference architecture, edge computer vision deployments, and engineering standardization across client projects.",
    highlights: [
      "Architected and shipped 50+ production-grade AI/ML pipelines using Python, PyTorch, and TensorFlow, cutting failure rates through strict dataset curation and model tuning.",
      "Engineered automated, low-latency computer vision pipelines sustaining 30+ FPS for mission-critical client deployments.",
      "Directed end-to-end evaluation cycles, executing root-cause failure mode analysis and dataset refinements under physical hardware constraints.",
      "Mentored junior engineering contributors across 50+ project lifecycles, establishing modular code patterns and standardized validation workflows.",
    ],
    skills: ["Python", "PyTorch", "TensorFlow", "OpenCV", "Low-Latency Vision", "Failure Mode Analysis"],
  },
  {
    role: "Data Science Intern",
    company: "StageZero Technologies",
    location: "Helsinki, Finland (Remote)",
    period: "May 2023 – Oct 2023",
    type: "Internship",
    description:
      "Automated ML/NLP data preparation pipelines and collaborated with cross-functional product teams on research publication delivery.",
    highlights: [
      "Automated ML and NLP workflows across 10+ operational processes, boosting data annotation and prep efficiency by 25%.",
      "Collaborated directly with engineering and product squads to restructure delivery milestones, accelerating timelines by 15%.",
      "Synthesized complex model telemetry into accessible stakeholder insights, co-authoring 4+ research publications that increased platform visibility by 30%.",
    ],
    skills: ["Python", "NLP Pipelines", "Data Annotation", "Stakeholder Communication", "Research"],
  },
];

export const PROJECTS = [
  {
    slug: "tripify-ai-travel-planner",
    number: "01",
    name: "Tripify: Smart AI Travel Planner",
    client: "Full-Stack AI Project",
    category: "Generative AI & Geospatial",
    year: "2026",
    col1: [
      // Secondary: Route mapping & city travel exploration
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    ],
    // Main Hero: Digital navigation & interactive map dashboard
    col2: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Planning custom multi-day travel itineraries often leads to hallucinations in LLMs, unrealistic travel distances, and lack of verified localized attractions.",
    myRole:
      "Full-Stack AI Developer — architected the RAG retrieval pipeline, asynchronous FastAPI backend, stateful chat workflows, and the React Leaflet dashboard.",
    solution:
      "Engineered an offline-capable agentic planner pairing local Llama 3.2 (via Ollama) with live OpenTripMap geospatial data. Integrated Leaflet interactive routing, Chart.js budget breakdowns, and SQLite persistence for iterative conversational modifications.",
    results: [
      { value: "0", label: "POI Hallucinations" },
      { value: "100%", label: "Local / Offline Inference" },
      { value: "< 2.5s", label: "End-to-End Generation" },
      { value: "94%", label: "Itinerary Acceptance Rate" },
      { value: "$0", label: "Cloud API Token Overhead" },
      { value: "50+ ms", label: "Geospatial Spatial Query" },
    ],
    techStack: [
      "FastAPI",
      "LangChain",
      "Llama 3.2 (Ollama)",
      "React 18",
      "Leaflet",
      "Chart.js",
      "SQLite",
      "Tailwind CSS",
    ],
  },
  {
    slug: "autonomous-mobile-robot",
    number: "02",
    name: "Autonomous Mobile Robot (AMR)",
    client: "Edge AI & Robotics Research",
    category: "Personal Project",
    year: "2026",
    col1: [
      // Secondary: Edge microprocessor board & robotics chassis assembly
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    ],
    // Main Hero: Autonomous hardware & embedded testing platform
    col2: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Executing real-time human detection and closed-loop obstacle avoidance under strict edge compute constraints, thermal limits, and sensor occlusions on physical mobile hardware.",
    myRole:
      "Robotics & Edge AI Developer — architected the quantized computer vision pipeline, wrote low-level PWM motor control firmware, and designed deterministic rule-based safety fallbacks.",
    solution:
      "Engineered an autonomous 4WD mobile robot powered by a Raspberry Pi 5. Quantized a custom YOLOv8n model via Tencent NCNN FP16 to sustain low-latency inference on ARM CPUs, paired with closed-loop PWM control and interrupt-driven collision avoidance.",
    results: [
      { value: "90%", label: "Tracking Precision" },
      { value: "92%", label: "Obstacle Avoidance" },
      { value: "18 FPS", label: "Edge Inference Rate" },
      { value: "3–7 kg", label: "Payload Capacity" },
      { value: "61 ms", label: "End-to-End Latency" },
      { value: "ICAMMAE", label: "Research Publication" },
    ],
    techStack: [
      "Python",
      "C++",
      "Raspberry Pi 5",
      "YOLOv8n",
      "Tencent NCNN",
      "OpenCV",
      "PWM Motor Control",
      "Edge Computing",
    ],
  },
  {
    slug: "explainable-ai-placement-prediction",
    number: "03",
    name: "DocuWise: Explainable AI (XAI) Placement Engine",
    client: "Amakh Innovating Tomorrow",
    category: "Explainable AI (XAI) & Predictive Analytics",
    year: "2025",
    col1: [
      // Secondary: Feature attribution charts & machine learning telemetry
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
    ],
    // Main Hero: Analytics dashboard & prescriptive decision engine
    col2: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Conventional placement classifiers operate as opaque 'black boxes'—they output raw binary odds without explaining underlying feature attributions or prescribing actionable recovery pathways for at-risk candidates.",
    myRole:
      "Lead ML Developer — built the automated multi-model training pipeline, engineered cooperative game-theory interpretability layers (SHAP & LIME), and authored the automated gap-analysis roadmap engine.",
    solution:
      "Developed an end-to-end framework evaluating SVM, XGBoost, and Random Forest models. Integrated SHAP KernelExplainers for global/local Shapley values and LIME for local surrogate decision boundaries, feeding into an automated 90-day upskilling roadmap generator.",
    results: [
      { value: "100%", label: "Interpretable Decisions (XAI)" },
      { value: "4 Models", label: "Automated Benchmarking" },
      { value: "SHAP + LIME", label: "Dual Explainer Framework" },
      { value: "90-Day", label: "Actionable Upskilling Roadmaps" },
      { value: "< 150ms", label: "Attribution Inference Latency" },
      { value: "5 Profiles", label: "Domain Career Pathways" },
    ],
    techStack: [
      "Python 3.10+",
      "Scikit-Learn",
      "XGBoost",
      "SHAP",
      "LIME",
      "Flask",
      "Chart.js",
      "Glassmorphic UI",
    ],
  },

  {
    slug: "vanguard-ai-wildlife-protection",
    number: "04",
    name: "Vanguard AI: Wildlife Poaching & Intrusion Detection",
    client: "Conservation AI & Edge Vision",
    category: "Edge Computer Vision & Real-Time Alerting",
    year: "2024",
    col1: [
      // Secondary: Wildlife habitat camera trap & edge vision telemetry
      "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    ],
    // Main Hero: Night surveillance & thermal computer vision tracking
    col2: "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?auto=format&fit=crop&w=1200&q=80",
    challenge:
      "Detecting armed intruders, weapons, and unauthorized vehicles in dense, low-visibility wildlife habitats while avoiding false positives on native fauna and maintaining millisecond edge latency.",
    myRole:
      "Computer Vision & Edge Systems Engineer — trained the fine-grained custom detection model, built the automated FP16 CUDA inference pipeline, and implemented the webhook dispatch architecture.",
    solution:
      "Fine-tuned a YOLOv8 architecture across 72 discrete threat and wildlife classes utilizing FP16 Automatic Mixed Precision (AMP) on CUDA. Integrated an automated Discord alerting dispatcher with cooldown throttling, SQLite forensic logging, and an interactive cyber-agritech Streamlit dashboard.",
    results: [
      { value: "4.6 ms", label: "Inference Latency (RTX 2050)" },
      { value: "72 Classes", label: "Fine-Grained Target Ontology" },
      { value: "100%", label: "Automated Incident Dispatch" },
      { value: "FP16 AMP", label: "Precision CUDA Acceleration" },
      { value: "3 Modes", label: "Image, Video & Live Stream" },
      { value: "0 Loss", label: "Forensic Evidence Logging" },
    ],
    techStack: [
      "Python 3.10+",
      "YOLOv8 (Ultralytics)",
      "PyTorch (CUDA 12.7)",
      "Streamlit",
      "Discord Webhooks",
      "OpenCV",
      "SQLite",
      "Plotly",
    ],
  },
];

// The final "selling" card in Selected Work — edit text / button freely.
export const WORK_CTA = {
  cta: true,
  number: "Its Your Turn",
  title: "Let's Build Yours",
  subline: "Your project could be here next. Let's create something people remember.",
  buttonLabel: "Contact Me",
  buttonHref: "#contact",
};

export const TESTIMONIALS = [
  {
    quote:
      "Exceptional communication and problem-solving skills. She is a disciplined, invaluable asset to our team.",
    name: "Sayed Abdul Khadir",
    role: "Founder & Director, Amakh Innovating Tomorrow pvt. Ltd.",
  },
  {
    quote:
      "Sana has a sharp understanding of complex algorithms and a deep expertise in AI/ML, particularly in LLMs and NLP. She is fantastic at translating that theory into real-world applications.",
    name: "Abdul Muthalib",
    role: "Project Manager, StageZero Technologies",
  },
  {
    quote:
      "From zero to one: Sana bridged our early concepts into a reliable, beautifully executed architecture that delivered real end-user value from day one.",
    name: "Student Mentee",
    role: "Amakh Innovating Tomorrow pvt. Ltd.",
  },
];

export const PUBLICATIONS = [
  {
    title: "Design and Development of an Autonomous Human-Following Mobile Robot",
    conference: "International Conference on Advances in Mechanical, Materials and Automotive Engineering (ICAMMAE)",
    year: "2026",
    role: "Co-Author & Lead AI/Robotics Researcher",
    badge: "Peer-Reviewed Conference",
    abstract:
      "Investigates edge-quantized vision pipelines and deterministic closed-loop PWM control algorithms for 4WD mobile platforms using YOLOv8n and Tencent NCNN FP16 on Raspberry Pi hardware.",
    topics: ["Robotics", "Edge AI", "NCNN Quantization", "YOLOv8", "Computer Vision"],
    link: "https://doi.org/", // Replace with actual DOI or paper link if available
  },
  {
    title: "Medibuddy - A Healthcare Chatbot using AI",
    conference: "International Research Journal / Conference Proceedings",
    year: "2024",
    role: "Lead Author",
    badge: "Published Paper",
    abstract:
      "Presents an conversational NLP architecture designed for preliminary clinical inquiry triage, patient intent parsing, and contextual health guidance.",
    topics: ["Natural Language Processing", "Conversational AI", "Healthcare Tech"],
    link: "https://doi.org/", // Replace with actual link if available
  },
];

export const SOCIALS = [
  { label: "Email", href: "mailto:sanabadagan@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sanabadagan" },
  { label: "GitHub", href: "https://github.com/sana-commits-here" },
  
];