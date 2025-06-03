
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { type Booking } from "@/hooks/useBookings";

interface InvoiceGeneratorProps {
  booking: Booking;
}

const InvoiceGenerator = ({ booking }: InvoiceGeneratorProps) => {
  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const roomPrice = 299; // You might want to get this from the booking data
  const subtotal = nights * roomPrice;
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  const generatePDF = () => {
    const invoiceContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Booking Invoice</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            line-height: 1.6;
          }
          .header { text-align: center; margin-bottom: 30px; }
          .title { color: #D4AF37; font-size: 24px; font-weight: bold; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .total-row { font-weight: bold; border-top: 2px solid #D4AF37; padding-top: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
          th { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">LUXURY HAVEN</div>
          <h2>Booking Invoice</h2>
        </div>
        
        <div class="section">
          <div class="section-title">Guest Details</div>
          <div class="info-row"><span>Full Name:</span><span>${booking.guest_name}</span></div>
          <div class="info-row"><span>Email:</span><span>${booking.guest_email}</span></div>
          <div class="info-row"><span>Phone:</span><span>${booking.guest_phone}</span></div>
        </div>
        
        <div class="section">
          <div class="section-title">Booking Details</div>
          <div class="info-row"><span>Booking ID:</span><span>${booking.id.substring(0, 8)}</span></div>
          <div class="info-row"><span>Room Type:</span><span>${booking.room_type}</span></div>
          <div class="info-row"><span>Check-in:</span><span>${new Date(booking.check_in_date).toLocaleDateString()}</span></div>
          <div class="info-row"><span>Check-out:</span><span>${new Date(booking.check_out_date).toLocaleDateString()}</span></div>
          <div class="info-row"><span>Guests:</span><span>${booking.number_of_guests}</span></div>
          <div class="info-row"><span>Status:</span><span>${booking.status}</span></div>
        </div>
        
        <div class="section">
          <div class="section-title">Payment Summary</div>
          <div class="info-row"><span>Nights:</span><span>${nights}</span></div>
          <div class="info-row"><span>Rate per night:</span><span>$${roomPrice}</span></div>
          <div class="info-row"><span>Subtotal:</span><span>$${subtotal}</span></div>
          <div class="info-row"><span>Taxes (10%):</span><span>$${taxes.toFixed(2)}</span></div>
          <div class="info-row total-row"><span>Grand Total:</span><span>$${total.toFixed(2)}</span></div>
        </div>
        
        <div class="section">
          <div class="info-row"><span>Date:</span><span>${new Date().toLocaleDateString()}</span></div>
          <div class="info-row"><span>Invoice Number:</span><span>INV-${Date.now()}</span></div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      Download Invoice
    </Button>
  );
};

export default InvoiceGenerator;
