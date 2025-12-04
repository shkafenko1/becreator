import { query } from '../config/database.js';

export class SiteSettings {
  static async findByAdminId(adminId) {
    const result = await query(
      'SELECT * FROM site_settings WHERE admin_id = $1',
      [adminId]
    );
    return result.rows[0] || null;
  }

  static async create(adminId) {
    const result = await query(
      `INSERT INTO site_settings (admin_id)
       VALUES ($1)
       RETURNING *`,
      [adminId]
    );
    return result.rows[0];
  }

  static async update(adminId, settings) {
    const {
      primaryColor,
      secondaryColor,
      logoUrl,
      faviconUrl,
      bannerImageUrl,
      landingTitle,
      landingSubtitle,
      footerText,
      contactEmail
    } = settings;

    const result = await query(
      `UPDATE site_settings 
       SET primary_color = COALESCE($1, primary_color),
           secondary_color = COALESCE($2, secondary_color),
           logo_url = COALESCE($3, logo_url),
           favicon_url = COALESCE($4, favicon_url),
           banner_image_url = COALESCE($5, banner_image_url),
           landing_title = COALESCE($6, landing_title),
           landing_subtitle = COALESCE($7, landing_subtitle),
           footer_text = COALESCE($8, footer_text),
           contact_email = COALESCE($9, contact_email)
       WHERE admin_id = $10
       RETURNING *`,
      [
        primaryColor,
        secondaryColor,
        logoUrl,
        faviconUrl,
        bannerImageUrl,
        landingTitle,
        landingSubtitle,
        footerText,
        contactEmail,
        adminId
      ]
    );
    return result.rows[0] || null;
  }
}


