const homeService = require("../../services/public/homeService");

const getHomeData = async (req, res) => {
  try {
    const data = await homeService.getHomeData();

    return res.status(200).json({
      success: true,
      message: "Home data fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Home API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch home data.",
    });
  }
};

module.exports = {
  getHomeData,
};