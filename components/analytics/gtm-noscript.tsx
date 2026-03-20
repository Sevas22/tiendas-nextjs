/**
 * Fallback GTM sin JavaScript (iframe oficial).
 * El script principal va con `<GoogleTagManager />` de `@next/third-parties/google`.
 */
export function GtmNoScript({ gtmId }: { gtmId: string }) {
  if (!gtmId) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
