import { NextResponse } from "next/server";
import axios from "axios";

function getBaseUrl(req: Request) {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  const proto = req.headers.get("x-forwarded-proto") ?? req.headers.get("protocol") ?? "http";
  const host = req.headers.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

function setUserInfoCookie(response: NextResponse, userInfo: any) {
  response.cookies.set("USERINFO", JSON.stringify(userInfo), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "";
  const base = getBaseUrl(req);

  if (!code) {
    return NextResponse.redirect(`${base}/account/login/buddy?error=no_code`);
  }

  try {
    // 1. 구글 authorization code → id_token 교환
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_PW,
      redirect_uri: `${base}/api/auth/callback/google`,
      grant_type: "authorization_code",
    });

    const idToken = tokenResponse.data.id_token;
    if (!idToken) {
      console.log("🚨 구글 응답에 id_token이 없습니다! 전체 응답:", tokenResponse.data);
      return NextResponse.redirect(`${base}/account/login/buddy?error=no_id_token`);
    }

    console.log("======================================================");
    console.log("✅ [증거 자료] 구글에서 정상 발급된 완벽한 id_token 입니다:");
    console.log(idToken);
    console.log("======================================================");

    const apiHost = process.env.NEXT_PUBLIC_API_HOST || "https://puppy.linemate.kr";

    // 2. SNS 로그인 (sign-up/google) 호출
    try {
      const authResponse = await axios.post(
        `${apiHost}/api/v1/account/sign-up/google`,
        {},
        {
          headers: {
            Authorization: idToken,
            country: "US",
            Accept: "application/json;charset=UTF-8",
          },
        }
      );
      console.log('Auth######');
      console.log(authResponse);

      const data = authResponse.data?.data || authResponse.data;


      if (data.status === "SIGNED_IN") {
        // 로그인 완료 → 홈 or 이전 페이지
        const userInfo = data.signIn;
        const redirectTarget = state ? decodeURIComponent(state) : `${base}/`;
        const response = NextResponse.redirect(redirectTarget, 302);
        setUserInfoCookie(response, userInfo);
        return response;
      } else if (data.status === "ADDITIONAL_INFO_REQUIRED") {
        // 추가 정보 입력 화면으로 이동
        const signupToken = data.pending?.signupToken || "";
        const email = data.pending?.email || "";

        const registerUrl = `${base}/account/register/social?provider=google&signupToken=${signupToken}&email=${encodeURIComponent(email)}${state ? `&redirect=${encodeURIComponent(state)}` : ""}`;
        return NextResponse.redirect(registerUrl, 302);
      } else {
        return NextResponse.redirect(`${base}/account/login/buddy?error=unknown_status`);
      }
    } catch (apiError: any) {
      console.log(apiError.response);
      console.error("Google auth API error:", apiError.response?.data || apiError.message);
      return NextResponse.redirect(
        `${base}/account/login/buddy?error=api_failed&message=${encodeURIComponent(
          apiError.response?.data?.message || apiError.message
        )}`
      );
    }
  } catch (error: any) {
    console.error("Google OAuth callback error:", error.response?.data || error.message);
    return NextResponse.redirect(`${base}/account/login/buddy?error=oauth_failed`);
  }
}
