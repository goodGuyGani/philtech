const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates a unique invitation code in the format "PACKXPTV01".
 * @returns {string} The generated invitation code.
 */
const generateInvitationCode = () => {
  const prefix = 'PACK';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let generatedPart = '';

  // Generate a 6-character alphanumeric sequence
  for (let i = 0; i < 6; i++) {
    generatedPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${prefix}${generatedPart}`;
};

/**
 * Generates the current date in the format "YYYY-MM-DD HH:mm:ss".
 * @returns {string} The formatted date string.
 */
const generateCurrentDate = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

/**
 * Insert a new invitation code.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const createInvitationCode = async (req, res) => {
  const { package, amount, user_id } = req.body;
  const code = generateInvitationCode();
  const datePurchased = generateCurrentDate();

  try {
    // Insert a new row into the database
    const newCode = await prisma.wp_ihc_invitation_codes.create({
      data: {
        code,
        package: package || null,
        amount: parseFloat(amount) || null,
        user_id: parseInt(user_id) || null,
        date_purchased: datePurchased,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Invitation code created successfully.',
      data: newCode,
    });
  } catch (error) {
    console.error('Error creating invitation code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invitation code.',
      error: error.message,
    });
  }
};

/**
 * Fetch an invitation code by ID.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getInvitationCodeById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the invitation code from the database
    const invitationCode = await prisma.wp_ihc_invitation_codes.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!invitationCode) {
      return res.status(404).json({
        success: false,
        message: 'Invitation code not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: invitationCode,
    });
  } catch (error) {
    console.error('Error fetching invitation code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invitation code.',
      error: error.message,
    });
  }
};

/**
 * Fetch all invitation codes by user_id.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getInvitationCodeByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Fetch the invitation codes from the database
    const invitationCodes = await prisma.wp_ihc_invitation_codes.findMany({
      where: {
        user_id: parseInt(user_id),
      },
    });

    if (invitationCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No invitation codes found for the given user_id.',
      });
    }

    res.status(200).json({
      success: true,
      data: invitationCodes,
    });
  } catch (error) {
    console.error('Error fetching invitation codes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invitation codes.',
      error: error.message,
    });
  }
};



module.exports = {
  createInvitationCode,
  getInvitationCodeById,
  getInvitationCodeByUserId
};
