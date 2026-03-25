const Career = require('../models/careerModel');

// SUBMIT APPLICATION
exports.submitApplication = async (req, res) => {
  try {
    const { name, email, linkedin, pageTitle, pageUrl } = req.body;
    
    // In a real app, we'd handle file upload for resume here. 
    // For now, we'll store the textual data.
    
    const newApplication = new Career({
      name,
      email,
      linkedin,
      pageTitle,
      pageUrl
    });

    await newApplication.save();

    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, message: "Server error during submission" });
  }
};

// GET ALL APPLICATIONS
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ appliedAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error fetching applications" });
  }
};

// GET SINGLE APPLICATION
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, application });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error fetching application" });
  }
};
