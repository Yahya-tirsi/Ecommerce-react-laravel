const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const Client = require("../models/clients");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Inscription
router.post("/register", async (req, res) => {
  const { username, email, number, password } = req.body;
  try {
    const user = await Client.create({ username, email, number, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Client.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new Error("Invalid password!");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res
      .status(400)
      .send("Missing required fields: to, subject, or text");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).send("Error sending email");
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const user = await Client.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ error: "Email not found." });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp);

    user.otp = otp;
    await user.save();
    console.log("OTP saved to user document");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Votre code OTP pour la réinitialisation du mot de passe",
      text: `Bonjour ${user.username},\n\nVous avez demandé la réinitialisation de votre mot de passe. Utilisez le code OTP ci-dessous pour continuer :\n\nOTP: ${otp}\n\nCe code est valable 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail ou contactez notre support immédiatement.\n\nMerci,\nL'équipe MyApp`,
      html: `
        <div style="max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
          <h1 style="color: black;">👋 Bonjour ${user.username},</h1>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Utilisez le code OTP ci-dessous pour continuer :</p>
          <div style="font-size: 24px; background-color: gray; color: #fff; display: inline-block; padding: 10px 20px; border-radius: 5px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Ce code est valable <strong>10 minutes</strong>. Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail ou contactez notre support immédiatement.</p>
          <a href='http://localhost:3000/verify-otp/${user.email}' style="display: inline-block; background-color: black; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 10px; margin-top: 20px; transition: 0.3s;">
            Vérifie l'otp
          </a>
          <div style="margin-top: 20px; font-size: 14px; color: #777;">
            <p>Merci,</p> 
            <p><strong>Équipe de support MyApp</strong></p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ error: "Failed to send OTP. Please try again." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "OTP sent to your email." });
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("send to : ", email);

  try {
    const user = await Client.findOne({ email });
    console.log("user found : ", user);
    if (!user) {
      return res.status(404).json({ error: "Email not found." });
    }

    console.log("user otp : ", user.otp);
    console.log("otp : ", otp);
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    user.otp = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  console.log("email : ", email, "password : ", password);

  try {
    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found." });
    }
    console.log("user foud : ", user);

    // Hash the new password
    // const salt = await bcrypt.genSalt(10);

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});




// Déconnexion
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Déconnecté avec succès" });
});

// Vérifier utilisateur connecté
router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Non autorisé" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token invalide" });

    res.json({ userId: decoded.userId });
  });
});

module.exports = router;
