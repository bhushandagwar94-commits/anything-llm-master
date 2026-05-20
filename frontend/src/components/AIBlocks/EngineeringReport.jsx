import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, Share2, ShieldCheck, Signature } from 'lucide-react';

export default function EngineeringReport({ block }) {
  const { payload } = block;
  const { title, date, author = "SEETECH AI Intelligence Unit", sections = [] } = payload;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full my-10 animate-in fade-in zoom-in-95 duration-1000 print:my-0">
      <div className="relative p-12 rounded-[3rem] bg-white text-slate-900 shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-0 print:rounded-none">
        
        {/* Subtle Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-45deg] pointer-events-none select-none">
           <FileText size={600} />
        </div>

        {/* Action Bar (Hidden on print) */}
        <div className="flex justify-end gap-3 mb-12 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            <Printer size={16} /> Print / Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
            <Share2 size={16} /> Share
          </button>
        </div>

        {/* Document Header */}
        <div className="border-b-4 border-slate-900 pb-10 mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                <FileText className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">SEETECH AI</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 max-w-2xl">{title || "Engineering Analysis Report"}</h1>
            <p className="text-sm text-slate-500 font-medium">Reference: ST-AUDIT-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
            <p className="text-lg font-bold text-slate-900">{date || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-8 mb-16 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-600" />
             Verified by Industrial AI
           </div>
           <div>•</div>
           <div>Author: {author}</div>
           <div>•</div>
           <div className="text-blue-600">Confidential / Proprietary</div>
        </div>

        {/* Sections Content */}
        <div className="space-y-12 mb-20">
          {sections.map((section, i) => (
            <motion.section 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="relative"
            >
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">{i + 1}</span>
                {section.title}
              </h2>
              <div className="text-slate-600 leading-relaxed text-lg font-medium space-y-4 ml-11">
                 {section.content.split('\n').map((line, li) => (
                   <p key={li}>{line}</p>
                 ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Signature & Seal */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-12">
          <div className="space-y-4">
             <div className="text-slate-900 italic font-medium flex items-center gap-2 opacity-60">
               <Signature size={24} className="text-blue-600" />
               Digitally signed for authenticity
             </div>
             <div>
                <p className="text-sm font-bold text-slate-900">SEETECH Intelligence Engine</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automation & Optimization Unit</p>
             </div>
          </div>
          <div className="w-24 h-24 border-4 border-slate-900 rounded-full flex items-center justify-center p-2 opacity-10">
             <div className="border-2 border-slate-900 rounded-full w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-center rotate-[-15deg]">
               Official<br/>Audit<br/>Seal
             </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="mt-12 text-center text-[8px] font-bold text-slate-300 uppercase tracking-widest">
           SEETECH Industrial AI Operating System — © {new Date().getFullYear()} — Proprietary & Confidential
        </div>
      </div>
    </div>
  );
}
