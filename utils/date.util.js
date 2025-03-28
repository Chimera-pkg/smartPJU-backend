function timestampToFlexDate(timestamp) {
  return new Date(timestamp)
    .toLocaleString(
      "en-CA",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h24"
      }
    )
    .split("/").join("-")
    .replace(",", "")
}

module.exports = {
  timestampToFlexDate
}