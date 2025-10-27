const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generate attractive message based on status
 * 
 * 
 */
function generateMessage(customerName, serviceName, newStatus) {
  switch (newStatus.toLowerCase()) {
    case "accepted":
      return `
        Dear <b>${customerName}</b>, <br/><br/>
        We are pleased to inform you that your service request for <b>${serviceName}</b>Isuues has been 
        <span style="color: green; font-weight: bold;">accepted</span>.<br/><br/>
        Our technician will soon visit your location to provide you with 
        <b>reliable and hassle-free home service</b>. Thank you for choosing us! 
      `;
    case "completed":
      return `
        Dear <b>${customerName}</b>, <br/><br/>
        Great news! Your service request for <b>${serviceName}</b> has been 
        <span style="color: green; font-weight: bold;">successfully completed</span><br/><br/>
        We hope you are satisfied with our service. Your trust means a lot to us!
      `;
    case "rejected":
      return `
        Dear <b>${customerName}</b>, <br/><br/>
        Unfortunately, your service request for <b>${serviceName}</b> has been 
        <span style="color: red; font-weight: bold;">rejected</span><br/><br/>
        If you believe this was a mistake or need further clarification, please feel free to contact us. 
      `;
    default:
      return `
        Dear <b>${customerName}</b>, <br/><br/>
        The status of your service request for <b>${serviceName}</b> has been updated to 
        <span style="color: #2563eb; font-weight: bold;">${newStatus}</span>.
      `;
  }
}

async function sendStatusUpdateEmail(toEmail, customerName, serviceName, newStatus) {
  const customMessage = generateMessage(customerName, serviceName, newStatus);

  const mailOptions = {
    from: `"Shahid Computer Repairing Centre" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Service Status Update: ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f7fb; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: #2563eb; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0;">Shahid Computer Repairing Centre</h2>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px; text-align: left; color: #333;">
            <p style="font-size: 16px; line-height: 1.6;">
              ${customMessage}
            </p>
            
            <div style="margin: 20px 0; text-align: center;">
              <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px;">View Details</a>
            </div>
            
            <p style="font-size: 14px; color: #555; text-align: center;">
              Thank you for choosing <b>Shahid Computer Repairing Centre</b>. <br/>
              Should you require any further assistance, please feel free to contact us.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            Best regards,<br/>
            Shahid Computer Repairing Centre Team
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendStatusUpdateEmail };
