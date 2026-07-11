import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader, GitBranch, Link2, MessageCircle } from 'lucide-react';
import { sendContactMessage } from '../../api/contact';

// ─── Toast ────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: 60, x: '-50%' }}
    className={`fixed bottom-16 left-1/2 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium
      ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
  >
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-xs">✕</button>
  </motion.div>
);

const ContactApp = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [toast, setToast]   = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('loading');
    try {
      await sendContactMessage(form);

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      showToast("Message sent! I'll get back to you soon ✓", 'success');
    } catch (err) {
      setStatus('error');
      showToast(err.message || 'Failed to send message. Try again.', 'error');
    } finally {
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-full overflow-hidden text-sm bg-white dark:bg-[#202020]">

      {/* ── Left / Top Panel: Contact Info ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="
          shrink-0 bg-[#0078d4] flex flex-col py-5 px-5 overflow-y-auto
          /* mobile: horizontal strip at top */
          w-full sm:w-52
        "
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-5 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl mb-2 shadow-lg">
            👨‍💻
          </div>
          <h2 className="text-white font-semibold text-sm">Adeniran Adebayo</h2>
          <p className="text-blue-200 text-xs">Full Stack Developer</p>
        </div>

        {/* Info rows — horizontal on mobile, vertical on desktop */}
        <div className="flex flex-row sm:flex-col flex-wrap gap-x-6 gap-y-4 sm:space-y-5 flex-1 justify-center sm:justify-start">
          {[
            { icon: Mail,   label: 'Email',        value: 'adeniranadebayo27@gmail.com', href: 'adeniranadebayo27@gmail.com' },
            { icon: MapPin, label: 'Location',      value: 'Lagos, Nigeria',    href: null },
            { icon: Clock,  label: 'Availability',  value: 'Open to work',      href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={13} className="text-blue-200 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-blue-300 font-semibold uppercase tracking-widest">{label}</p>
                {href
                  ? <a href={href} className="text-xs text-white hover:text-blue-200 transition-colors">{value}</a>
                  : <p className="text-xs text-white">{value}</p>}
              </div>
            </div>
          ))}

          {/* Availability badge */}
          <div className="bg-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 self-start">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-xs text-white whitespace-nowrap">Available for hire</span>
          </div>
        </div>

        {/* Social links */}
        <div className="flex gap-3 mt-5 sm:mt-8 justify-center">
          {[
            { icon: GitBranch,    href: 'https://github.com' },
            { icon: Link2,        href: 'https://linkedin.com' },
            { icon: MessageCircle, href: 'https://twitter.com' },
          ].map(({ icon: Icon, href }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <Icon size={14} className="text-white" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* ── Right / Bottom Panel: Form ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col overflow-y-auto min-h-0"
      >
        {/* Mail-style header */}
        <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700/50 shrink-0">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">New Message</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the form below and I'll reply as soon as I can.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-5 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* To */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/40">
            <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">To:</span>
            <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full truncate">
              adeniranadebayo27@gmail.com
            </span>
          </div>

          {/* From — Name */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/40">
            <label className="text-xs font-semibold text-gray-400 w-16 shrink-0">From:</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="flex-1 text-xs bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none min-w-0"
            />
          </div>

          {/* Reply-To — Email */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/40">
            <label className="text-xs font-semibold text-gray-400 w-16 shrink-0">Reply-To:</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="flex-1 text-xs bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none min-w-0"
            />
          </div>

          {/* Message */}
          <div className="flex-1">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              required
              rows={5}
              className="w-full text-xs bg-transparent text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Send button */}
          <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700/40 shrink-0">
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white text-xs font-semibold transition-colors shadow-sm
                ${status === 'success' ? 'bg-green-500 hover:bg-green-600'
                  : status === 'error'   ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-[#0078d4] hover:bg-blue-600'}`}
            >
              {status === 'loading' && <Loader size={13} className="animate-spin" />}
              {status === 'success' && <CheckCircle size={13} />}
              {status === 'error'   && <AlertCircle size={13} />}
              {status === 'idle'    && <Send size={13} />}
              {status === 'loading' ? 'Sending…'
                : status === 'success' ? 'Sent!'
                : status === 'error'   ? 'Failed'
                : 'Send Message'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default ContactApp;

