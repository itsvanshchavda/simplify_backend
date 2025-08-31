import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const getCountryCodes = (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const countriesPath = path.join(__dirname, "../../utils/countries.json");
    const countries = JSON.parse(fs.readFileSync(countriesPath, "utf-8"));

    const formattedCountries = countries.map((c) => ({
      name: c.name,
      code: c.code,
      dial_code: c.dial_code,
      flag: `https://flagcdn.com/48x36/${c.code.toLowerCase()}.png`, // CDN flag
    }));

    res.status(200).json({
      codes: formattedCountries,
    });
  } catch (error) {
    console.error("Error reading country codes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getCountryCodes;
