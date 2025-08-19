import convertJson from "../../helpers/convert-json.js";

const parseJson = async (req, res) => {
  try {
    const { resumeText } = req.body;

    const parsedData = await convertJson(resumeText);

    return res.status(200).json({
      message: "Resume text parsed successfully",
      parsedData,
    });
  } catch (error) {
    console.error("Error parsing JSON from resume text:", error);
    res.status(500).json({ error: error.message });
  }
};

export default parseJson;
