"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

class ReceiptGenerator {
  constructor() {
    this.primaryColor = [16, 185, 129] // #10b981
    this.secondaryColor = [5, 150, 105] // #059669
    this.darkColor = [17, 24, 39] // #111827
    this.lightColor = [249, 250, 251] // #f9fafb
  }

  generateSingleBookingReceipt(bookingData, venueData, userData) {
    const doc = new jsPDF()

    // Set up the document
    this.setupDocument(doc)

    // Header with logo and company info
    this.addHeader(doc, "SPORTS ARENA BOOKING")

    // Invoice title and number
    doc.setFontSize(24)
    doc.setTextColor(...this.primaryColor)
    doc.text("BOOKING RECEIPT", 20, 60)

    doc.setFontSize(12)
    doc.setTextColor(...this.darkColor)
    doc.text(`Receipt #: SA-${bookingData.bookingId}`, 20, 70)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 78)

    // Customer Information
    this.addSection(doc, "CUSTOMER INFORMATION", 90)
    const customerY = 105
    doc.setFontSize(10)
    doc.text(`Name: ${userData.name || "Customer"}`, 20, customerY)
    doc.text(`Email: ${userData.email || "N/A"}`, 20, customerY + 8)
    doc.text(`Phone: ${userData.phone || "N/A"}`, 20, customerY + 16)

    // Booking Details
    this.addSection(doc, "BOOKING DETAILS", customerY + 30)
    const bookingY = customerY + 45

    // Venue image placeholder (if available)
    if (venueData.image) {
      doc.setFillColor(...this.lightColor)
      doc.rect(140, bookingY - 5, 50, 30, "F")
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text("Venue Image", 155, bookingY + 8)
    }

    doc.setFontSize(10)
    doc.setTextColor(...this.darkColor)
    doc.text(`Venue: ${venueData.name}`, 20, bookingY)
    doc.text(`Location: ${venueData.location}`, 20, bookingY + 8)
    doc.text(`Category: ${bookingData.categoryName || "Sports Venue"}`, 20, bookingY + 16)
    doc.text(`Capacity: ${venueData.capacity} people`, 20, bookingY + 24)

    // Booking Schedule
    this.addSection(doc, "SCHEDULE", bookingY + 40)
    const scheduleY = bookingY + 55

    doc.setFontSize(12)
    doc.setTextColor(...this.primaryColor)
    doc.text(`${this.formatDate(bookingData.date)}`, 20, scheduleY)

    doc.setFontSize(10)
    doc.setTextColor(...this.darkColor)
    doc.text(
      `Time: ${this.formatTime(bookingData.slotStartTime)} - ${this.formatTime(bookingData.slotEndTime)}`,
      20,
      scheduleY + 10,
    )
    doc.text(
      `Duration: ${this.calculateDuration(bookingData.slotStartTime, bookingData.slotEndTime)}`,
      20,
      scheduleY + 18,
    )

    // Payment Details Table
    this.addPaymentTable(
      doc,
      [
        {
          description: `${venueData.name} - ${this.formatDate(bookingData.date)}`,
          time: `${this.formatTime(bookingData.slotStartTime)} - ${this.formatTime(bookingData.slotEndTime)}`,
          amount: bookingData.payableAmount,
        },
      ],
      scheduleY + 35,
    )

    // Status and Transaction Info
    const statusY = scheduleY + 85
    this.addSection(doc, "PAYMENT & STATUS", statusY)

    doc.setFontSize(10)
    doc.text(`Booking Status: `, 20, statusY + 15)
    this.addStatusBadge(doc, bookingData.bookingStatus, 65, statusY + 11)

    doc.text(`Payment Status: `, 20, statusY + 25)
    this.addStatusBadge(doc, bookingData.paymentPaid ? "Paid" : "Pending", 65, statusY + 21)

    if (bookingData.transactionId) {
      doc.text(`Transaction ID: ${bookingData.transactionId}`, 20, statusY + 35)
    }

    // Footer
    this.addFooter(doc)

