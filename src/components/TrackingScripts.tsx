import { useEffect, useRef } from "react";
import { useConfig } from "@/hooks/useConfig";

/**
 * Injects Google Analytics (gtag.js), Google Tag Manager (GTM),
 * and Meta Pixel scripts into the document <head> based on IDs
 * configured in the admin panel (st_config table).
 *
 * Renders nothing visible — only side-effects.
 */
export const TrackingScripts = () => {
  const { data: config } = useConfig();
  const injectedRef = useRef<{ ga?: string; gtm?: string; pixel?: string; head?: string; body?: string }>({});

  // --- Google Analytics (gtag.js) ---
  useEffect(() => {
    const id = config?.google_analytics_id?.trim();
    if (!id || injectedRef.current.ga === id) return;

    // External library
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.async = true;
    script.id = "ga-lib";
    document.head.appendChild(script);

    // Inline config
    const inline = document.createElement("script");
    inline.id = "ga-config";
    inline.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');
    `;
    document.head.appendChild(inline);

    injectedRef.current.ga = id;

    return () => {
      document.getElementById("ga-lib")?.remove();
      document.getElementById("ga-config")?.remove();
      injectedRef.current.ga = undefined;
    };
  }, [config?.google_analytics_id]);

  // --- Google Tag Manager ---
  useEffect(() => {
    const id = config?.gtm_container_id?.trim();
    if (!id || injectedRef.current.gtm === id) return;

    // Head script
    const script = document.createElement("script");
    script.id = "gtm-head";
    script.textContent = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
    `;
    document.head.appendChild(script);

    // Body noscript (iframe fallback)
    const noscript = document.createElement("noscript");
    noscript.id = "gtm-body";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    injectedRef.current.gtm = id;

    return () => {
      document.getElementById("gtm-head")?.remove();
      document.getElementById("gtm-body")?.remove();
      injectedRef.current.gtm = undefined;
    };
  }, [config?.gtm_container_id]);

  // --- Meta (Facebook) Pixel ---
  useEffect(() => {
    const id = config?.meta_pixel_id?.trim();
    if (!id || injectedRef.current.pixel === id) return;

    const script = document.createElement("script");
    script.id = "meta-pixel";
    script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${id}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // noscript fallback pixel image
    const noscript = document.createElement("noscript");
    noscript.id = "meta-pixel-ns";
    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);

    injectedRef.current.pixel = id;

    return () => {
      document.getElementById("meta-pixel")?.remove();
      document.getElementById("meta-pixel-ns")?.remove();
      injectedRef.current.pixel = undefined;
    };
  }, [config?.meta_pixel_id]);

  // --- Custom Head Scripts ---
  useEffect(() => {
    const html = config?.custom_head_scripts?.trim();
    if (!html || injectedRef.current.head === html) return;

    document.getElementById("custom-head")?.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "custom-head";
    wrapper.style.display = "none";

    const temp = document.createElement("div");
    temp.innerHTML = html;
    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const orig = node as HTMLScriptElement;
        const script = document.createElement("script");
        if (orig.src) {
          script.src = orig.src;
          script.async = true;
        } else {
          script.textContent = orig.textContent;
        }
        Array.from(orig.attributes).forEach((attr) => {
          if (attr.name !== "src") script.setAttribute(attr.name, attr.value);
        });
        wrapper.appendChild(script);
      } else {
        wrapper.appendChild(node.cloneNode(true));
      }
    });

    document.head.appendChild(wrapper);
    injectedRef.current.head = html;

    return () => {
      document.getElementById("custom-head")?.remove();
      injectedRef.current.head = undefined;
    };
  }, [config?.custom_head_scripts]);

  // --- Custom Body Scripts ---
  useEffect(() => {
    const html = config?.custom_body_scripts?.trim();
    if (!html || injectedRef.current.body === html) return;

    document.getElementById("custom-body")?.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "custom-body";
    wrapper.style.display = "none";

    const temp = document.createElement("div");
    temp.innerHTML = html;
    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeName === "SCRIPT") {
        const orig = node as HTMLScriptElement;
        const script = document.createElement("script");
        if (orig.src) {
          script.src = orig.src;
          script.async = true;
        } else {
          script.textContent = orig.textContent;
        }
        Array.from(orig.attributes).forEach((attr) => {
          if (attr.name !== "src") script.setAttribute(attr.name, attr.value);
        });
        wrapper.appendChild(script);
      } else {
        wrapper.appendChild(node.cloneNode(true));
      }
    });

    document.body.appendChild(wrapper);
    injectedRef.current.body = html;

    return () => {
      document.getElementById("custom-body")?.remove();
      injectedRef.current.body = undefined;
    };
  }, [config?.custom_body_scripts]);

  return null;
};
