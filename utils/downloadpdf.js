import puppeteer from "puppeteer";

const downloadPdf = async (htmlContent) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 60000,
    headless: "new",
  });
  const page = await browser.newPage();

  // Set the HTML content for the page
  await page.setContent(htmlContent);

  // Generate the PDF and return the buffer
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "24px",
      bottom: "24px",
    },
  });

  await browser.close();
  return pdfBuffer;
};

export default downloadPdf;
