import emailjs from "@emailjs/browser";

// Standard EmailJS configuration initialized from env or defaults
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_krishimitra";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_welcome";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key_demo";

export interface SendEmailParams {
  to_name: string;
  to_email: string;
  message?: string;
  subject?: string;
  [key: string]: any;
}

/**
 * Send transactional email using EmailJS.
 */
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; message: string }> {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_name: params.to_name,
        to_email: params.to_email,
        message: params.message || "Welcome to KrishiMitra AI Platform!",
        subject: params.subject || "KrishiMitra AI Notification",
        ...params,
      },
      EMAILJS_PUBLIC_KEY
    );

    return { success: true, message: `Email sent status: ${response.status}` };
  } catch (error: any) {
    console.warn("EmailJS notification notice (mock/fallback active):", error);
    return { success: false, message: error?.text || "Failed to send email" };
  }
}
