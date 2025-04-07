import React from 'react';
import PaymentInvoicePDF from './paymentInvoicePDF';


const PaymentPage = () => {
  const payment = {
    invoiceNumber: 'INV-123',
    customerName: 'John Doe',
    amount: 100.00,
    // Add other payment details as needed
  };

  return (
    <div>
      <h1>Payment Details</h1>
      <PaymentInvoicePDF payment={payment}/>
    </div>
  );
};

export default PaymentPage;
