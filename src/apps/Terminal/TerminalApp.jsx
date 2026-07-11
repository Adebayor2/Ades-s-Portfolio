import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { fetchProjects } from '../../api/projects';

// ─── Helpers ──────────────────────────────────────────────
const COMMANDS = ['help', 'whoami', 'projects', 'skills', 'contact', 'social', 'clear', 'exit', 'open'];
const OPEN_TARGETS = ['projects', 'about', 'skills', 'contact', 'terminal'];

const COLORS = {
  green:  'text-green-400',
  red:    'text-red-400',
  yellow: 'text-yellow-300',
  blue:   'text-[#00A4EF]',
  gray:   'text-gray-500',
  white:  'text-gray-100',
  cyan:   'text-cyan-400',
  purple: 'text-purple-400',
};

// Line builder helper
const line = (text, color = 'white', bold = false) => ({ text, color, bold });
const blank = () => line('');

// ─── Boot message (rendered char by char) ─────────────────
const BOOT_LINES = [
  { text: '██╗   ██╗ ██████╗ ██╗   ██╗██████╗ ███████╗    ██████╗ ███████╗',  color: 'blue' },
  { text: '╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗██╔════╝   ██╔═══██╗╚════██║',  color: 'blue' },
  { text: ' ╚████╔╝ ██║   ██║██║   ██║██████╔╝███████╗   ██║   ██║    ██╔╝',  color: 'blue' },
  { text: '  ╚██╔╝  ██║   ██║██║   ██║██╔══██╗╚════██║   ██║   ██║   ██╔╝',   color: 'blue' },
  { text: '   ██║   ╚██████╔╝╚██████╔╝██║  ██║███████║██╗╚██████╔╝   ██║',    color: 'blue' },
  { text: '   ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝ ╚═════╝   ╚═╝',   color: 'blue' },
  blank(),
  { text: 'AdeXOS v1.0.0 — Portfolio Terminal', color: 'cyan', bold: true },
  { text: 'Type "help" to see available commands.', color: 'gray' },
  blank(),
];

// ─── Command Handlers ─────────────────────────────────────
const HELP_OUTPUT = [
  line('Available commands:', 'cyan', true),
  blank(),
  { text: '  help              ', color: 'green', suffix: '— List all commands', suffixColor: 'gray' },
  { text: '  whoami            ', color: 'green', suffix: '— About me', suffixColor: 'gray' },
  { text: '  projects          ', color: 'green', suffix: '— List all projects', suffixColor: 'gray' },
  { text: '  projects --featured', color: 'green', suffix: '— Featured projects only', suffixColor: 'gray' },
  { text: '  skills            ', color: 'green', suffix: '— View skill tree', suffixColor: 'gray' },
  { text: '  contact           ', color: 'green', suffix: '— Contact information', suffixColor: 'gray' },
  { text: '  social            ', color: 'green', suffix: '— Social media links', suffixColor: 'gray' },
  { text: '  open <app>        ', color: 'green', suffix: '— Open an app window', suffixColor: 'gray' },
  { text: '  clear             ', color: 'green', suffix: '— Clear the terminal', suffixColor: 'gray' },
  { text: '  exit              ', color: 'green', suffix: '— Close the terminal', suffixColor: 'gray' },
  blank(),
];

const WHOAMI_OUTPUT = [
  line('┌─────────────────────────────────────┐', 'blue'),
  line('│           About the Developer        │', 'blue'),
  line('└─────────────────────────────────────┘', 'blue'),
  blank(),
  { text: '  Name     : ', color: 'yellow', suffix: 'Adeniran Adebayo', suffixColor: 'white' },
  { text: '  Role     : ', color: 'yellow', suffix: 'Full Stack Developer', suffixColor: 'white' },
  { text: '  Location : ', color: 'yellow', suffix: 'Lagos, Nigeria 🇳🇬', suffixColor: 'white' },
  { text: '  Stack    : ', color: 'yellow', suffix: 'React · Nextjs · Node.js · MongoDB · Express', suffixColor: 'white' },
  { text: '  Status   : ', color: 'yellow', suffix: '✅ Open to work', suffixColor: 'green' },
  blank(),
];

const SKILLS_OUTPUT = [
  line('Skill Tree', 'cyan', true),
  blank(),
  line('Frontend', 'yellow', true),
  line('  ├─ React          ████████████████████ 90%', 'green'),
  line('  ├─ JavaScript     ████████████████████ 95%', 'green'),
  line('  ├─ TypeScript     ███████████████░░░░░ 75%', 'green'),
  line('  ├─ Tailwind CSS   ████████████████████ 90%', 'green'),
  line('  └─ Next.js        ██████████████░░░░░░ 70%', 'green'),
  blank(),
  line('Backend', 'yellow', true),
  line('  ├─ Node.js        █████████████████░░░ 85%', 'cyan'),
  line('  ├─ Express.js     █████████████████░░░ 88%', 'cyan'),
  line('  ├─ MongoDB        ████████████████░░░░ 80%', 'cyan'),
  line('  └─ REST APIs      ████████████████████ 90%', 'cyan'),
  line('  └─ GraphQL APIs   █████████████████░░░ 85%', 'cyan'),

  blank(),
  line('DevOps & Tools', 'yellow', true),
  line('  ├─ Git/GitHub     ████████████████████ 90%', 'purple'),
  line('  ├─ Docker         █████████████░░░░░░░ 65%', 'purple'),
  line('  └─ Linux CLI      ███████████████░░░░░ 75%', 'purple'),
  blank(),
];

const CONTACT_OUTPUT = [
  line('Contact Information', 'cyan', true),
  blank(),
  { text: '  📧 Email    : ', color: 'yellow', suffix: 'hello@example.com', suffixColor: 'white' },
  { text: '  📍 Location : ', color: 'yellow', suffix: 'Lagos, Nigeria', suffixColor: 'white' },
  { text: '  🕐 Timezone : ', color: 'yellow', suffix: 'WAT (UTC+1)', suffixColor: 'white' },
  { text: '  💼 Status   : ', color: 'yellow', suffix: 'Available for hire', suffixColor: 'green' },
  blank(),
  line('  Or use the Contact app: type "open contact"', 'gray'),
  blank(),
];

const SOCIAL_OUTPUT = [
  line('Social & Links', 'cyan', true),
  blank(),
  { text: '  🐙 GitHub   : ', color: 'yellow', suffix: 'https://github.com/Adebayo2', suffixColor: 'blue' },
  { text: '  💼 LinkedIn : ', color: 'yellow', suffix: 'https://linkedin.com/in/yourusername', suffixColor: 'blue' },
  { text: '  🐦 Twitter  : ', color: 'yellow', suffix: 'https://twitter.com/yourusername', suffixColor: 'blue' },
  { text: '  🌐 Portfolio: ', color: 'yellow', suffix: 'https://yourportfolio.dev', suffixColor: 'blue' },
  blank(),
];

// ─── Line Renderer ────────────────────────────────────────
const Line = ({ lineData }) => {
  if (!lineData) return <div className="h-4" />;
  const { text, color = 'white', bold = false, suffix, suffixColor } = lineData;
  return (
    <div className={`leading-6 font-mono whitespace-pre ${bold ? 'font-bold' : ''} ${COLORS[color] || 'text-gray-100'}`}>
      {text}
      {suffix && <span className={COLORS[suffixColor] || 'text-gray-100'}>{suffix}</span>}
    </div>
  );
};

