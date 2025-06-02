
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  booking: {
    id: string;
    guest_name: string;
    guest_email: string;
    check_in_date: string;
    check_out_date: string;
    room_type: string;
    status: string;
    admin_notes?: string;
  };
}

const getEmailTemplate = (booking: any) => {
  const statusMessages = {
    confirmed: {
      subject: "Booking Confirmed - Luxury Haven Hotel",
      message: "Great news! Your booking has been confirmed.",
      color: "#16a34a"
    },
    rejected: {
      subject: "Booking Update - Luxury Haven Hotel", 
      message: "We regret to inform you that your booking could not be confirmed.",
      color: "#dc2626"
    },
    cancelled: {
      subject: "Booking Cancelled - Luxury Haven Hotel",
      message: "Your booking has been cancelled as requested.",
      color: "#6b7280"
    }
  };

  const statusInfo = statusMessages[booking.status as keyof typeof statusMessages];
  
  return {
    subject: statusInfo.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${statusInfo.subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">LUXURY HAVEN</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0;">Premium Hotel Experience</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: ${statusInfo.color}; margin-top: 0;">Booking Update</h2>
            
            <p>Dear ${booking.guest_name},</p>
            
            <p>${statusInfo.message}</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.id.slice(0, 8)}</p>
              <p><strong>Room Type:</strong> ${booking.room_type}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.check_in_date).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.check_out_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: capitalize;">${booking.status}</span></p>
              ${booking.admin_notes ? `<p><strong>Notes:</strong> ${booking.admin_notes}</p>` : ''}
            </div>
            
            ${booking.status === 'confirmed' ? `
              <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #15803d;"><strong>Next Steps:</strong></p>
                <ul style="color: #15803d; margin: 10px 0 0 0;">
                  <li>You will receive a confirmation email with check-in instructions</li>
                  <li>Please arrive during our check-in hours: 3:00 PM - 11:00 PM</li>
                  <li>Contact us if you have any special requests</li>
                </ul>
              </div>
            ` : ''}
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            The Luxury Haven Team</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280;">
            <p>Luxury Haven Hotel | Premium Hospitality Experience</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking }: BookingNotificationRequest = await req.json();
    
    console.log('Sending email notification for booking:', booking.id);

    const emailTemplate = getEmailTemplate(booking);

    const emailResponse = await resend.emails.send({
      from: "Luxury Haven <onboarding@resend.dev>",
      to: [booking.guest_email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending booking notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
