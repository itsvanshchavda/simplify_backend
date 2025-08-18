import extractJobFromUrl from "./utils/extractjobfromurl.js";

const test = async () => {
  const res = await extractJobFromUrl(
    "https://www.linkedin.com/jobs/view/4282204334"
  );
  console.log("🚀 ~ test ~ res:", res);
};

test();
