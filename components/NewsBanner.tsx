'use client'

import { useState, useEffect, useRef } from 'react'

export default function NewsBanner() {
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)

  const newsItemsRef = useRef(newsItems);
  const currentNewsIndexRef = useRef(currentNewsIndex);

  useEffect(() => {
    newsItemsRef.current = newsItems;
  }, [newsItems]);

  useEffect(() => {
    currentNewsIndexRef.current = currentNewsIndex;
  }, [currentNewsIndex]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news')
        const data = await res.json()
        if (Array.isArray(data)) {
          setNewsItems(data)
        } else {
          setNewsItems([])
        }
      } catch (error) {
        console.error('Error fetching news:', error)
        setNewsItems([])
      }
    }

    fetchNews()

    const interval = setInterval(() => {
      const latestNewsItems = newsItemsRef.current;
      const latestCurrentNewsIndex = currentNewsIndexRef.current;

      if (latestNewsItems.length === 0) {
        setCurrentNewsIndex(0);
        return;
      }
      setCurrentNewsIndex((latestCurrentNewsIndex + 1) % latestNewsItems.length);
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative text-white text-center py-3 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-1 rounded-full">
            <span className="text-cyan-400 text-sm font-semibold">📢</span>
            <span className="text-cyan-400 text-xs font-medium">NEWS</span>
          </div>
          {newsItems.length > 0 ? (
            <>
              <p className="text-sm font-medium text-white animate-pulse">
                {newsItems[currentNewsIndex]?.title}: {newsItems[currentNewsIndex]?.content}
              </p>
              <div className="flex gap-1">
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentNewsIndex(index)}
                    className="w-2 h-2 rounded-full bg-cyan-400"
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm font-medium text-white">
              Welcome to our Job Board! Check back for news and updates.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}