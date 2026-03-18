// app/api/nice/redirect/route.ts
import { NextResponse } from "next/server";

function getBaseUrl(req: Request) {
  // 우선 환경변수 사용
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  // 환경변수가 없으면 요청 헤더에서 유추 (보조 수단)
  const proto = req.headers.get("x-forwarded-proto") ?? req.headers.get("protocol") ?? "http";
  const host = req.headers.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const payload = Object.fromEntries(form.entries());

    // 필요한 값들 추출 (예: orderId, tid, amount 등)
    const params = new URLSearchParams({
      orderId: payload["orderId"]?.toString() ?? "",
      tid: payload["tid"]?.toString() ?? "",
      amount: payload["amount"]?.toString() ?? "",
      // 주의: 민감한 값(signature 등)은 쿼리로 보내지 않는 것을 권장
    });

    const authResultCode = payload["AuthResultCode"]?.toString() || payload["resultCode"]?.toString() || "";
    const authResultMsg = payload["AuthResultMsg"]?.toString() || payload["resultMsg"]?.toString() || "";

    const base = getBaseUrl(req);

    if (authResultCode !== "0000") {
      // 결제 실패 시 fail 페이지로 이동
      const failParams = new URLSearchParams({
        message: authResultMsg,
        code: authResultCode
      });
      return NextResponse.redirect(`${base}/program/payments/fail?${failParams.toString()}`, 302);
    }

    // 프론트 progress 페이지로 redirect (절대 URL 사용)
    return NextResponse.redirect(`${base}/program/payments/progress?${params.toString()}`, 302);
  } catch (e) {
    const base = getBaseUrl(req);
    console.error("[/api/nice/redirect] error:", e);
    return NextResponse.redirect(`${base}/program/payments/fail`, 500);
  }
}
