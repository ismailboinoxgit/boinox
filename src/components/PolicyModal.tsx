import React, { useState } from 'react';
import { X, Shield, Lock, FileText, Mail, Check, AlertCircle } from 'lucide-react';

export type PolicyTab = 'about' | 'privacy' | 'terms' | 'dmca' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  initialTab?: PolicyTab;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  initialTab = 'about',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div 
        onClick={onClose} 
        className="fixed inset-0 -z-10 cursor-pointer" 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-850 flex items-center justify-between">
          <h2 id="policy-modal-title" className="font-display font-bold text-lg text-white">
            BOINOX Platform Information
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-zinc-850 bg-zinc-900/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            About BOINOX
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('dmca')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'dmca'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DMCA &amp; Copyright
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-zinc-300 leading-relaxed space-y-4">
          {activeTab === 'about' && (
            <div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                About BOINOX · Wallpapers Without Limits
              </h3>
              <p className="text-zinc-400">
                BOINOX was founded to solve a persistent frustration among visual enthusiasts: bloated wallpaper sites filled with intrusive pop-ups, low-bitrate compression, fake download buttons, and blurry upscales.
              </p>
              <p className="text-zinc-400 mt-2">
                We believe that modern high-resolution displays—from 4K &amp; 8K desktop monitors to ultrawide gaming panels and true-black AMOLED smartphone displays—deserve pixel-perfect art rendered at uncompromised bitrates.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-semibold text-white">Our Commitments:</div>
                <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                  <li>Zero fake download buttons or deceptive redirects.</li>
                  <li>True #000000 pure blacks in our AMOLED collection for battery savings.</li>
                  <li>100% royalty-free, ethically sourced photography and artisan visual renders.</li>
                  <li>Respect for user privacy without tracking cookies or paywalls.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                Privacy Policy
              </h3>
              <p className="text-zinc-400">
                Last updated: November 2026. BOINOX is built on a zero-tracking philosophy:
              </p>
              <div className="space-y-3 mt-3">
                <div>
                  <h4 className="font-semibold text-zinc-200">1. Data Collection</h4>
                  <p className="text-zinc-400">
                    We do not collect personal identifying information, IP addresses, or browser fingerprints. Your favorite wallpapers are stored client-side in your browser's local storage and never transmitted to our servers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-200">2. Advertising &amp; Third Parties</h4>
                  <p className="text-zinc-400">
                    Any future advertisement spaces displayed on BOINOX are privacy-compliant and context-targeted, avoiding behavioral tracking cookies or third-party profiling.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-200">3. Direct Downloads</h4>
                  <p className="text-zinc-400">
                    All wallpaper downloads occur directly through your client browser. We do not require account creation, payment information, or app installations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dmca' && (
            <div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                Copyright &amp; DMCA Compliance
              </h3>
              <p className="text-zinc-400">
                BOINOX strictly respects intellectual property rights. All wallpaper images published on our service are either:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-zinc-400 my-2">
                <li>Proprietary original high-fidelity generated art created by BOINOX Studio.</li>
                <li>Royalty-free photography under permissive open-source licenses (Unsplash / Creative Commons Zero).</li>
                <li>Artisan submissions with explicit distributor rights.</li>
              </ul>
              <p className="text-zinc-400">
                If you are a copyright owner or an agent thereof and believe that any wallpaper published on BOINOX infringes upon your copyright, please submit a notice to <span className="text-cyan-400 font-mono">dmca@boinox.dev</span> with the wallpaper title, URL, and proof of ownership. We honor all valid takedown notices within 24 hours.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                Contact BOINOX
              </h3>
              <p className="text-zinc-400 mb-4">
                Have questions, wallpaper submissions, or partnership inquiries? Reach out below.
              </p>

              {contactSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Message sent! Thank you for getting in touch with BOINOX.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Message</label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we assist you?"
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
