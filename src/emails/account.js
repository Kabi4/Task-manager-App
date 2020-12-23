const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.sendWelcomeEmail = async (email, name) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'hykukku@gmail.com', // Change to your verified sender
        subject: 'Welcome to task App',
        text: `Welcome to the family! ${name}.Let me tell how you get along with app.`,
        html: `<strong>Welcome to the family! ${name}.Let me tell how you get along with app.</strong>`,
    };
    await sgMail.send(msg);
};

exports.niklLaudeEmail = async (email, name) => {
    const msg = {
        to: email, // Change to your recipient
        from: 'hykukku@gmail.com', // Change to your verified sender
        subject: 'Goodbye!-Task App',
        text: `We were glad to have you! ${name}.Please tell us how to improve our app. Thank you!`,
        html: `<strong>We were glad to have you! ${name}.Please tell us how to improve our app. Thank you!</strong>`,
    };
    await sgMail.send(msg);
};
