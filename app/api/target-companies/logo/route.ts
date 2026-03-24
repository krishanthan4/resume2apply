import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
    try {
        const { linkedinPageUrl, website } = await request.json();

        if (!linkedinPageUrl && !website) {
            return NextResponse.json({ success: false, error: "Either LinkedIn URL or website is required" }, { status: 400 });
        }

        // 1. Try to fetch from LinkedIn using the og:image meta tag
        if (linkedinPageUrl) {
            try {
                let url = linkedinPageUrl.trim();
                if (!url.startsWith("http")) url = "https://" + url;

                // Make sure it's a linkedin company or school URL
                if (url.includes("linkedin.com/company/") || url.includes("linkedin.com/school/")) {
                    const response = await fetch(url, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                            "Accept-Language": "en-US,en;q=0.9"
                        },
                        next: { revalidate: 86400 } // Cache for 24 hours
                    });

                    if (response.ok) {
                        const html = await response.text();
                        const $ = cheerio.load(html);
                        const ogImage = $('meta[property="og:image"]').attr("content");

                        if (ogImage && !ogImage.includes("ghost-company")) {
                            return NextResponse.json({ success: true, logoUrl: ogImage });
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to scrape LinkedIn logo:", err);
            }
        }

        // 2. Fallback to Google Favicon API using website domain
        if (website) {
            try {
                let w = website.trim();
                if (!w.startsWith("http")) w = "https://" + w;
                const parsedUrl = new URL(w);
                const domain = parsedUrl.hostname.replace("www.", "");

                // Ensure we don't accidentally fetch LinkedIn's own favicon
                if (!domain.includes("linkedin.com")) {
                    const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
                    return NextResponse.json({ success: true, logoUrl: faviconUrl });
                }
            } catch (err) {
                console.error("Failed to parse website URL:", err);
            }
        }

        // If both fail
        return NextResponse.json({ success: false, error: "Could not find a logo" }, { status: 404 });

    } catch (error: any) {
        console.error("Logo fetch error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
