
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="mb-12 md:mb-0">
          <div className="flex items-center space-x-2 mb-6 group cursor-pointer">
            <div className="w-8 h-8 bg-[#7C3AED] rounded flex items-center justify-center text-white font-black text-xs transition-transform group-hover:rotate-6 shadow-lg shadow-[#7C3AED]/10">S</div>
            <span className="font-syne font-black text-[#111827] text-xl tracking-tighter">STUDLYF</span>
          </div>
          <p className="text-sm text-[#6B7280] max-w-xs leading-relaxed">
            Defining and verifying real-world engineering capability. The definitive standard for elite tech readiness.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div>
            <h4 className="font-bold text-[#111827] text-sm uppercase tracking-widest mb-6">Standards</h4>
            <ul className="space-y-4 text-sm text-[#374151]">
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Tracks</a></li>
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Verification</a></li>
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Scoring</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#111827] text-sm uppercase tracking-widest mb-6">Institution</h4>
            <ul className="space-y-4 text-sm text-[#374151]">
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Methodology</a></li>
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Contact</a></li>
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#111827] text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-[#374151]">
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Terms</a></li>
              <li><a href="#" className="hover:text-[#7C3AED] transition-colors font-medium">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">
        <p>© {new Date().getFullYear()} STUDLYF INSTITUTION. All rights reserved.</p>
        <p className="mt-4 sm:mt-0 font-mono">AUDITABLE VERIFICATION FOR THE GENERATIVE AGE.</p>
      </div>
    </footer>
  );
};

export default Footer;
