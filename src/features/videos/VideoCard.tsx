import { ExternalLink, Play } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import type { PublicVideo } from '@/lib/api/content';
import { getYouTubeId, isHttpsUrl, youTubeEmbedUrl, youTubeThumbnailUrl } from '@/lib/youtube';

export function VideoCard({ video }: { video: PublicVideo }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(video.video_url);

  return (
    <article className="video-card">
      {videoId ? (
        <div className="video-card__frame">
          {playing ? (
            <iframe
              src={youTubeEmbedUrl(videoId)}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button type="button" className="video-card__play" onClick={() => setPlaying(true)}>
              <img src={youTubeThumbnailUrl(videoId)} alt="" loading="lazy" decoding="async" />
              <span className="video-card__icon">
                <Play size={28} aria-hidden="true" />
              </span>
              <span className="visually-hidden">Putar video: {video.title}</span>
            </button>
          )}
        </div>
      ) : null}
      <div className="video-card__body">
        <h2 className="video-card__title">{video.title}</h2>
        {video.description && <p>{video.description}</p>}
        {!videoId && isHttpsUrl(video.video_url) && (
          <ButtonLink href={video.video_url} variant="outline" size="sm" icon={ExternalLink}>
            Buka video
          </ButtonLink>
        )}
      </div>
    </article>
  );
}
