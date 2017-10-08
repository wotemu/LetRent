import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css'],
  providers: [VideoService]
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  private routeSub: any;
  private req: any;
  video: Video;
  slug: string;
  errorStr: Boolean;

  constructor(private route: ActivatedRoute, private router: Router, private _video: VideoService) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      this.req = this._video.get(this.slug).subscribe((data) => {
          this.video = data as Video;
        },
        (error) => this.errorStr = error
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.req.unsubscribe();
  }

  getEmbedUrl(item) {
    return 'https://www.youtube.com/embed/' + item.embed + '?ecver=2';
  }

}