// ─── Main Terminal ────────────────────────────────────────
const TerminalApp = () => {
  const { openWindow, closeWindow, windows } = useStore();
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bootIndex, setBootIndex] = useState(0);
  const booted = bootIndex >= BOOT_LINES.length;
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // ── Boot animation ──────────────────────────────────────
  useEffect(() => {
    if (bootIndex < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, BOOT_LINES[bootIndex]]);
        setBootIndex(i => i + 1);
      }, bootIndex < 6 ? 40 : 120);
      return () => clearTimeout(timer);
    }
  }, [bootIndex]);

  // ── Scroll to bottom on new output ─────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // ── Focus input on click ────────────────────────────────
  const focusInput = () => inputRef.current?.focus();

  // ── Print lines helper ──────────────────────────────────
  const print = useCallback((newLines) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  // ── Process command ─────────────────────────────────────
  const processCommand = useCallback(async (cmd) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(/\s+/);
    const base = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    // Echo the typed command
    print([{ text: `guest@portfolio:~$ ${trimmed}`, color: 'white' }]);

    if (!trimmed) { print([blank()]); return; }

    switch (base) {
      case 'help':
        print(HELP_OUTPUT);
        break;

      case 'whoami':
        print(WHOAMI_OUTPUT);
        break;

      case 'skills':
        print(SKILLS_OUTPUT);
        break;

      case 'contact':
        print(CONTACT_OUTPUT);
        break;

      case 'social':
        print(SOCIAL_OUTPUT);
        break;

      case 'clear':
        setLines([]);
        break;

      case 'exit': {
        const terminalWindow = windows.find(w => w.component === 'TerminalApp');
        if (terminalWindow) closeWindow(terminalWindow.id);
        break;
      }

      case 'open': {
        const target = args[0]?.toLowerCase();
        const appMap = {
          projects: 'projects',
          about: 'about',
          skills: 'skills',
          contact: 'contact',
          terminal: 'terminal',
        };
        if (!target) {
          print([line('Usage: open <appname>  (e.g. open projects)', 'red')]);
        } else if (appMap[target]) {
          print([line(`Opening ${target}...`, 'green')]);
          openWindow(appMap[target]);
        } else {
          print([
            line(`Cannot open "${target}". Available: ${OPEN_TARGETS.join(', ')}`, 'red'),
          ]);
        }
        print([blank()]);
        break;
      }

      case 'projects': {
        const featured = args.includes('--featured');
        print([line(`Fetching ${featured ? 'featured ' : ''}projects...`, 'yellow')]);
        try {
          const data = await fetchProjects({ sort: featured ? 'featured' : undefined });
          const filtered = featured ? data.filter(p => p.featured) : data;

          if (filtered.length === 0) {
            print([line('No projects found.', 'red'), blank()]);
            break;
          }

          print([
            blank(),
            line(`Found ${filtered.length} project${filtered.length !== 1 ? 's' : ''}:`, 'cyan', true),
            blank(),
          ]);
          filtered.forEach((p, i) => {
            print([
              { text: `  ${i + 1}. `, color: 'yellow', suffix: p.title, suffixColor: 'white', bold: true },
              { text: `     Stack : `, color: 'gray', suffix: p.techStack?.join(', ') || 'N/A', suffixColor: 'green' },
              { text: `     Repo  : `, color: 'gray', suffix: p.githubUrl || 'Private', suffixColor: 'blue' },
              p.featured ? { text: '     ⭐ Featured', color: 'yellow' } : blank(),
              blank(),
            ]);
          });
        } catch {
          print([
            line('Error: Could not fetch projects. Is the backend running?', 'red'),
            blank(),
          ]);
        }
        break;
      }

      default:
        print([
          line(`Command not found: "${trimmed}". Type 'help' for available commands.`, 'red'),
          blank(),
        ]);
    }

    if (base !== 'clear') print([blank()]);
  }, [closeWindow, openWindow, print, windows]);

  // ── Handle key events ───────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input;
      setHistory(h => cmd.trim() ? [cmd, ...h] : h);
      setHistoryIndex(-1);
      setInput('');
      processCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? '' : history[newIndex] ?? '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Autocomplete
      const parts = input.split(/\s+/);
      if (parts.length === 1) {
        const match = COMMANDS.find(c => c.startsWith(parts[0]) && c !== parts[0]);
        if (match) setInput(match);
      } else if (parts[0] === 'open' && parts.length === 2) {
        const match = OPEN_TARGETS.find(t => t.startsWith(parts[1]) && t !== parts[1]);
        if (match) setInput(`open ${match}`);
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-[#0C0C0C] text-gray-100 overflow-hidden cursor-text"
      onClick={focusInput}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace" }}
    >
      {/* Tab bar — like Windows Terminal */}
      <div className="flex items-center gap-0 bg-[#1a1a1a] shrink-0">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0C0C0C] border-t-2 border-[#00A4EF] text-xs text-gray-300">
          <span className="w-2 h-2 rounded-full bg-[#00A4EF]" />
          Terminal
        </div>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-1 space-y-0 select-text">
        {lines.map((l, i) => <Line key={i} lineData={l} />)}

        {/* Input line */}
        {booted && (
          <div className="flex items-center gap-0 leading-6 font-mono mt-1">
            <span className="text-green-400">guest</span>
            <span className="text-gray-500">@</span>
            <span className="text-[#00A4EF]">portfolio</span>
            <span className="text-gray-500">:~$ </span>
            <span className="relative text-gray-100">
              {input}
              <span className="inline-block w-[9px] h-[1.1em] bg-gray-300 align-bottom animate-pulse ml-px" />
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="absolute opacity-0 w-0 h-0"
              aria-label="Terminal input"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Status bar */}
      <div className="shrink-0 bg-[#00A4EF] flex items-center px-4 py-0.5 gap-4 text-[10px] text-white/90">
        <span>⚡ AdexOS v1.0.0</span>
        <span className="ml-auto">↑↓ history · Tab autocomplete · type help</span>
      </div>
    </div>
  );
};

export default TerminalApp;





