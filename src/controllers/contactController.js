const Contact = require('../models/contactModel');
const { sendEmail } = require('../utils/emailUtil');

// SUBMIT CONTACT FORM
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, pageTitle, pageUrl, category } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      pageTitle,
      pageUrl,
      category: category
    });

    await newContact.save();

    // Trigger automated notification email to admin
    const adminLink = `http://localhost:3000/admin/dashboard/contact-form${category ? `?category=${encodeURIComponent(category)}` : ""}`;
    
    await sendEmail({
      to: 'deepsikha@hutechsolutions.com',
      subject: `New Contact Inquiry: ${subject || 'Website Submission'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #11253e;">New Contact Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 120px;">Name</td>
              <td style="padding: 8px 0; color: #11253e; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 8px 0; color: #11253e;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Subject</td>
              <td style="padding: 8px 0; color: #11253e;">${subject || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Message</td>
              <td style="padding: 8px 0; color: #11253e;">${message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Category</td>
              <td style="padding: 8px 0; color: #11253e;">${category || 'Website General Form'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Page URL</td>
              <td style="padding: 8px 0; color: #11253e;">${pageUrl || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Page Title</td>
              <td style="padding: 8px 0; color: #11253e;">${pageTitle || 'N/A'}</td>
            </tr>
          </table>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${adminLink}" style="background-color: #f99d1c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">View in Admin Dashboard</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #aaa;">This notification was sent from the Nabhira website.</p>
        </div>
      `
    });

    res.json({ success: true, message: "Contact inquiry submitted successfully" });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ success: false, message: "Server error during submission" });
  }
};


// GET ALL CONTACTS (with optional category filter)
exports.getAllContacts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const contacts = await Contact.find(filter).sort({ submittedAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error fetching contacts" });
  }
};

// GET SINGLE CONTACT
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, contact });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error fetching contact" });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error updating status" });
  }
};
