"use client";

import Link from "next/link";
import {  ArrowRight } from "lucide-react";
import { FadeUp } from "./FadeUp";
import { MY_GITHUB_URL, MY_LINKEDIN_URL } from "@/app/utils/consts";

export function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-20  relative overflow-hidden bg-white border-t border-slate-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-100/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-50/60 blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.15]">
              Automate Job Apply .<br />Start Your Work .
            </h2>
            <Link 
              href="/auth/register" 
              className="inline-flex px-10 py-4 rounded-full bg-zinc-600 hover:bg-zinc-700 text-white font-bold text-base transition-all shadow-lg shadow-zinc-200 hover:shadow-zinc-300 hover:-translate-y-1 items-center justify-center gap-3"
            >
              Sign up and Test <ArrowRight size={24} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Actual Footer */}


<footer>
    <div className="mx-auto w-full p-4 py-6 lg:py-8">
        <div className="md:flex max-w-4xl mx-auto md:justify-between">
          <div className="mb-6 md:mb-0">
              <a href="https://krish4.tech" className="flex items-center">
                  <img src="https://avatars.githubusercontent.com/u/122454062?v=4&size=64" className="h-14 me-3" alt="Krishanthan" />
                  <span className="text-heading self-center text-2xl  whitespace-nowrap">Krishanthan</span>
              </a>
          </div>
          <div className="grid  grid-cols-2">
                           <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Follow us</h2>
                  <ul className="mt-11 font-medium text-[13px]">
                      <li className="mb-4">
                          <a href={MY_GITHUB_URL} className="hover:underline " target="_blank" rel="noopener noreferrer">
                              GitHub
                          </a>
                      </li>
                      <li>
                          <a href={MY_LINKEDIN_URL} className="hover:underline" target="_blank" rel="noopener noreferrer">
                              LinkedIn
                          </a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">By the maker of <br/>resume2apply</h2>
                  <ul className=" font-medium text-[13px]">
                      <li className="mb-4">
                          <a href="https://steal-my-idea.krish4.tech/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                              Steal My Idea
                          </a>
                      </li>
                      <li>
                          <a href="https://chromewebstore.google.com/detail/inflgdfcjbcmokdlkcepaapaakhmfnno?utm_source=item-share-cb" className="hover:underline">LinkedOut</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr className="my-6 border-default border-zinc-200 sm:mx-auto lg:my-8" />
       <div className="flex px-10 items-center  justify-between">
          <span className="sm:text-sm text-[12px] text-body sm:text-center">© {new Date().getFullYear()} <a href="https://krish4.tech" className="hover:underline">Krishanthan</a>. All Rights Reserved.
          </span>
          <div className="flex  sm:justify-center ">
       
            <a href={MY_GITHUB_URL} className="text-body hover:text-heading ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd"/></svg>
                <span className="sr-only">GitHub account</span>
            </a>
            <a href={MY_LINKEDIN_URL} className="text-body hover:text-heading ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span className="sr-only">Linkedin account</span>
            </a>
          </div>
      </div>
    </div>
</footer>

    </>
  );
}
