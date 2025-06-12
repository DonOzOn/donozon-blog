import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Validate required environment variables
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS configuration missing. Please check your environment variables.');
      return false;
    }

    // Prepare template parameters to match your EmailJS template
    const templateParams = {
      name: `${formData.firstName} ${formData.lastName}`, // Maps to {{name}}
      title: formData.subject || 'New Contact Form Message', // Maps to {{title}}
      message: formData.message, // Maps to {{message}}
      from_email: formData.email, // Additional info (sender's email)
      reply_to: formData.email, // For EmailJS to set reply-to address
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('Email sent successfully!', response);
      return true;
    } else {
      console.error('Failed to send email:', response);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Initialize EmailJS (call this once in your app)
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};
