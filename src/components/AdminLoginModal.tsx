import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { verifyAdminPassword } from '../utils/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(password)) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d0d12] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
          aria-label="Close login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#ff2d2d]/15 border border-[#ff2d2d]/30 text-[#ff4b4b] flex items-center justify-center mb-5">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Admin Studio Access
        </h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          This portal is protected. Please enter your administrator security password to manage portfolio videos and platform settings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter password..."
                className={`w-full pl-3.5 pr-10 py-2.5 bg-zinc-950 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                  error
                    ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                    : 'border-white/[0.1] focus:border-[#ff2d2d]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Incorrect security password. Please try again.</span>
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#ff2d2d]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>

      </div>
    </div>
  );
};
