
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";
import { BookingFormData } from "@/hooks/useBookings";

interface BookingStepConfirmationProps {
  form: UseFormReturn<BookingFormData>;
  calculateNights: () => number;
  totalPrice: number;
  isSubmitting: boolean;
  submittedBooking?: any;
}

const BookingStepConfirmation = ({ 
  form, 
  calculateNights, 
  totalPrice, 
  isSubmitting,
  submittedBooking 
}: BookingStepConfirmationProps) => {
  const formData = form.getValues();
  const nights = calculateNights();

  const getRoomPrice = (roomType: string) => {
    switch (roomType) {
      case "Standard Room": return 199;
      case "Deluxe Room": return 299;
      case "Executive Suite": return 499;
      default: return 199;
    }
  };

  const roomPrice = getRoomPrice(formData.room_type);

  // If booking is submitted, show success message with download option
  if (submittedBooking) {
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
              background: #f59e0b;
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
                Booking ID: ${submittedBooking.id.substring(0, 8).toUpperCase()}
              </div>

              <div class="section">
                <div class="section-title">Guest Information</div>
                <div class="info-item">
                  <span class="info-label">Full Name:</span>
                  <span class="info-value">${submittedBooking.guest_name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${submittedBooking.guest_email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${submittedBooking.guest_phone}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <span class="status-badge">pending</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Reservation Details</div>
                <div class="info-item">
                  <span class="info-label">Room Type:</span>
                  <span class="info-value">${submittedBooking.room_type}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Check-in:</span>
                  <span class="info-value">${new Date(submittedBooking.check_in_date).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Check-out:</span>
                  <span class="info-value">${new Date(submittedBooking.check_out_date).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Guests:</span>
                  <span class="info-value">${submittedBooking.number_of_guests}</span>
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
      <div className="space-y-4 text-center">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-green-800 font-semibold mb-2 text-lg">Booking Confirmed!</h3>
          <p className="text-green-700 text-sm mb-4">
            Your booking request has been submitted successfully. You'll receive an email confirmation shortly.
          </p>
          <div className="text-sm text-green-600 mb-4">
            Booking ID: <span className="font-mono font-bold">{submittedBooking.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <Button
            onClick={generateTicket}
            className="bg-gold hover:bg-gold/90 text-white mb-2"
          >
            Download Booking Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-navy flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5" />
          Confirm Your Booking
        </h3>
        <p className="text-gray-600 text-sm">Please review your booking details before confirming.</p>
      </div>

      {/* Guest Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-navy mb-2">Guest Information</h4>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {formData.guest_name}</p>
          <p><span className="font-medium">Email:</span> {formData.guest_email}</p>
          <p><span className="font-medium">Phone:</span> {formData.guest_phone}</p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-navy mb-2">Booking Details</h4>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Room:</span> {formData.room_type}</p>
          <p><span className="font-medium">Check-in:</span> {new Date(formData.check_in_date).toLocaleDateString()}</p>
          <p><span className="font-medium">Check-out:</span> {new Date(formData.check_out_date).toLocaleDateString()}</p>
          <p><span className="font-medium">Guests:</span> {formData.number_of_guests}</p>
          <p><span className="font-medium">Nights:</span> {nights}</p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-beige/30 p-4 rounded-lg border border-gold/20">
        <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Room rate (per night):</span>
            <span>${roomPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of nights:</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${totalPrice}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-gold text-lg">
              <span>Total Amount:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p className="font-medium mb-1">Booking Terms:</p>
        <ul className="space-y-1">
          <li>• Payment will be processed upon confirmation</li>
          <li>• Free cancellation up to 24 hours before check-in</li>
          <li>• Check-in time: 3:00 PM | Check-out time: 11:00 AM</li>
          <li>• Valid ID required at check-in</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingStepConfirmation;
