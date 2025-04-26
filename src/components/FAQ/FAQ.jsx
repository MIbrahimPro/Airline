import React, { useState } from 'react';
import  './FAQ.scss'; 

const faqData = [
  {
    question: 'Are there really no booking fees?',
    answer:
      'Yes, we pride ourselves on transparency. You will not encounter any hidden booking fees when you make a reservation with us. The price you see is the final price.',
  },
  {
    question: 'How do I search for the best flight deals?',
    answer:
      'Our advanced search engine automatically compares prices from various airlines to find you the best available deals. Be sure to use our flexible date options for broader searches.',
  },
  {
    question: 'What if I need to change or cancel my flight?',
    answer:
      'Our policies for changes and cancellations vary depending on the airline and the fare type you have selected. Please refer to your booking confirmation or contact our support team for assistance.',
  },
  {
    question: 'Is my personal and payment information secure?',
    answer:
      'Absolutely. We use industry-leading encryption and security protocols to ensure that your personal data and payment details are protected at every step of the booking process.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach our dedicated customer support team 24/7 via phone, email, or through the live chat feature on our website. Visit our "Contact Us" page for details.',
  },
  {
    question: 'Can I select my seats in advance?',
    answer:
      'Seat selection policies vary by airline. During the booking process, if the option is available for your chosen flight, you will be able to select your preferred seats.',
  },
  {
    question: 'What are the baggage allowances for my flight?',
    answer:
      'Baggage allowances (both checked and carry-on) are set by the individual airlines. This information will be clearly displayed during the booking process and on your ticket.',
  },
  {
    question: 'Do you offer travel insurance?',
    answer:
      'Yes, we offer a range of travel insurance options to provide you with peace of mind during your travels. You can add insurance to your booking during the checkout process.',
  },
];

const FaqSection = () => {
  const [expandedItemId, setExpandedItemId] = useState(null);

  const toggleAccordion = (id) => {
    setExpandedItemId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="faqSection">
      <h2 className="faqTitle">In case you missed anything.</h2>
      <ul className="faqList">
        {faqData.map((item, index) => (
          <li className="faqItem" key={index}>
            <div className="faqQuestionContainer" onClick={() => toggleAccordion(index)}>
              <h3 className="faqQuestion">{item.question}</h3>
              <button className="faqToggleButton">
                {expandedItemId === index ? (
                  <img src="../icons/minus.svg" alt="Minus Icon" className="toggleIcon" />
                ) : (
                  <img src="../icons/plus.svg" alt="Plus Icon" className="toggleIcon" />
                )}
              </button>
            </div>
            {expandedItemId === index && (
              <div className="faqAnswer">{item.answer}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FaqSection;