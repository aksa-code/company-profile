"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsItem } from "../../lib/newsService";

interface NewsHeroHeader {
  titleMain: string;
  titleHighlight: string;
  viewAllText: string;
  viewAllLink: string;
}

export default function NewsClientHero({ initialNews, header }: { initialNews: NewsItem[]; header: NewsHeroHeader }) {
  return (
    <section id="news" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white selection:bg-orange-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {header.titleMain} <span className="text-orange-500">{header.titleHighlight}</span>
            </h2>
          </div>
          <div>
            <Link 
              href={header.viewAllLink} 
              className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-xs sm:text-sm transition-colors"
            >
              <span>{header.viewAllText}</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Grid Kartu Berita */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 justify-items-center"
        >
          {initialNews.map((item) => (
            <motion.div 
              key={item.id} 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col w-full max-w-[340px]"
            >
              <div className="relative h-28 sm:h-44 w-full bg-gray-100 overflow-hidden group">
                <Image
                  src={typeof item.image === 'string' && item.image ? item.image : "/images/placeholder.svg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 340px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-orange-500 text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
                  {item.category}
                </span>
              </div>

              <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 mb-1">
                  <span>{item.date}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <Link 
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-[10px] sm:text-xs transition-colors mt-auto"
                >
                  <span>Read More</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}