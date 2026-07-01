import { createContext, useContext, useState } from 'react'

export const COUNTRIES = [
  { code: 'IN',  name: 'India',        dialCode: '+91',  flag: '🇮🇳', currency: 'INR', symbol: '₹',  maxLen: 10 },
  { code: 'KE',  name: 'Kenya',        dialCode: '+254', flag: '🇰🇪', currency: 'KES', symbol: 'KSh', maxLen: 9  },
  { code: 'US',  name: 'USA',          dialCode: '+1',   flag: '🇺🇸', currency: 'USD', symbol: '$',  maxLen: 10 },
  { code: 'GB',  name: 'UK',           dialCode: '+44',  flag: '🇬🇧', currency: 'GBP', symbol: '£',  maxLen: 10 },
  { code: 'AE',  name: 'UAE',          dialCode: '+971', flag: '🇦🇪', currency: 'AED', symbol: 'AED ', maxLen: 9 },
  { code: 'NG',  name: 'Nigeria',      dialCode: '+234', flag: '🇳🇬', currency: 'NGN', symbol: '₦',  maxLen: 10 },
  { code: 'ZA',  name: 'South Africa', dialCode: '+27',  flag: '🇿🇦', currency: 'ZAR', symbol: 'R',  maxLen: 9  },
  { code: 'AU',  name: 'Australia',    dialCode: '+61',  flag: '🇦🇺', currency: 'AUD', symbol: 'A$', maxLen: 9  },
  { code: 'SG',  name: 'Singapore',    dialCode: '+65',  flag: '🇸🇬', currency: 'SGD', symbol: 'S$', maxLen: 8  },
  { code: 'BD',  name: 'Bangladesh',   dialCode: '+880', flag: '🇧🇩', currency: 'BDT', symbol: '৳',  maxLen: 11 },
]

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [countryCode, setCountryCode] = useState(() => {
    const saved = localStorage.getItem('bess_country')
    return saved || 'IN'
  })

  const setCountry = (code) => {
    setCountryCode(code)
    localStorage.setItem('bess_country', code)
  }

  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0]

  return (
    <CurrencyContext.Provider value={{ country, countryCode, setCountry, countries: COUNTRIES }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
