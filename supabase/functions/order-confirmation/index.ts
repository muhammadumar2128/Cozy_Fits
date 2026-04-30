import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const order = payload.record;

    if (!order) throw new Error("No order record found");

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      total_amount_pkr,
      items,
      id
    } = order;

    const smtpUser = Deno.env.get("SMTP_USER");
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      secure: Deno.env.get("SMTP_SECURE") === "true",
      auth: {
        user: smtpUser,
        pass: Deno.env.get("SMTP_PASS"),
      },
    });

    // Elegant Item List HTML
    const itemsListHtml = items.map((item: any) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 0;">
          <p style="margin: 0; font-weight: bold; color: #1e293b; font-size: 14px;">${item.title.toUpperCase()}</p>
          <p style="margin: 2px 0 0 0; color: #64748b; font-size: 12px;">Size: ${item.selectedSize} | Qty: ${item.quantity}</p>
        </td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #1e293b; font-size: 14px;">
          PKR ${Number(item.price_pkr * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join("");

    // BRAND STYLES
    const brandColor = "#1e293b"; // Dark Slate
    const accentColor = "#D4AF37"; // Gold

    // 1. CUSTOMER EMAIL TEMPLATE
    const customerMailOptions = {
      from: `"Cozy Fits" <${smtpUser}>`,
      to: customer_email,
      subject: "Your Cozy Fits order is confirmed!",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfcfc; padding: 40px 20px; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background-color: ${brandColor}; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; letter-spacing: 0.3em; font-size: 24px; font-weight: 800;">COZY FITS</h1>
              <p style="color: ${accentColor}; margin: 10px 0 0 0; letter-spacing: 0.2em; font-size: 10px; font-weight: bold; text-transform: uppercase;">Premium Baby Couture</p>
            </div>

            <!-- Hero -->
            <div style="padding: 40px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <h2 style="color: ${brandColor}; margin: 0; font-size: 28px;">Order Confirmed!</h2>
              <p style="font-size: 16px; color: #64748b; margin-top: 10px;">Hi ${customer_name}, your treasures are being prepared.</p>
            </div>

            <!-- Order Details -->
            <div style="padding: 40px;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Items</th>
                    <th style="text-align: right; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; padding-bottom: 10px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                </tbody>
              </table>

              <div style="margin-top: 30px; text-align: right;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Total Amount</p>
                <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: ${brandColor};">PKR ${total_amount_pkr.toLocaleString()}</p>
              </div>

              <!-- Shipping Info -->
              <div style="margin-top: 40px; padding: 30px; background-color: #f8fafc; border-radius: 16px;">
                <h3 style="margin: 0 0 15px 0; font-size: 12px; color: ${brandColor}; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 800;">Delivery Details</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155;">
                  <strong>Address:</strong><br>${shipping_address}
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #334155;">
                  <strong>Phone:</strong> ${customer_phone}
                </p>
              </div>

              <!-- Next Steps -->
              <div style="margin-top: 40px; text-align: center;">
                <p style="font-size: 13px; color: #64748b; line-height: 1.6; font-style: italic;">
                  "To complete your order, please ensure you've sent the payment receipt on WhatsApp if you haven't already."
                </p>
              </div>
            </div>

            <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8; letter-spacing: 0.1em; font-weight: bold;">© 2026 COZY FITS PK • CRAFTING ELEGANCE</p>
            </div>
          </div>
        </div>
      `,
    };

    // 2. OWNER EMAIL TEMPLATE
    const ownerMailOptions = {
      from: `"Cozy Fits Orders" <${smtpUser}>`,
      to: Deno.env.get("OWNER_EMAIL") || smtpUser,
      subject: `New Order Received - ${customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px;">
            <h2 style="color: #1e293b; margin-top: 0;">New Order Alert!</h2>
            <p>A new purchase has been made on the website.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">Customer Information</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${customer_name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${customer_email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${customer_phone}</p>
              <p style="margin: 5px 0;"><strong>Address:</strong><br>${shipping_address}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              ${itemsListHtml}
            </table>

            <div style="margin-top: 20px; text-align: right; border-top: 2px solid #eee; pt: 20px;">
              <p style="font-size: 18px; font-weight: bold;">Total: PKR ${total_amount_pkr.toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(ownerMailOptions),
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
