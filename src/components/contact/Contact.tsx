import React, { useState } from "react";
import { FiSend, FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [icon, setIcon] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);
      if (response.ok) {
        setSubmissionMessage("Message submitted successfully!");
        setMessageColor("bg-green-100 border-green-400 text-green-700");
        setIcon(<FiCheckCircle className="inline-block text-green-500 mr-2" />);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmissionMessage("Error submitting message.");
        setMessageColor("bg-red-100 border-red-400 text-red-700");
        setIcon(<FiXCircle className="inline-block text-red-500 mr-2" />);
      }
    } catch (error) {
      setIsLoading(false);
      setSubmissionMessage("An error occurred.");
      setMessageColor("bg-red-100 border-red-400 text-red-700");
      setIcon(<FiXCircle className="inline-block text-red-500 mr-2" />);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-4">Get In Touch</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <FiLoader className="animate-spin text-4xl text-purple-500" />
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
              ></textarea>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center mb-2"
              >
                <FiSend className="mr-2" />
                Send Message
              </button>
            </div>
          </form>
          {submissionMessage && (
            <div
              className={`border px-4 py-3 rounded relative ${messageColor}`}
            >
              {icon}
              <span className="inline-block align-middle mr-8">
                {submissionMessage}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center gap-4 mt-8">
        <FaFacebookF className="text-2xl cursor-pointer" />
        <FaTwitter className="text-2xl cursor-pointer" />
        <FaLinkedinIn className="text-2xl cursor-pointer" />
        <FaInstagram className="text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Contact;
