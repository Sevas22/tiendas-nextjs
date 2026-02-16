"use client"

interface HeroBannerProps {
  title: string
  subtitle: string
  image?: string
}

export function HeroBanner({ title, subtitle, image }: HeroBannerProps) {
  return (
    <section className="relative flex h-[45vh] min-h-[320px] items-center justify-center overflow-hidden">
      {/* Background */}
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-navy" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/70 to-navy/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div className="mx-auto mb-4 h-1 w-16 bg-gold" />
        <h1 className="mb-4 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
