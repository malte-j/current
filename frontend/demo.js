const thrower = async () => {
  throw new Error("error!");
}

const handler = async () => {
  return await thrower();
  // return n;
}

const caller = async () => {
  try{
    await handler()
  } catch(e) {
    console.log("CAUGHT!:", e)
  }

  console.log("success")
}

caller()