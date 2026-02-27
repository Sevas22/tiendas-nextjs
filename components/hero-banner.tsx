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
        <div className="absolute inset-0 bg-white" />
      )}
      {image && <div className="absolute inset-0 bg-white/40" />}

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center lg:px-8">
        <div className="w-full max-w-4xl rounded-xl bg-[#00247d] px-6 py-5 md:px-8 md:py-6">
          <div className="mx-auto mb-3 h-1 w-20 bg-[#E0B400] md:mb-4" />
          <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight text-white md:mb-3 md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-white/90">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
