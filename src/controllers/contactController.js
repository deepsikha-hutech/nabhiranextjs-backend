const Contact = require('../models/contactModel');

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
      category: category || 'General'
    });

    await newContact.save();

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
