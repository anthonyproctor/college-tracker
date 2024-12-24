const cron = require('node-cron');
const Application = require('../models/Application');
const User = require('../models/User');
const emailService = require('./emailService');

// Schedule tasks to be run on the server
class Scheduler {
    init() {
        // Check deadlines daily at 9:00 AM
        cron.schedule('0 9 * * *', async () => {
            console.log('Running daily deadline check...');
            await this.checkDeadlines();
        });

        // Weekly summary every Sunday at 10:00 AM
        cron.schedule('0 10 * * 0', async () => {
            console.log('Sending weekly summaries...');
            await this.sendWeeklySummaries();
        });
    }

    async checkDeadlines() {
        try {
            const applications = await Application.find({
                status: { $ne: 'submitted' }
            }).populate('user');

            for (const application of applications) {
                const deadline = new Date(application.deadline);
                const today = new Date();
                const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

                // Send reminders for applications due in 7, 3, and 1 days
                if ([7, 3, 1].includes(daysUntilDeadline)) {
                    const user = await User.findById(application.user);
                    if (user) {
                        await emailService.sendDeadlineReminder(user, application);
                    }
                }
            }
        } catch (error) {
            console.error('Error in deadline check:', error);
        }
    }

    async sendWeeklySummaries() {
        try {
            const users = await User.find();

            for (const user of users) {
                const applications = await Application.find({ 
                    user: user._id,
                    status: { $ne: 'submitted' }
                });

                if (applications.length > 0) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: 'Weekly Application Summary',
                        html: this.generateWeeklySummaryEmail(user, applications)
                    };

                    await emailService.transporter.sendMail(mailOptions);
                }
            }
        } catch (error) {
            console.error('Error sending weekly summaries:', error);
        }
    }

    generateWeeklySummaryEmail(user, applications) {
        const upcomingDeadlines = applications
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        return `
            <h2>Weekly Application Summary</h2>
            <p>Hello ${user.name},</p>
            <p>Here's your weekly summary of college applications:</p>

            <h3>Upcoming Deadlines</h3>
            <ul>
                ${upcomingDeadlines.map(app => `
                    <li>
                        <strong>${app.collegeName}</strong>
                        <br>Deadline: ${new Date(app.deadline).toLocaleDateString()}
                        <br>Status: ${app.status}
                        <br>Requirements Complete: ${emailService.getRequirementsProgress(app)}
                    </li>
                `).join('')}
            </ul>

            <h3>Quick Stats</h3>
            <ul>
                <li>Total Applications: ${applications.length}</li>
                <li>Not Started: ${applications.filter(app => app.status === 'not-started').length}</li>
                <li>In Progress: ${applications.filter(app => app.status === 'in-progress').length}</li>
                <li>Submitted: ${applications.filter(app => app.status === 'submitted').length}</li>
            </ul>

            <p>
                <a href="${process.env.FRONTEND_URL}/dashboard.html" 
                   style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View Dashboard
                </a>
            </p>

            <p>Keep up the great work with your applications!</p>
            <p>College Application Tracker Team</p>
        `;
    }
}

module.exports = new Scheduler();
