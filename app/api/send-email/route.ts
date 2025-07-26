import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'Email configuration not found' },
        { status: 500 }
      );
    }

    const transporter = createTransporter();

    let emailContent = '';
    let subject = '';
    let recipientEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (type === 'contact') {
      subject = `Contact Form: ${data.subject}`;
      emailContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">This email was sent from the VentureNext contact form.</p>
      `;
    } else if (type === 'list-service') {
      subject = `New Service Listing Application: ${data.businessName}`;
      emailContent = `
        <h2>New Service Listing Application</h2>
        <p><strong>Business Name:</strong> ${data.businessName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This email was sent from the VentureNext "List Your Service" form.</p>
      `;
    } else if (type === 'quote-request') {
      subject = `New Lead for ${data.serviceName}`;
      recipientEmail = data.providerEmail; // Send to service provider's email_for_leads
      emailContent = `
        <h2>New Lead</h2>
        <p><strong>Service:</strong> ${data.serviceName}</p>
        <p><strong>Client Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Company:</strong> ${data.company || 'Not specified'}</p>
        <p><strong>Service Type:</strong> ${data.service || 'Not specified'}</p>
        <p><strong>Project Details:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${data.needs ? data.needs.replace(/\n/g, '<br>') : 'No additional details provided'}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">This lead was sent from the VentureNext platform. Please respond directly to the client's email address above.</p>
      `;
    } else {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: `"VentureNext Platform" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: subject,
      html: emailContent,
      replyTo: type === 'contact' ? data.email : undefined,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user if it's a contact form
    if (type === 'contact') {
      const confirmationMailOptions = {
        from: `"VentureNext Platform" <${process.env.SMTP_USER}>`,
        to: data.email,
        subject: 'Thank you for contacting VentureNext',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${data.name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <p>Best regards,<br>The VentureNext Team</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated confirmation email.</p>
        `,
      };

      await transporter.sendMail(confirmationMailOptions);
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
