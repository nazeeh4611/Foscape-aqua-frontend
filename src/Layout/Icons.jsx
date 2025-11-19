import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const FloatingIcons = () => {




  return (
    <div className="fixed bottom-20 right-6 flex flex-col items-center gap-4 z-50">

      <a
        href="https://wa.me/8547483891"
        target="_blank"
        rel="noreferrer"
        className="floating-icon bg-white rounded-full shadow-lg p-2"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          className="w-10 h-10"
        />
      </a>

      <a
        href="https://www.instagram.com/foscape_stories/"
        target="_blank"
        rel="noreferrer"
        className="floating-icon bg-white rounded-full shadow-lg p-2"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          className="w-10 h-10"
        />
      </a>

      <style>{`
        .floating-icon {
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FloatingIcons;
