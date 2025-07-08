import React, { useState } from 'react';
import './css/FAQs.css';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How to book cricket turf?',
      answer: 'Visit our website, check available slots, and confirm your booking online easily.',
    },
    {
      question: 'Is cricket equipment provided by you?',
      answer: 'Yes! Basic equipment like bats, balls, and stumps are available at the arena.',
    },
    {
      question: 'What is turf booking cancellation policy?',
      answer: 'Cancel 24 hours before your slot for a full refund. No refunds for late cancellations.',
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">

      <section className="faq-section">
        <h1 className="faq-title">Frequently Asked Questions</h1>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleFAQ(index)}>
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
              </div>
              <div className="faq-answer" style={{ maxHeight: activeIndex === index ? '500px' : '0' }}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="faq-footer">
        <div className="footer-left">
          <h2>The Dotball</h2>
          <p>by Root Alliance</p>
        </div>

        <div className="footer-center">
          <h3>Connect</h3>
          <p><a href="https://instagram.com/the.dotball" target="_blank" rel="noreferrer">@the.dotball</a></p>
        </div>

        <div className="footer-right">
          <h3>Contact Us</h3>
          <p>📞 7874-050623</p>
          <p>✉️ thedotballsurat@gmail.com</p>
          <p>📍 The Dotball, Near SRK Sports Park, Surat, Gujarat 395004</p>
        </div>

        <div className="footer-bottom">
          © 2025 The Dotball
        </div>
      </footer>

      <a href="https://wa.me/7874050623" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <img src="/whatsapp-icon.png" alt="WhatsApp" />
      </a>
    </div>
  );
};

export default FAQs;
