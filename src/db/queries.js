module.exports = {
  get_comments:
      `SELECT user_id, user.name, user.display_name,
        comment.created_at, comment, approved
      FROM comment INNER JOIN user ON (user_id=user.id)
      WHERE slug = ? AND ((
        NOT user.blocked AND NOT comment.rejected
        AND (comment.approved OR user.trusted))
        OR user.id = ?)
      ORDER BY comment.created_at DESC`,
  admin_get_comments:
      `SELECT user_id, user.name, user.display_name, comment.id,
        comment.created_at, comment, approved, trusted
      FROM comment INNER JOIN user ON (user_id=user.id)
      WHERE slug = ? AND NOT user.blocked
        AND NOT comment.rejected
      ORDER BY comment.created_at DESC`,
  approve:
      `UPDATE comment SET approved = 1 WHERE id = ?`,
  reject:
      `UPDATE comment SET rejected = 1 WHERE id = ?`,
  trust:
      `UPDATE user SET trusted = 1 WHERE id = ?`,
  block:
      `UPDATE user SET blocked = 1 WHERE id = ?`,
  awaiting_moderation:
      `SELECT comment.id, slug, comment.created_at
      FROM comment INNER JOIN user ON (user_id=user.id)
      WHERE NOT user.blocked AND NOT user.trusted AND
       NOT comment.rejected AND NOT comment.approved
       ORDER BY comment.created_at DESC LIMIT 20`,
  insert:
      `INSERT INTO comment
      (user_id, slug, comment, created_at, approved, rejected)
      VALUES (?,?,?,datetime(),0,0)`,
  find_user:
      `SELECT id,name,display_name,provider,provider_id FROM user
       WHERE provider = ? AND provider_id = ?`,
  create_user:
      `INSERT INTO user
      (provider, provider_id, display_name, name,
       created_at, trusted, blocked)
      VALUES (?, ?, ?, ?, datetime(), 0, 0)`
};
