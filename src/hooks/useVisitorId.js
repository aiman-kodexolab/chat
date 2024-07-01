import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const useVisitorId = () => {
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    FingerprintJS.load().then((fp) => {
      fp.get().then((result) => {
        setVisitorId(result.visitorId);
      });
    });
  }, []);

  return visitorId;
};