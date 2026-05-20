import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Settings, 
  Cpu, 
  Factory, 
  Leaf, 
  Award, 
  Brain,
  PhoneCall,
  ArrowUpRight,
  X 
} from 'lucide-react';

const MODULES = [
  {
    id: "about",
    title: "About SEE-Tech",
    subtitle: "Company overview & expertise",
    icon: Building2,
    accent: "from-cyan-400 to-blue-600",
    modal: {
      tag: "OVERVIEW",
      heading: "30+ Years of Industrial Excellence",
      description: "SEE-Tech Solutions is a leading Industrial Energy Efficiency and Sustainability company specializing in intelligent utility optimization, HVAC systems, electrical systems, ESG analytics, and advanced industrial engineering solutions.",
      kpis: [
        { label: "Industry Experience", value: "30+ Years" },
        { label: "BEE ESCO Accreditation", value: "Grade-1" },
        { label: "Focus Area", value: "Energy & ESG" },
        { label: "Industrial Reach", value: "Pan-India" }
      ],
      highlights: [
        "Pioneers in Industrial Energy Audits & ESCO implementation",
        "Accredited Grade-1 ESCO by Bureau of Energy Efficiency (BEE), Ministry of Power",
        "Turnkey execution of energy conservation projects with guaranteed ROI",
        "Deep domain expertise in thermal, electrical, and mechanical utility systems"
      ],
      prompt: "Tell me about SEE-Tech Solutions, your 30+ years of industrial experience, Grade-1 BEE ESCO accreditation, and core expertise in energy efficiency and sustainability.",
      ctaLabel: "Ask AI about SEE-Tech Profile"
    }
  },
  {
    id: "solutions",
    title: "Energy Solutions",
    subtitle: "HVAC, utility & optimization",
    icon: Settings,
    accent: "from-blue-400 to-indigo-600",
    modal: {
      tag: "SOLUTIONS",
      heading: "Comprehensive Utility & HVAC Optimization",
      description: "Engineering solutions designed to eliminate utility losses, optimize thermal systems, and maximize plant operational efficiency across all major industrial utilities.",
      kpis: [
        { label: "Core Utility Systems", value: "7 Systems" },
        { label: "Typical Energy Reduction", value: "15–25%" },
        { label: "Chiller Optimization", value: "Real-time COP" },
        { label: "Steam & Boiler ROI", value: "< 12 Months" }
      ],
      highlights: [
        "HVAC & Air Distribution System Optimization",
        "Chiller Plant Efficiency & Cooling Tower Diagnostics",
        "Steam & Boiler System Performance Analysis",
        "Compressed Air System Leakage & Pressure Optimization",
        "Electrical Load & Power Factor Management",
        "Water & Wastewater System Energy Conservation"
      ],
      prompt: "Explore SEE-Tech's industrial solutions including HVAC optimization, chiller plant efficiency, utility system optimization, steam & boiler analysis, compressed air tracking, electrical load optimization, and water conservation.",
      ctaLabel: "Analyze Energy Solutions with AI"
    }
  },
  {
    id: "products",
    title: "IoT & Automation Products",
    subtitle: "Hardware & AI Software Platforms",
    icon: Cpu,
    accent: "from-emerald-400 to-cyan-600",
    modal: {
      tag: "CORE PRODUCTS",
      heading: "Integrated IoT & Automation Systems",
      description: "SeeTech Solutions delivers integrated IoT and automation systems that monitor, optimize, and control critical energy-intensive processes in real time. From ventilation and HVAC to chillers and motors, every solution is engineered to unlock measurable savings.",
      kpis: [
        { label: "SEE-EnerView", value: "Cloud EMS" },
        { label: "SEE-AirSmart", value: "AHU Control" },
        { label: "SEE-DCKV", value: "30-50% Save" },
        { label: "SEE-CondenSync", value: "Chiller AI" }
      ],
      highlights: [
        "SEE-ENERVIEW: Cloud-enabled energy monitoring & analytics platform with real-time voltage/current/power intelligence and BMS/SCADA integration.",
        "SEE-AIRSMART: Smart AHU optimization managing temperature, humidity, and airflow loops for stable comfort at minimum energy usage.",
        "SEE-DCKV: Demand Control Kitchen Ventilation dynamically adjusting exhaust/supply airflow based on live cooking activity for 30-50% savings.",
        "SEE-CONDENSYNC: Cooling tower and chiller intelligence continuously analyzing water temperatures and load demand for highest efficiency.",
        "MODBUS-MQTT GATEWAY: Industrial IoT gateway bridging legacy Modbus RTU/TCP assets to secure MQTT cloud streams.",
        "IE5 MOTOR UPGRADE: Ultra-premium motor efficiency replacing legacy IE2/IE3 motors to reduce electrical losses and heat."
      ],
      prompt: "Explore SeeTech Solutions' core IoT & Automation products: SEE-EnerView Energy Monitoring, SEE-AirSmart AHU Optimization, SEE-DCKV Kitchen Ventilation, SEE-CondenSync Cooling Optimization, Modbus-to-MQTT Gateways, and IE5 Motor Upgrades.",
      ctaLabel: "Analyze IoT Products with AI"
    }
  },
  {
    id: "industries",
    title: "Industries",
    subtitle: "Industrial sectors served",
    icon: Factory,
    accent: "from-cyan-300 to-blue-500",
    modal: {
      tag: "SECTORS",
      heading: "Transforming 500+ Industrial Facilities",
      description: "Delivering verified energy reduction, decarbonization, and operational excellence across diverse heavy industrial, pharmaceutical, and commercial sectors.",
      kpis: [
        { label: "Industrial Projects", value: "500+ Executed" },
        { label: "Sectors Covered", value: "12+ Major" },
        { label: "Client Retention", value: "95%+" },
        { label: "Custom Benchmarks", value: "Sector-specific" }
      ],
      highlights: [
        "Pharmaceutical & Bulk Drug Manufacturing Facilities",
        "Heavy Engineering, Automotive & Ancillary Plants",
        "Chemical, Petrochemical & Textile Industries",
        "Food Processing, Dairy & Beverage Manufacturing",
        "Hospitality, Healthcare & Commercial Real Estate",
        "Large-Scale Infrastructure & Data Centers"
      ],
      prompt: "Detail the industries served by SEE-Tech across 500+ industrial projects, including manufacturing, pharmaceutical, automotive, hospitality, commercial buildings, food processing, and infrastructure.",
      ctaLabel: "Examine Industry Case Studies"
    }
  },
  {
    id: "esg",
    title: "ESG & Sustainability",
    subtitle: "Carbon & efficiency programs",
    icon: Leaf,
    accent: "from-teal-400 to-emerald-600",
    modal: {
      tag: "SUSTAINABILITY",
      heading: "Strategic Decarbonization & ESG Alignment",
      description: "Empowering enterprises to meet global decarbonization mandates, achieve Net-Zero targets, and streamline sustainability reporting through verified energy efficiency.",
      kpis: [
        { label: "Compliance Standard", value: "ISO 50001" },
        { label: "Carbon Abatement", value: "Scope 1 & 2" },
        { label: "ESG Reporting", value: "BRSR / GRI" },
        { label: "Green Building", value: "IGBC / LEED" }
      ],
      highlights: [
        "End-to-End Carbon Footprint Assessment & Reduction Roadmaps",
        "ISO 50001 Energy Management System Implementation & Audits",
        "BRSR, GRI, and CDP Alignment for Enterprise ESG Reporting",
        "Renewable Energy Feasibility & Solar PV Integration",
        "Green Building Facilitation & Energy Conservation Code Compliance"
      ],
      prompt: "View SEE-Tech's Sustainability & ESG programs, carbon reduction strategies, ESG reporting, energy conservation, sustainable operations, green building support, and ISO 50001 alignment.",
      ctaLabel: "Discuss ESG Strategy with AI"
    }
  },
  {
    id: "achievements",
    title: "Achievements",
    subtitle: "Savings, impact & projects",
    icon: Award,
    accent: "from-amber-400 to-orange-600",
    modal: {
      tag: "IMPACT",
      heading: "Massive Verified Financial & Energy Savings",
      description: "A proven, audited track record of delivering extraordinary financial returns and environmental impact across India's leading industrial conglomerates.",
      kpis: [
        { label: "Total Energy Savings", value: "₹100+ Crore" },
        { label: "Electricity Saved", value: "5 Crore+ kWh" },
        { label: "Thermal Savings", value: "10,000+ MT" },
        { label: "Carbon Offset", value: "40,000+ tCO2" }
      ],
      highlights: [
        "Over ₹100 Crore in cumulative verified energy cost savings delivered to clients",
        "More than 5 Crore kWh of electrical energy conserved through system optimization",
        "Consistent 20% to 30% reduction in specific energy consumption across baseline audits",
        "Multiple national energy conservation awards won by client facilities post-implementation"
      ],
      prompt: "Highlight SEE-Tech's major achievements: ₹100+ Cr energy savings, 5Cr+ kWh saved, 20-30% typical energy reduction, and large-scale industrial deployments.",
      ctaLabel: "Review Impact Metrics with AI"
    }
  },
  {
    id: "ai",
    title: "AI Intelligence",
    subtitle: "Predictive engineering AI",
    icon: Brain,
    accent: "from-blue-500 to-cyan-400",
    modal: {
      tag: "AI COPILOT",
      heading: "Next-Generation Industrial Intelligence Copilot",
      description: "Harnessing advanced artificial intelligence and machine learning to provide predictive plant diagnostics, automated engineering recommendations, and real-time operational copilot analysis.",
      kpis: [
        { label: "AI Engine", value: "Predictive ML" },
        { label: "Anomaly Detection", value: "Automated" },
        { label: "Optimization Advice", value: "Real-Time" },
        { label: "SCADA Integration", value: "Seamless" }
      ],
      highlights: [
        "Predictive Diagnostics & Early Anomaly Detection for Critical Rotary Equipment",
        "AI Engineering Copilot for Instant Troubleshooting & Operating Parameter Guidance",
        "Automated Specific Energy Consumption (SEC) & COP Optimization Advice",
        "Interactive Plant Performance Dashboards with Natural Language Querying"
      ],
      prompt: "Launch AI Industrial Intelligence for predictive diagnostics, AI engineering copilot capabilities, operational intelligence, industrial dashboards, automated recommendations, and smart plant optimization.",
      ctaLabel: "Launch AI Intelligence Copilot"
    }
  },
  {
    id: "contact",
    title: "Contact & Support",
    subtitle: "Connect with SEE-Tech",
    icon: PhoneCall,
    accent: "from-purple-400 to-pink-600",
    modal: {
      tag: "SUPPORT",
      heading: "Connect with SEE-Tech Solutions",
      description: "Get in touch with our expert energy auditors, industrial engineers, and sustainability specialists to initiate an assessment of your facility.",
      kpis: [
        { label: "Headquarters", value: "Pune, India" },
        { label: "Support Channels", value: "24/7 Dedicated" },
        { label: "Initial Assessment", value: "Comprehensive" },
        { label: "Expert Engineers", value: "BEE Certified" }
      ],
      highlights: [
        "Corporate Office: SEE-Tech Solutions Pvt. Ltd., Pune, Maharashtra, India",
        "Dedicated Engineering Support & Remote Monitoring Helpdesk",
        "Schedule a Preliminary Energy Audit or AI Platform Demonstration",
        "Collaborate with BEE Certified Energy Auditors & Turnkey Project Managers"
      ],
      prompt: "How can I contact SEE-Tech Solutions for an industrial energy audit, AI platform demonstration, or expert engineering support?",
      ctaLabel: "Get Contact Details via AI"
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function MenuCards({ sendCommand }) {
  const [activeModal, setActiveModal] = useState(null);

  const handleCardClick = (promptText) => {
    if (typeof sendCommand === 'function') {
      try {
        sendCommand(promptText);
      } catch (e) {
        console.error("Error sending command:", e);
      }
    }
  };

  return (
    <div className="w-full mt-2 mb-16 px-4 md:px-8 max-w-7xl mx-auto font-sans select-none">

      {/* Minimal Grid Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
      >
        {MODULES.map((module, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModal(module)}
            className={`group relative flex flex-col justify-between p-4 rounded-2xl transition-all duration-300 text-left cursor-pointer border overflow-hidden h-[130px] w-full max-w-[260px] mx-auto shadow-lg
              bg-[#0a1223]/65 light:bg-white
              border-white/10 light:border-slate-200
              hover:border-cyan-500/50 light:hover:border-blue-500/50
              hover:shadow-[0_8px_24px_rgba(6,182,212,0.15)] light:hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)]
              light:shadow-[0_2px_8px_rgba(15,23,42,0.04)]
            `}
          >
            {/* Soft blue glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Top row: Icon & Small Arrow */}
            <div className="flex items-center justify-between w-full z-10">
              <div className="p-2.5 rounded-xl bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <module.icon className="w-5 h-5 text-cyan-400 light:text-blue-600" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 light:text-slate-400 group-hover:text-cyan-400 light:group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </div>

            {/* Bottom row: Title & Subtitle */}
            <div className="mt-auto z-10">
              <h4 className="text-sm font-semibold text-white light:text-slate-900 group-hover:text-cyan-400 light:group-hover:text-blue-600 transition-colors tracking-tight truncate">
                {module.title}
              </h4>
              <p className="text-[11px] text-white/50 light:text-slate-500 truncate mt-0.5 font-normal">
                {module.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 light:bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-2xl rounded-[28px] bg-[#0b1329] light:bg-white border border-cyan-500/30 light:border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.5)] light:shadow-[0_20px_60px_rgba(15,23,42,0.15)] overflow-hidden my-8 font-sans"
            >
              {/* Top Glow Accent */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${activeModal.accent}`} />

              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/10 light:border-slate-100 flex items-start justify-between gap-4 bg-white/[0.02] light:bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/5 light:bg-white border border-white/10 light:border-slate-200 shadow-sm">
                    <activeModal.icon className="w-7 h-7 text-cyan-400 light:text-blue-600" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 light:bg-blue-500/10 text-cyan-400 light:text-blue-600 border border-cyan-500/20 light:border-blue-500/20 mb-1.5 shadow-sm">
                      {activeModal.modal.tag}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white light:text-slate-900 tracking-tight leading-tight">
                      {activeModal.modal.heading}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 text-white/60 light:text-slate-500 hover:text-white light:hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scroll">
                {/* Description */}
                <p className="text-sm md:text-base text-white/70 light:text-slate-600 leading-relaxed font-normal">
                  {activeModal.modal.description}
                </p>

                {/* KPIs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activeModal.modal.kpis.map((kpi, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 light:bg-slate-50 border border-white/5 light:border-slate-200 shadow-sm">
                      <div className="text-lg font-extrabold text-cyan-400 light:text-blue-600 tracking-tight truncate">
                        {kpi.value}
                      </div>
                      <div className="text-[11px] text-white/50 light:text-slate-500 uppercase font-semibold tracking-wider mt-1 truncate">
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 light:text-slate-400 font-mono">
                    Key Capabilities & Highlights
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeModal.modal.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] light:bg-slate-50 border border-white/5 light:border-slate-100 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 light:bg-blue-600 mt-2 shrink-0 animate-pulse" />
                        <span className="text-xs md:text-sm text-white/80 light:text-slate-700 leading-relaxed font-medium">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-6 md:p-8 border-t border-white/10 light:border-slate-100 flex items-center justify-between gap-4 bg-white/[0.02] light:bg-slate-50/50">
                <div className="text-[11px] text-white/40 light:text-slate-500 hidden sm:block font-mono uppercase tracking-wider">
                  SYSTEM ID: SEE.{activeModal.id.toUpperCase()}
                </div>
                <button
                  onClick={() => {
                    const promptText = activeModal.modal.prompt;
                    setActiveModal(null);
                    handleCardClick(promptText);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 light:bg-blue-600 light:hover:bg-blue-700 text-slate-950 light:text-white font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/25 light:hover:shadow-blue-500/25 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                  <span>{activeModal.modal.ctaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
