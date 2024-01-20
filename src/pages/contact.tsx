// src/pages/contact.tsx
import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import ContactComponent from "../components/contact/Contact";
import IconsBackground from "../components/common/IconsBackground";

import "../app/globals.css";

const Contact: React.FC = () => {
  return (
    <div>
      <Navbar />
      <IconsBackground />
      <ContactComponent />
    </div>
  );
};

export default Contact;
