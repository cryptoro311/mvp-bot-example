const playground = () => {
  try {
    console.log("We ran!")
  } catch (err) {
    console.log({ err })
  }

  return process.exit(0)
}

playground()