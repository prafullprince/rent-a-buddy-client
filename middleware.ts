import { NextRequest, NextResponse } from "next/server";


export function middleware(req: NextRequest, res: NextResponse) {

}

export const config = {
    matcher: ["/api/:path*"]
}
