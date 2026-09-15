import { Helmet } from 'react-helmet-async'
import { personalInfo } from '@/data/portfolio'

interface SEOProps {
  title?: string
  description?: string
  image?: string
}

export function SEO({
  title = `${personalInfo.name} - ${personalInfo.headline}`,
  description = personalInfo.bio,
  image = '/og-image.png',
}: SEOProps) {
  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* theme-color is intentionally NOT set here — ThemeProvider owns it and
          keeps it in sync with the active palette. */}
      <meta name="keywords" content="frontend developer, angular, typescript, rxjs, scss, web developer, portfolio" />
      <meta name="author" content={personalInfo.name} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content="https://adityakoushal.dev" />
      <meta property="og:site_name" content={personalInfo.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@adityakoushal" />

      {/* Structured JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: personalInfo.name,
          jobTitle: personalInfo.headline,
          description: personalInfo.bio,
          url: 'https://adityakoushal.dev',
          email: personalInfo.email,
          sameAs: [personalInfo.social.linkedin],
        })}
      </script>

      <link rel="canonical" href="https://adityakoushal.dev" />
    </Helmet>
  )
}