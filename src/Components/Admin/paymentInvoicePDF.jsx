import React from 'react';
import jsPDF from 'jspdf';

const PaymentInvoicePDF = ({ payment }) => {
  const generatePDF = () => {
    // Create new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text('Payment Invoice', 10, 10);
    doc.text(`Invoice Number: ${payment.invoiceNumber}`, 10, 20);
    doc.text(`Customer Name: ${payment.customerName}`, 10, 30);
    doc.text(`Amount: $${payment.amount}`, 10, 40);

    // Save the PDF
    doc.save('payment_invoice.pdf');
  };

  return (
    <div>
      <h2>Payment Invoice</h2>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default PaymentInvoicePDF;
