"use client"

interface HeroBannerProps {
  title: string
  subtitle: string
  image?: string
}

export function HeroBanner({ title, subtitle, image }: HeroBannerProps) {
  return (
    <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden pt-24 pb-10 md:min-h-[360px] md:pt-28 md:pb-12">
      {/* Background - lighter navy for better contrast with header */}
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a3478]" />
      )}
      {image && <div className="absolute inset-0 bg-navy/30" />}

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center lg:px-8">
        <div className="mb-2 flex w-full max-w-7xl justify-center md:mb-3">
          <div className="flex w-full justify-center rounded-xl bg-[#5A7FCC] px-6 py-4 md:px-8 md:py-5">
            <img
              src="/venextrading-logo.png"
              alt="venextrading"
              className="h-20 w-auto max-w-full object-contain [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.4))] sm:h-24 md:h-28 lg:h-32"
            />
          </div>
        </div>
        <div className="w-full max-w-4xl rounded-xl bg-[#5A7FCC] px-6 py-5 md:px-8 md:py-6">
          <div className="mx-auto mb-3 h-1 w-20 bg-gold md:mb-4" />
          <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight text-white md:mb-3 md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-white">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
