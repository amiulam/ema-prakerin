"use server";

export const submitAction = async (_: unknown, formData: FormData) => {
  const data = {
    name: formData.get("name") as string,
    password: formData.get("password") as string,
  };

  if (data.password.length < 8) {
    return { type: "error", message: "Password must have 8 chars length" };
  }

  if (data.password.length > 12) {
    return { type: "error", message: "Password characters is at 12 max" };
  }

  await sleep(2000);
  console.log(Object.fromEntries(formData));

  return { type: "success", message: "Data added successfully" };
};

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
