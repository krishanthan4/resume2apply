"use client";

import Link from "next/link";
import {  ArrowRight } from "lucide-react";
import { FadeUp } from "./FadeUp";
import { consts } from "@/app/utils/consts";

export function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-white border-t border-slate-100">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-50/60 blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.15]">
              Stop Job Application .<br className="hidden md:block"/>Start Your Work.
            </h2>
            <Link 
              href="/auth/register" 
              className="inline-flex px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 items-center justify-center gap-3"
            >
              Sign up and deploy <ArrowRight size={24} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Actual Footer */}


<footer className="bg-neutral-primary-soft">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <a href="https://krish4.tech" className="flex items-center">
                  <img src="https://avatars.githubusercontent.com/u/122454062?v=4&size=64" className="h-14 me-3" alt="Krishanthan" />
                  <span className="text-heading self-center text-2xl  whitespace-nowrap">Krishanthan</span>
              </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Resources</h2>
                  <ul className="text-body font-medium">
                      <li className="mb-4">
                          <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
                      </li>
                      <li>
                          <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Follow us</h2>
                  <ul className="text-body font-medium">
                      <li className="mb-4">
                          <a href={consts.MY_GITHUB_URL} className="hover:underline " target="_blank" rel="noopener noreferrer">
                              GitHub
                          </a>
                      </li>
                      <li>
                          <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Legal</h2>
                  <ul className="text-body font-medium">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr className="my-6 border-default sm:mx-auto lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-body sm:text-center">© {new Date().getFullYear()} <a href="https://krish4.tech" className="hover:underline">Krishanthan</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
       
            <a href="#" className="text-body hover:text-heading ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clip-rule="evenodd"/></svg>
                <span className="sr-only">GitHub account</span>
            </a>
            <a href="#" className="text-body hover:text-heading ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2a10 10 0 1 0 10 10A10.009 10.009 0 0 0 12 2Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.093 20.093 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM10 3.707a8.82 8.82 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.755 45.755 0 0 0 10 3.707Zm-6.358 6.555a8.57 8.57 0 0 1 4.73-5.981 53.99 53.99 0 0 1 3.168 4.941 32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.641 31.641 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM12 20.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 15.113 13a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clip-rule="evenodd"/></svg>
                <span className="sr-only">Linkedin account</span>
            </a>
          </div>
      </div>
    </div>
</footer>

    </>
  );
}
