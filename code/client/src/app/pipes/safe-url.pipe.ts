import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const parsed = this.tryParseUrl(url);

    if (!parsed || !this.isYouTubeHost(parsed.hostname)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    if (parsed.pathname.startsWith('/embed/')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    const embedUrl = this.toYouTubeEmbedUrl(parsed);
    if (embedUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private tryParseUrl(value: string): URL | null {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  }

  private isYouTubeHost(hostname: string): boolean {
    const host = hostname.toLowerCase();
    return host.includes('youtube.com') || host.includes('youtu.be') || host.includes('youtube-nocookie.com');
  }

  private toYouTubeEmbedUrl(url: URL): string | null {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      return null;
    }

    const params = new URLSearchParams();
    const start = this.extractStartSeconds(url);
    const playlist = url.searchParams.get('list');

    if (start !== null) {
      params.set('start', start.toString());
    }
    if (playlist) {
      params.set('list', playlist);
    }
    params.set('rel', '0');

    const base = `https://www.youtube.com/embed/${videoId}`;
    const query = params.toString();

    return query ? `${base}?${query}` : base;
  }

  private extractVideoId(url: URL): string | null {
    const hostname = url.hostname.toLowerCase();

    if (hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '') || null;
    }

    if (hostname.includes('youtube.com') || hostname.includes('youtube-nocookie.com')) {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v');
      }

      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/')[2] || null;
      }

      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/')[2] || null;
      }
    }

    return null;
  }

  private extractStartSeconds(url: URL): number | null {
    const startParam = url.searchParams.get('start') ?? url.searchParams.get('t');
    if (!startParam) {
      return null;
    }

    if (/^\d+$/.test(startParam)) {
      return Number(startParam);
    }

    const match = startParam.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
    if (!match) {
      return null;
    }

    const [, hours, minutes, seconds] = match;
    const totalSeconds =
      (hours ? Number(hours) * 3600 : 0) +
      (minutes ? Number(minutes) * 60 : 0) +
      (seconds ? Number(seconds) : 0);

    return totalSeconds > 0 ? totalSeconds : null;
  }
}



