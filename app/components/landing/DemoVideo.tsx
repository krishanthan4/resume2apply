"use client";
import { DEMO_VIDEO_URL } from "@/app/utils/consts";
import {motion} from "framer-motion";
import Image from "next/image";

function DemoVideo() {
  return (
    <div > 
    <Image src={"/walkthough_text_image.png"} alt="" width={250} height={100} className="object-cover md:-mt-10 -mt-20 mr-40 md:scale-[100%] scale-[80%]" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >  
          {/* Video */}
          <div className="max-w-4xl mx-auto md:h-[85vh] h-[55vh] w-full rounded-xl overflow-hidden border-double border-stone-800 border-8 z-0 mb-10">
            <iframe
              width="100%"
              height="100%"
              src={DEMO_VIDEO_URL}
              title="resume2apply demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              draggable={false}
            />
          </div>

        </motion.div>
      </div>
  )
}

export default DemoVideo