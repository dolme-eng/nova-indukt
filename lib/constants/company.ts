export const COMPANY = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'NOVA INDUKT GmbH',
  nameShort: 'NOVA INDUKT',
  street: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_STREET || 'Berliner Straße 42',
  zip: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_ZIP || '10115',
  city: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_CITY || 'Berlin',
  country: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_COUNTRY || 'Deutschland',
  countryShort: 'DE',

  email: {
    info: process.env.NEXT_PUBLIC_EMAIL_INFO || 'info@nova-indukt.de',
    support: process.env.NEXT_PUBLIC_EMAIL_SUPPORT || 'support@nova-indukt.de',
    datenschutz: process.env.NEXT_PUBLIC_EMAIL_DATENSCHUTZ || 'datenschutz@nova-indukt.de',
    widerruf: process.env.NEXT_PUBLIC_EMAIL_WIDERRUF || 'widerruf@nova-indukt.de',
    kontakt: process.env.NEXT_PUBLIC_EMAIL_KONTAKT || 'kontakt@nova-indukt.de',
    newsletter: process.env.NEXT_PUBLIC_EMAIL_NEWSLETTER || 'newsletter@nova-indukt.de',
    noreply: process.env.NEXT_PUBLIC_EMAIL_NOREPLY || 'noreply@nova-indukt.de',
    admin: process.env.NEXT_PUBLIC_EMAIL_ADMIN || 'admin@nova-indukt.de',
  },

  phone: {
    number: process.env.NEXT_PUBLIC_PHONE || '+49 30 12345678',
    numberRaw: process.env.NEXT_PUBLIC_PHONE_RAW || '493012345678',
  },

  whatsapp: {
    url: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/493012345678',
    message: 'Hallo NOVA INDUKT Team,',
  },

  website: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://nova-indukt.de',

  social: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://facebook.com/novaindukt',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://instagram.com/novaindukt',
  },

  legal: {
    registergericht: 'Amtsgericht Berlin-Charlottenburg',
    registernummer: 'HRB 219847',
    ustIdNr: 'DE328745691',
    geschaeftsfuehrer: 'Thomas Weber',
    datenschutzbeauftragter: 'Thomas Weber',
  },

  logistics: {
    street: 'Logistikstraße 45',
    zip: '10115',
    city: 'Berlin',
  },

  hours: {
    weekdays: 'Mo - Fr 09:00 - 18:00 Uhr',
    saturday: 'Samstag 10:00 - 14:00 Uhr',
    combined: 'Mo-Fr: 09:00 - 18:00 Uhr | Sa: 10:00 - 14:00 Uhr',
  },

  team: [
    {
      name: 'Thomas Weber',
      role: 'Geschäftsführer',
      description: 'Leitet das strategische Geschäft und die Produktentwicklung.',
    },
    {
      name: 'Anna Schmidt',
      role: 'Leitung Produktentwicklung',
      description: 'Verantwortlich für Design und Innovation unserer Produkte.',
    },
    {
      name: 'Laura Müller',
      role: 'Leitung Kundenservice',
      description: 'Ihre Ansprechpartnerin für alle Fragen rund um Ihre Bestellung.',
    },
  ],
} as const

export type CompanyType = typeof COMPANY
