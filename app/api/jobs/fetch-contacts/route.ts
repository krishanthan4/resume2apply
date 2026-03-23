import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { companyName, linkedinPageUrl } = await request.json();
    
    if (!companyName) {
      return NextResponse.json({ success: false, error: "Company name is required" }, { status: 400 });
    }

    let companyQueryTerm = `"${companyName}"`;
    if (linkedinPageUrl) {
      // try to extract company handle if it's a URL
      const match = linkedinPageUrl.match(/linkedin\.com\/company\/([^\/]+)/);
      if (match && match[1]) {
        companyQueryTerm = `"${match[1]}" OR "${companyName}"`;
      }
    }

    // Scrape DuckDuckGo for LinkedIn profiles working at the company with specific roles
    const query = encodeURIComponent(`site:linkedin.com/in (${companyQueryTerm}) ("HR" OR "Human Resources" OR "Recruiter" OR "Talent" OR "Software Engineer" OR "Developer" OR "CTO")`);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${query}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const contacts: any[] = [];
    
    $(".result").each((i, el) => {
      if (contacts.length >= 5) return; // Limit to 5 contacts
      
      const title = $(el).find(".result__title").text().trim();
      const rawUrl = $(el).find(".result__url").text().trim();
      const snippet = $(el).find(".result__snippet").text().trim();
      
      // Clean up title to just get name (often format is "Name - Title - Company | LinkedIn")
      let name = title;
      let role = "Employee";
      
      if (title.includes(" - ")) {
        const parts = title.split(" - ");
        name = parts[0].trim();
        role = parts.length > 1 ? parts[1].trim() : "Employee";
      } else if (title.includes(" | ")) {
        name = title.split(" | ")[0].trim();
      }
      
      // Extract real URL
      const actualUrl = $(el).find(".result__a").attr("href");
      let linkedinUrl = actualUrl && actualUrl.startsWith("//duckduckgo.com/l/?uddg=") 
        ? decodeURIComponent(actualUrl.split("uddg=")[1].split("&")[0]) 
        : `https://${rawUrl}`;

      if (linkedinUrl && linkedinUrl.includes("linkedin.com/in")) {
        contacts.push({
          name,
          role,
          linkedinUrl,
          email: "" // cannot grab email usually from search safely
        });
      }
    });

    return NextResponse.json({ success: true, contacts });
    
  } catch (error: any) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch contacts: " + error.message }, { status: 500 });
  }
}
