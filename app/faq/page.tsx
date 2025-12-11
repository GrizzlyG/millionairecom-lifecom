"use client";

import React, { useState } from "react";
import Container from "../components/container";
import Heading from "../components/heading";
import { ChevronDown } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openReturnIndex, setOpenReturnIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleReturnFAQ = (index: number) => {
    setOpenReturnIndex(openReturnIndex === index ? null : index);
  };
  const faqs = [
    {
      question: "What are the delivery times?",
      answer:
        "Delivery times are periods when we dispatch orders. If you miss a delivery window, you'd kinda have to wait longer.",
    },
    {
      question: "How much is delivery?",
      answer: "Delivery is FREE during all scheduled delivery windows.",
    },
    {
      question: "Is delivery free everywhere?",
      answer:
        "Delivery is free to all pre listed locations. The ones you see during checkout.",
    },
    {
      question: "What's the Sorting & Packaging Fee (SPF)?",
      answer:
        "A small fee we pay to the folk who package your stuff nicely. This fee covers the cost of packaging materials and ensures your items arrive in perfect condition.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel your order... but we go get you for mind!",
    },
  ];

  const returnsFaqs = [
    {
      question: "What is your return policy?",
      answer:
        "Contact us within 24 hours of delivery for damaged or wrong items. We'll review your case and process returns for eligible items.",
    },
    {
      question: "How long do refunds take?",
      answer:
        "Refunds are processed within 3-5 business days after approval.",
    },
    {
      question: "What items can't be returned?",
      answer:
        "Personal care items and consumables cannot be returned for hygiene reasons. Please check product details carefully when collecting.",
    },
  ];

  return (
    <div className="pt-8 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto px-4">
          <Heading title="Frequently Asked Questions" center />
          <p className="text-center text-slate-600 mb-8">
            Find answers to common questions about ordering, delivery, and our services
          </p>

          {/* General FAQs */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-300 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition"
                >
                  <h3 className="text-lg font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`text-2xl text-slate-600 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Returns & Refunds Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">🔄</span>
              Returns & Refunds
            </h2>
            <div className="space-y-4">
              {returnsFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <button
                    onClick={() => toggleReturnFAQ(index)}
                    className="w-full p-6 flex justify-between items-center text-left hover:bg-blue-100/30 transition"
                  >
                    <h3 className="text-lg font-semibold text-blue-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`text-2xl text-blue-700 flex-shrink-0 transition-transform duration-300 ${
                        openReturnIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openReturnIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-6 text-slate-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-slate-100 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-slate-600">
              Can&apos;t find what you&apos;re looking for? Feel free to reach out to our
              customer service team.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQPage;
