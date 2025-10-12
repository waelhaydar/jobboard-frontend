'use client'

import React from 'react'
import Image from 'next/image'

interface EmployerProfileCardProps {
  employer: {
    companyName: string;
    email: string;
    imageUrl?: string | null;
    about?: string | null;
  };
}

export default function EmployerProfileCard({ employer }: EmployerProfileCardProps) {
  const displayText = employer.about ? employer.about.split('\n\n')[0] : null

  return (
    <div className="glass-dark p-6 ">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
        About {employer.companyName}
      </h2>

      <div className="flex items-center mb-6">
        <div className="relative w-20 h-20 mr-4">
          {employer.imageUrl && !employer.imageUrl.includes('loremflickr') ? (
            <Image
              src={employer.imageUrl}
              alt={`${employer.companyName} logo`}
              width={80}
              height={80}
              className="object-cover rounded-xl"
              onError={(e) => {
                e.currentTarget.src = '/default-company-logo.png'
              }}
            />
          ) : (
            <Image
              src="/default-company-logo.png"
              alt={`${employer.companyName} logo`}
              width={80}
              height={80}
              className="object-cover rounded-xl"
            />
          )}
        </div>

        <div>
          <p className="text-xl font-semibold text-white">{employer.companyName}</p>
          <p className=" text-sm text-gray-400">{employer.email}</p>
        </div>
      </div>

      {employer.about && (
        <div className="mt-4 p-4 bg-black/20 rounded-xl">
          <p className="leading-relaxed text-gray-300">{displayText}</p>
          {employer.about.split('\n\n').length > 1 && (
            <button className="secondaryButton-dark">
              Read more...
            </button>
          )}
        </div>
      )}
    </div>
  );
}
