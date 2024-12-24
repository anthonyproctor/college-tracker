const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendDeadlineReminder(user, application) {
        const deadline = new Date(application.deadline);
        const today = new Date();
        const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Deadline Reminder: ${application.collegeName} Application`,
            html: `
                <h2>Application Deadline Reminder</h2>
                <p>Hello ${user.name},</p>
                <p>This is a reminder that your application to <strong>${application.collegeName}</strong> 
                is due in <strong>${daysUntilDeadline} days</strong> (${deadline.toLocaleDateString()}).</p>
                
                <h3>Application Status:</h3>
                <ul>
                    <li>Status: ${application.status}</li>
                    <li>Requirements Completed: ${this.getRequirementsProgress(application)}</li>
                </ul>
                
                <p>Log in to your dashboard to review and complete your application:</p>
                <a href="${process.env.FRONTEND_URL}/dashboard.html" 
                   style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View Application
                </a>
                
                <p>Best of luck with your application!</p>
                <p>College Application Tracker Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Deadline reminder sent to ${user.email} for ${application.collegeName}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email notification');
        }
    }

    async sendStatusUpdate(user, application, oldStatus) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Status Update: ${application.collegeName} Application`,
            html: `
                <h2>Application Status Update</h2>
                <p>Hello ${user.name},</p>
                <p>The status of your application to <strong>${application.collegeName}</strong> 
                has been updated from <strong>${oldStatus}</strong> to <strong>${application.status}</strong>.</p>
                
                <h3>Current Application Details:</h3>
                <ul>
                    <li>Deadline: ${new Date(application.deadline).toLocaleDateString()}</li>
                    <li>Requirements Completed: ${this.getRequirementsProgress(application)}</li>
                </ul>
                
                <p>Log in to your dashboard to view the complete details:</p>
                <a href="${process.env.FRONTEND_URL}/dashboard.html" 
                   style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View Application
                </a>
                
                <p>Keep up the great work!</p>
                <p>College Application Tracker Team</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Status update notification sent to ${user.email} for ${application.collegeName}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email notification');
        }
    }

    getRequirementsProgress(application) {
        const completed = application.requirements.filter(req => req.completed).length;
        const total = application.requirements.length;
        return `${completed}/${total} (${Math.round((completed/total) * 100)}%)`;
    }
}

module.exports = new EmailService();
