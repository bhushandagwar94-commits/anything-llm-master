import { encode as HTMLEncode } from "he";
import markdownIt from "markdown-it";
import markdownItKatexPlugin from "./plugins/markdown-katex";
import Appearance from "@/models/appearance";
import hljs from "highlight.js";
import "./themes/github-dark.css";
import "./themes/github.css";
import { v4 } from "uuid";

// Register custom lanaguages
import hljsDefineSvelte from "./hljs-libraries/svelte";
hljs.registerLanguage("svelte", hljsDefineSvelte);

const markdown = markdownIt({
  html: false, // Strictly disable HTML injection to comply with CSP and prevent XSS.
  typographer: true,
  highlight: function (code, lang) {
    const uuid = v4();
    const theme =
      window.localStorage.getItem("theme") === "light"
        ? "github"
        : "github-dark";

    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<div class="w-full hljs ${theme} border border-white/5 light:border-black/5 rounded-xl overflow-hidden my-6 transition-all duration-300 shadow-lg">
            <div class="flex items-center justify-between px-4 py-2 bg-white/5 light:bg-black/5 backdrop-blur-md border-b border-white/5 light:border-black/5">
              <code class="text-[10px] font-bold uppercase tracking-widest text-white/40 light:text-black/40">${lang}</code>
              <button data-code-snippet data-code="code-${uuid}" class="flex items-center gap-x-1.5 text-white/40 light:text-black/40 hover:text-white light:hover:text-black transition-colors">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <span class="text-[10px] font-bold uppercase tracking-wider">Copy</span>
              </button>
            </div>
            <pre class="px-4 py-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-200"><code>` +
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
          "</code></pre></div>"
        );
      } catch {}
    }

    return (
      `<div class="w-full hljs ${theme} border border-white/5 light:border-black/5 rounded-xl overflow-hidden my-6 transition-all duration-300 shadow-lg">
        <div class="flex items-center justify-between px-4 py-2 bg-white/5 light:bg-black/5 backdrop-blur-md border-b border-white/5 light:border-black/5">
          <code class="text-[10px] font-bold uppercase tracking-widest text-white/40 light:text-black/40">text</code>
          <button data-code-snippet data-code="code-${uuid}" class="flex items-center gap-x-1.5 text-white/40 light:text-black/40 hover:text-white light:hover:text-black transition-colors">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            <span class="text-[10px] font-bold uppercase tracking-wider">Copy</span>
          </button>
        </div>
        <pre class="px-4 py-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-200"><code>` +
      HTMLEncode(code) +
      "</code></pre></div>"
    );
  },
});

// Add custom renderer for strong tags to handle theme colors
markdown.renderer.rules.strong_open = () => '<strong class="text-white light:text-slate-900 font-bold">';
markdown.renderer.rules.strong_close = () => "</strong>";
markdown.renderer.rules.link_open = (tokens, idx) => {
  const token = tokens[idx];
  const href = token.attrs.find((attr) => attr[0] === "href");
  return `<a href="${HTMLEncode(href[1])}" target="_blank" rel="noopener noreferrer" class="text-green-400 light:text-green-600 underline underline-offset-4 hover:opacity-80 transition-opacity">`;
};

// Custom renderer for responsive images rendered in markdown
markdown.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex("src");
  const src = token.attrs[srcIndex][1];
  const alt = token.content || "";

  return `<div class="w-full my-8 rounded-2xl overflow-hidden shadow-2xl border border-white/5"><img src="${HTMLEncode(src)}" alt="${HTMLEncode(alt)}" class="w-full h-auto" /></div>`;
};

markdown.use(markdownItKatexPlugin);

export default function renderMarkdown(text = "") {
  return markdown.render(text);
}
