'use client'

import React, { useState, useEffect, FC } from 'react'

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
}

const CryptoMarketWidget: FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
        )
        if (!response.ok) throw new Error('Failed to fetch crypto data')
        const data = await response.json()
        setCryptoData(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="stripe-marquee-container stripe-loading">
        <div className="stripe-marquee-inner">
          <div className="stripe-marquee-group">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="stripe-crypto-item stripe-skeleton">
                <span className="stripe-crypto-name stripe-skeleton-text"></span>
                <span className="stripe-crypto-price stripe-skeleton-text"></span>
                <span className="stripe-crypto-change stripe-skeleton-text"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stripe-marquee-container stripe-error">
        <div className="stripe-error-content">
          <div className="stripe-error-icon">⚠️</div>
          <div className="stripe-error-message">Market data temporarily unavailable</div>
        </div>
      </div>
    )
  }

  return (
    <div className="stripe-marquee-container">
      <div className="stripe-marquee-inner">
        <div className="stripe-marquee-group">
          {cryptoData.map((crypto) => (
            <div key={crypto.id} className="stripe-crypto-item">
              <span className="stripe-crypto-name">{crypto.name}</span>
              <span className="stripe-crypto-price">${crypto.current_price.toLocaleString()}</span>
              <span className={`stripe-crypto-change ${crypto.price_change_percentage_24h >= 0 ? 'stripe-positive' : 'stripe-negative'}`}>
                {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'}{' '}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        <div className="stripe-marquee-group">
          {cryptoData.map((crypto) => (
            <div key={crypto.id} className="stripe-crypto-item">
              <span className="stripe-crypto-name">{crypto.name}</span>
              <span className="stripe-crypto-price">${crypto.current_price.toLocaleString()}</span>
              <span className={`stripe-crypto-change ${crypto.price_change_percentage_24h >= 0 ? 'stripe-positive' : 'stripe-negative'}`}>
                {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'}{' '}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CryptoMarketWidget