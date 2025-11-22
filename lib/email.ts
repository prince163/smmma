import nodemailer from 'nodemailer';
import { Setting } from '@prisma/client';
import prisma from './prisma';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

// Get SMTP settings from database
async function getSmtpSettings() {
    const settings = await prisma.setting.findMany({
        where: {
            key: {
                in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_from']
            }
        }
    });

    const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as Record<string, string>);

    return {
        host: settingsMap.smtp_host || 'smtp.gmail.com',
        port: parseInt(settingsMap.smtp_port || '587'),
        user: settingsMap.smtp_user || '',
        password: settingsMap.smtp_password || '',
        from: settingsMap.smtp_from || settingsMap.smtp_user || '',
    };
}

// Create transporter
async function createTransporter() {
    const settings = await getSmtpSettings();

    if (!settings.user || !settings.password) {
        throw new Error('SMTP credentials not configured');
    }

    return nodemailer.createTransporter({
        host: settings.host,
        port: settings.port,
        secure: settings.port === 465, // true for 465, false for other ports
        auth: {
            user: settings.user,
            pass: settings.password,
        },
    });
}

// Send email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        const transporter = await createTransporter();
        const settings = await getSmtpSettings();

        await transporter.sendMail({
            from: settings.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });

        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

// Test SMTP connection
export async function testSmtpConnection(): Promise<{ success: boolean; message: string }> {
    try {
        const transporter = await createTransporter();
        await transporter.verify();
        return { success: true, message: 'SMTP connection successful' };
    } catch (error: any) {
        return { success: false, message: error.message || 'SMTP connection failed' };
    }
}

// Email templates
export const emailTemplates = {
    welcome: (userName: string) => ({
        subject: 'Welcome to SMM Panel!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #6366f1;">Welcome to SMM Panel!</h1>
                <p>Hi ${userName},</p>
                <p>Thank you for joining SMM Panel. We're excited to have you on board!</p>
                <p>You can now start ordering social media services to grow your online presence.</p>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Best regards,<br>SMM Panel Team</p>
            </div>
        `,
        text: `Welcome to SMM Panel! Hi ${userName}, thank you for joining us.`
    }),

    orderConfirmation: (orderNumber: string, total: string) => ({
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #6366f1;">Order Confirmed!</h1>
                <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
                <p><strong>Total:</strong> ${total}</p>
                <p>We're processing your order and will notify you once it's completed.</p>
                <p>Thank you for your business!</p>
                <p>Best regards,<br>SMM Panel Team</p>
            </div>
        `,
        text: `Order ${orderNumber} confirmed. Total: ${total}`
    }),

    ticketReply: (ticketSubject: string, message: string) => ({
        subject: `Support Ticket Update: ${ticketSubject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #6366f1;">Support Ticket Update</h1>
                <p><strong>Subject:</strong> ${ticketSubject}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px;">
                    ${message}
                </div>
                <p>You can reply to this ticket from your dashboard.</p>
                <p>Best regards,<br>SMM Panel Support</p>
            </div>
        `,
        text: `Support ticket update: ${ticketSubject}. Message: ${message}`
    }),
};
