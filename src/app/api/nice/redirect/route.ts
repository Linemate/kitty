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

    // 키를 대소문자 구분 없이 찾기 위한 헬퍼
    const getVal = (keys: string[]) => {
      for (const k of keys) {
        const found = Object.keys(payload).find(p => p.toLowerCase() === k.toLowerCase());
        if (found && payload[found]) return payload[found]!.toString();
      }
      return "";
    };

    const authResultCode = getVal(["AuthResultCode", "resultCode"]);
    const authResultMsg = getVal(["AuthResultMsg", "resultMsg"]);

    const orderId = getVal(["orderId", "Moid", "ReqReserved"]);
    const tid = getVal(["tid", "TxTid"]);
    const amount = getVal(["amount", "Amt"]);

    const { searchParams: reqSearchParams } = new URL(req.url);
    const programId = reqSearchParams.get("programId") || "";

    const params = new URLSearchParams({
      orderId,
      tid,
      amount,
      programId,
    });

    const base = getBaseUrl(req);

    if (authResultCode === "0000") {
      // 결제 성공 시 success 페이지로 바로 이동
      return NextResponse.redirect(`${base}/program/payments/success?${params.toString()}`, 302);
    } else {
      // 결제 실패 시 fail 페이지로 이동
      const failParams = new URLSearchParams({
        message: authResultMsg,
        code: authResultCode
      });
      return NextResponse.redirect(`${base}/program/payments/fail?${failParams.toString()}`, 302);
    }
  } catch (e) {
    const base = getBaseUrl(req);
    console.error("[/api/nice/redirect] error:", e);
    return NextResponse.redirect(`${base}/program/payments/fail`, 500);
  }
}
