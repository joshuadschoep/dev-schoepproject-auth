export default (
  level: "info" | "warning" | "error",
  message: string,
  ...data: any
) => {
  switch (level) {
    case "info":
      console.log(`INFO\n${message}\n`, data);
      break;
    case "warning":
      console.warn(`WARNING\n${message}\n`, data);
      break;
    case "error":
      console.error(`ERROR\n${message}\n`, data);
  }
};
