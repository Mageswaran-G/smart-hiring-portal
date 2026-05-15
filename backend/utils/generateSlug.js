// generateSlug
// Converts job title + location into a clean URL-friendly string


const generateSlug = (title, location, mongoId) => {

  // Combine title and location
  const base = `${title} ${location}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')   // remove special chars (!, @, etc)
    .replace(/\s+/g, '-')           // spaces become dashes
    .replace(/-+/g, '-')            // multiple dashes become one
    .replace(/^-|-$/g, '')          // remove leading/trailing dash
    .substring(0, 60);              // max 60 characters

  // Last 6 chars of MongoDB _id for uniqueness
  // Two jobs with same title+location won't conflict
  const shortId = mongoId.toString().slice(-6);

  return `${base}-${shortId}`;
};

module.exports = generateSlug;