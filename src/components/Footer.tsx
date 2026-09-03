import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

interface FooterProps {
  onOpenGmail?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGmail }) => {
  const { lang } = useLanguage();

  return (
    <footer id="main-footer" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        
        {/* Brand & Powered by */}
        <div>
          <div className="inline-flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <span className="w-6 h-6 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-mono font-bold">
              TP
            </span>
            <span className="font-mono">Thanawy Plus 2027</span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            powered by usef mohamed
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            {lang === 'ar'
              ? 'المنصة الأكاديمية الشاملة لطلاب الثانوية العامة المصرية 2027.'
              : 'The comprehensive academic platform for Egyptian High School students 2027.'}
          </p>
        </div>

        {/* Direct Gmail Messaging Link */}
        <div className="flex items-center justify-center">
          <a
            id="footer-gmail-link"
            href="mailto:usefmohamed1033@gmail.com?subject=تواصل%20بخصوص%20منصة%20ثانوية%20بلس%202027"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-lg font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Mail className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <div className="text-right ltr:text-left flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400">
                {lang === 'ar' ? 'تواصل مباشرة عبر البريد:' : 'Contact directly:'}
              </span>
              <span className="font-mono font-bold" dir="ltr">
                usefmohamed1033@gmail.com
              </span>
            </div>
          </a>
        </div>

        {/* Cloud & Local Privacy Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            {lang === 'ar'
              ? 'مزامنة سحابية آمنة عبر Firebase لحفظ بياناتك وجداولك ومذاكرتك على جميع أجهزتك'
              : 'Secure cloud synchronization powered by Firebase across all your devices'}
          </span>
        </div>

      </div>
    </footer>
  );
};


