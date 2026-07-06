export function GET() {
  return Response.json({ status: "ok", service: "online-video", time: new Date().toISOString() });
}
