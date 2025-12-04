import { SiteSettings } from '../models/SiteSettings.js';
import { Course } from '../models/Course.js';

const settingsResponse = (settings) => ({
  success: true,
  data: {
    settings: settings || null
  }
});

export const getMySiteSettings = async (req, res) => {
  try {
    let adminId = null;

    if (req.user.role === 'admin') {
      adminId = req.user.id;
    } else if (req.user.role === 'student') {
      const course = await Course.findByStudentId(req.user.id);
      adminId = course?.admin_id || null;
    }

    if (!adminId) {
      return res.json(settingsResponse(null));
    }

    const settings = await SiteSettings.findByAdminId(adminId);
    return res.json(settingsResponse(settings));
  } catch (error) {
    console.error('Get my site settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching site settings'
    });
  }
};