    return doc
  }

  generateMultipleBookingReceipt(bookingsData, venueData, userData, totalAmount) {
    const doc = new jsPDF()

    this.setupDocument(doc)
    this.addHeader(doc, "SPORTS ARENA BOOKING")

    // Invoice title
    doc.setFontSize(24)
    doc.setTextColor(...this.primaryColor)
    doc.text("MULTIPLE BOOKING RECEIPT", 20, 60)

    doc.setFontSize(12)
    doc.setTextColor(...this.darkColor)
    doc.text(`Receipt #: SA-MULTI-${Date.now()}`, 20, 70)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 78)

    // Customer Information
    this.addSection(doc, "CUSTOMER INFORMATION", 90)
    const customerY = 105
    doc.setFontSize(10)
    doc.text(`Name: ${userData.name || "Customer"}`, 20, customerY)
    doc.text(`Email: ${userData.email || "N/A"}`, 20, customerY + 8)
    doc.text(`Phone: ${userData.phone || "N/A"}`, 20, customerY + 16)

    // Venue Information
    this.addSection(doc, "VENUE INFORMATION", customerY + 30)
    const venueY = customerY + 45
    doc.text(`Venue: ${venueData.name}`, 20, venueY)
    doc.text(`Location: ${venueData.location}`, 20, venueY + 8)

    // Multiple Bookings Table
    this.addSection(doc, "BOOKING DETAILS", venueY + 25)

    const tableData = bookingsData.map((booking) => [
      this.formatDate(booking.date),
      `${this.formatTime(booking.slotStartTime)} - ${this.formatTime(booking.slotEndTime)}`,
      this.calculateDuration(booking.slotStartTime, booking.slotEndTime),
      `₹${booking.payableAmount}`,
    ])

    autoTable(doc, {
      startY: venueY + 40,
      head: [["Date", "Time", "Duration", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: this.primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: this.darkColor,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 20, right: 20 },
    })

    // Total Amount
    const finalY = doc.autoTable.previous.finalY + 20
    doc.setFillColor(...this.primaryColor)
    doc.rect(20, finalY, 170, 15, "F")

    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.text(`Total Bookings: ${bookingsData.length}`, 25, finalY + 10)
    doc.text(`Total Amount: ₹${totalAmount}`, 130, finalY + 10)

    this.addFooter(doc)

    return doc
  }

  setupDocument(doc) {
    // Set document properties
    doc.setProperties({
      title: "Sports Arena Booking Receipt",
      subject: "Booking Receipt",
      author: "Sports Arena",
      creator: "Sports Arena Booking System",
    })
  }

  addHeader(doc, title) {
    // Header background
    doc.setFillColor(...this.primaryColor)
    doc.rect(0, 0, 210, 40, "F")

    // Logo placeholder
    doc.setFillColor(255, 255, 255)
    doc.circle(25, 20, 8, "F")
    doc.setFontSize(8)
    doc.setTextColor(...this.primaryColor)
    doc.text("SA", 22, 23)

    // Company name
    doc.setFontSize(18)
    doc.setTextColor(255, 255, 255)
    doc.text(title, 40, 18)

    // Tagline
    doc.setFontSize(10)
    doc.text("Premium Sports Venue Booking", 40, 26)

    // Contact info
    doc.setFontSize(8)
    doc.text("www.sportsarena.com | support@sportsarena.com | +91 98765 43210", 40, 34)
  }

  addSection(doc, title, y) {
    doc.setFillColor(...this.lightColor)
    doc.rect(20, y - 5, 170, 12, "F")

    doc.setFontSize(12)
    doc.setTextColor(...this.primaryColor)
    doc.text(title, 22, y + 2)
  }

  addPaymentTable(doc, items, startY) {
    const tableData = items.map((item) => [item.description, item.time, `₹${item.amount}`])

    autoTable(doc, {
      startY: startY,
      head: [["Description", "Time Slot", "Amount"]],
      body: tableData,
      foot: [["", "Total Amount:", `₹${items.reduce((sum, item) => sum + item.amount, 0)}`]],
      theme: "grid",
      headStyles: {
        fillColor: this.primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: this.secondaryColor,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: this.darkColor,
      },
      margin: { left: 20, right: 20 },
    })
  }

  addStatusBadge(doc, status, x, y) {
    const statusColors = {
      Confirmed: [34, 197, 94],
      Paid: [34, 197, 94],
      Pending: [251, 191, 36],
      Cancelled: [239, 68, 68],
    }

    const color = statusColors[status] || [107, 114, 128]

    doc.setFillColor(...color)
    doc.roundedRect(x, y, 25, 8, 2, 2, "F")

    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.text(status, x + 2, y + 5)
  }

  addFooter(doc) {
    const pageHeight = doc.internal.pageSize.height

    // Footer line
    doc.setDrawColor(...this.primaryColor)
    doc.line(20, pageHeight - 30, 190, pageHeight - 30)

    // Footer text
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text("Thank you for choosing Sports Arena!", 20, pageHeight - 20)
    doc.text("For support, contact us at support@sportsarena.com or +91 98765 43210", 20, pageHeight - 14)
    doc.text("Terms & Conditions apply. Visit www.sportsarena.com for more details.", 20, pageHeight - 8)

    // Page number
    doc.text(`Page 1`, 180, pageHeight - 8)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatTime(timeString) {
    if (!timeString) return ""
    if (timeString.includes("T")) {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }
    return timeString.slice(0, 5)
  }

  calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    const diffMs = end - start
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes > 0 ? diffMinutes + "m" : ""}`
    }
    return `${diffMinutes}m`
  }

  downloadPDF(doc, filename) {
    doc.save(filename)
  }

  previewPDF(doc) {
    const pdfBlob = doc.output("blob")
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, "_blank")
  }
}

export default ReceiptGenerator
