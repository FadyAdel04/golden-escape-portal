
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { type Booking } from "@/hooks/useBookings";

interface BookingTicketProps {
  booking: Booking;
}

const BookingTicket = ({ booking }: BookingTicketProps) => {
  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoomPrice = (roomType: string) => {
    switch (roomType) {
      case "Standard Room": return 199;
      case "Deluxe Room": return 299;
      case "Executive Suite": return 499;
      default: return 199;
    }
  };

  const nights = calculateNights();
  const roomPrice = getRoomPrice(booking.room_type);
  const totalPrice = nights * roomPrice;

  const generateTicket = () => {
    const ticketContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Booking Ticket - Golden Escape Resort</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }
          .ticket { 
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
          }
          .ticket::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37);
          }
          .header { 
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white; 
            padding: 30px;
            text-align: center;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 10px solid #1e3a8a;
          }
          .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #D4AF37;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .subtitle { 
            font-size: 16px; 
            margin-top: 5px;
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px;
          }
          .booking-id {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #D4AF37;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            border: 2px dashed #D4AF37;
          }
          .section { 
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #D4AF37;
          }
          .section-title { 
            font-weight: bold; 
            color: #1e3a8a; 
            margin-bottom: 15px;
            font-size: 18px;
            display: flex;
            align-items: center;
          }
          .section-title::before {
            content: '●';
            color: #D4AF37;
            margin-right: 10px;
            font-size: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .info-label { 
            font-weight: 600;
            color: #555;
          }
          .info-value { 
            color: #333;
            font-weight: 500;
          }
          .total-section {
            background: linear-gradient(135deg, #D4AF37, #FFD700);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
          }
          .total-amount {
            font-size: 28px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            background: ${booking.status === 'confirmed' ? '#22c55e' : booking.status === 'pending' ? '#f59e0b' : '#ef4444'};
            color: white;
          }
          .footer {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
          }
          .qr-placeholder {
            width: 80px;
            height: 80px;
            background: #e0e0e0;
            border: 2px solid #D4AF37;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { background: white; }
            .ticket { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="logo">GOLDEN ESCAPE RESORT</div>
            <div class="subtitle">Luxury Hotel & Resort</div>
          </div>
          
          <div class="content">
            <div class="booking-id">
              Booking ID: ${booking.id.substring(0, 8).toUpperCase()}
            </div>

            <div class="section">
              <div class="section-title">Guest Information</div>
              <div class="info-item">
                <span class="info-label">Full Name:</span>
                <span class="info-value">${booking.guest_name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${booking.guest_email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">${booking.guest_phone}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="status-badge">${booking.status}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Reservation Details</div>
              <div class="info-grid">
                <div>
                  <div class="info-item">
                    <span class="info-label">Room Type:</span>
                    <span class="info-value">${booking.room_type}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Guests:</span>
                    <span class="info-value">${booking.number_of_guests}</span>
                  </div>
                </div>
                <div>
                  <div class="info-item">
                    <span class="info-label">Check-in:</span>
                    <span class="info-value">${new Date(booking.check_in_date).toLocaleDateString()}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Check-out:</span>
                    <span class="info-value">${new Date(booking.check_out_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Payment Summary</div>
              <div class="info-item">
                <span class="info-label">Nights:</span>
                <span class="info-value">${nights}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Rate per night:</span>
                <span class="info-value">$${roomPrice}</span>
              </div>
              <div class="total-section">
                <div style="font-size: 16px; margin-bottom: 5px;">Total Amount</div>
                <div class="total-amount">$${totalPrice}</div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <div class="qr-placeholder">QR Code</div>
              <p style="color: #666; font-size: 14px;">Present this ticket at check-in</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Golden Escape Resort</strong></p>
            <p>El Gouna, Red Sea, Egypt | +20 123 456 7890</p>
            <p>Check-in: 3:00 PM | Check-out: 11:00 AM</p>
            <p style="margin-top: 15px; font-size: 12px;">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(ticketContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Button
      onClick={generateTicket}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-gold/10 border-gold hover:bg-gold hover:text-white"
    >
      <Download className="h-4 w-4" />
      Download Ticket
    </Button>
  );
};

export default BookingTicket;
