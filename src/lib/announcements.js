/** Normalizes the API's has_read flag, which may come back as true/1/'1'. */
export const isAnnouncementRead = (announcement) =>
  announcement.has_read === true || announcement.has_read === 1 || announcement.has_read === '1';
