import { useState } from "react"
import { Modal, Button, Spinner } from "react-bootstrap"
import { FaDownload, FaEye, FaFileInvoice } from "react-icons/fa"
import ReceiptGenerator from "./ReceiptGenerator"
import Swal from "sweetalert2"

const BookingReceiptModal = ({ show, onHide, bookingData, venueData, userData, isMultiple = false }) => {
  const [generating, setGenerating] = useState(false)
  const receiptGenerator = new ReceiptGenerator()

  const handleDownloadReceipt = async () => {
    try {
      setGenerating(true)

      let doc
      let filename

      if (isMultiple) {
        const totalAmount = bookingData.reduce((sum, booking) => sum + booking.payableAmount, 0)
        doc = receiptGenerator.generateMultipleBookingReceipt(bookingData, venueData, userData, totalAmount)
        filename = `Sports_Arena_Multiple_Booking_${Date.now()}.pdf`
      } else {
        doc = receiptGenerator.generateSingleBookingReceipt(bookingData, venueData, userData)
        filename = `Sports_Arena_Receipt_${bookingData.bookingId}.pdf`
      }

      receiptGenerator.downloadPDF(doc, filename)

      Swal.fire({
        icon: "success",
        title: "Receipt Downloaded!",
        text: "Your booking receipt has been downloaded successfully.",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      })
    } catch (error) {
      console.error("Error generating receipt:", error)
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to generate receipt. Please try again.",
        confirmButtonColor: "#10b981",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handlePreviewReceipt = async () => {
    try {
      setGenerating(true)

      let doc

      if (isMultiple) {
        const totalAmount = bookingData.reduce((sum, booking) => sum + booking.payableAmount, 0)
        doc = receiptGenerator.generateMultipleBookingReceipt(bookingData, venueData, userData, totalAmount)
      } else {
        doc = receiptGenerator.generateSingleBookingReceipt(bookingData, venueData, userData)
      }

      receiptGenerator.previewPDF(doc)
    } catch (error) {
      console.error("Error previewing receipt:", error)
      Swal.fire({
        icon: "error",
        title: "Preview Failed",
        text: "Failed to preview receipt. Please try again.",
        confirmButtonColor: "#10b981",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          border: "none",
        }}
      >
        <Modal.Title className="d-flex align-items-center">
          <FaFileInvoice className="me-2" />
          Download Receipt
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ background: "#1f2937", color: "white" }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #10b981, #059669)",
            }}
          >
            <FaFileInvoice size={32} color="white" />
          </div>

          <h5 className="mb-2">{isMultiple ? "Multiple Booking Receipt" : "Booking Receipt"}</h5>

          <p className="text-white-50 mb-0">
            {isMultiple
              ? `Generate receipt for ${bookingData.length} bookings`
              : `Generate receipt for booking #${bookingData.bookingId}`}
          </p>
        </div>

        <div className="glass-card p-3 mb-4">
          <h6 className="mb-3" style={{ color: "#10b981" }}>
            Receipt Details
          </h6>

          <div className="row text-sm">
            <div className="col-6">
              <strong>Venue:</strong>
              <div className="text-white-50">{venueData.name}</div>
            </div>
            <div className="col-6">
              <strong>Customer:</strong>
              <div className="text-white-50">{userData.name || "Customer"}</div>
            </div>
          </div>

          <hr className="border-secondary my-3" />

          <div className="row text-sm">
            <div className="col-6">
              <strong>{isMultiple ? "Total Bookings:" : "Booking Date:"}</strong>
              <div className="text-white-50">
                {isMultiple ? `${bookingData.length} slots` : new Date(bookingData.date).toLocaleDateString()}
              </div>
            </div>
            <div className="col-6">
              <strong>Total Amount:</strong>
              <div className="text-white-50">
                ₹
                {isMultiple
                  ? bookingData.reduce((sum, booking) => sum + booking.payableAmount, 0)
                  : bookingData.payableAmount}
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <Button
            variant="outline-light"
            onClick={handlePreviewReceipt}
            disabled={generating}
            className="d-flex align-items-center justify-content-center"
          >
            {generating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              <>
                <FaEye className="me-2" />
                Preview Receipt
              </>
            )}
          </Button>

          <Button
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "none",
            }}
            onClick={handleDownloadReceipt}
            disabled={generating}
            className="d-flex align-items-center justify-content-center"
          >
            {generating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              <>
                <FaDownload className="me-2" />
                Download Receipt
              </>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default BookingReceiptModal
