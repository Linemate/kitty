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
    // 1. 페이스북 authorization code → access_token 교환
    const tokenResponse = await axios.get("https://graph.facebook.com/v12.0/oauth/access_token", {
      params: {
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: `${base}/api/auth/callback/facebook`,
        code,
      },
    });

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return NextResponse.redirect(`${base}/account/login/buddy?error=token_exchange_failed`);
    }

    const apiHost = process.env.NEXT_PUBLIC_API_HOST || "https://puppy.linemate.kr";

    // 2. SNS 로그인 (sign-up/facebook) 호출
    try {
      const authResponse = await axios.post(
        `${apiHost}/api/v1/account/sign-up/facebook`,
        null,
        {
          headers: {
            Authorization: accessToken,
            country: "US",
            Accept: "application/json;charset=UTF-8",
          },
        }
      );

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

        const registerUrl = `${base}/account/register/social?provider=facebook&signupToken=${signupToken}&email=${encodeURIComponent(email)}${state ? `&redirect=${encodeURIComponent(state)}` : ""}`;
        return NextResponse.redirect(registerUrl, 302);
      } else {
        return NextResponse.redirect(`${base}/account/login/buddy?error=unknown_status`);
      }
    } catch (apiError: any) {
      console.error("Facebook auth API error:", apiError.response?.data || apiError.message);
      return NextResponse.redirect(
        `${base}/account/login/buddy?error=api_failed&message=${encodeURIComponent(
          apiError.response?.data?.message || apiError.message
        )}`
      );
    }
  } catch (error: any) {
    console.error("Facebook OAuth callback error:", error.response?.data || error.message);
    return NextResponse.redirect(`${base}/account/login/buddy?error=oauth_failed`);
  }
}
