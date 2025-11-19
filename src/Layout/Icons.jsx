import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { baseurl } from "../Base/Base";
import axios from "axios";

const FloatingIcons = () => {

  const [phone, setPhone] = useState("Loading...");
  const fallbackNumber = "8547483891";
  

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const res = await axios.get(`${baseurl}user/phone`, { withCredentials: true });

        if (res?.data?.phone) {
          setPhone(res.data.phone);
        } else {
          setPhone(fallbackNumber);
        }
      } catch (err) {
        console.log("Phone fetch error:", err);
        setPhone(fallbackNumber);
      }
    };

    fetchPhone();
  }, []);
  const cleanPhoneNumber = (num) => {
    if (!num) return fallbackNumber;
    return num.replace(/\D/g, ""); 
  };

  const cleanedNumber = cleanPhoneNumber(phone);
  const finalNumber = cleanedNumber.startsWith("91")
  ? cleanedNumber
  : `91${cleanedNumber}`;
  const message = `Hello Foscape Team,
  I would like to know more about your services. Please get back to me when you're available.`;
  

  return (
    <div className="fixed bottom-20 right-6 flex flex-col items-center gap-4 z-50">

      <a
        href={`https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`}
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
