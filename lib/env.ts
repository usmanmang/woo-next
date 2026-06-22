export function hasPayloadEnv() {
  return Boolean(process.env.PAYLOAD_SECRET && process.env.MONGODB_URI)
}
