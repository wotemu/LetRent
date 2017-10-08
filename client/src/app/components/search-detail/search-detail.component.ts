import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css'],
  providers: [VideoService]
})
export class SearchDetailComponent implements OnInit, OnDestroy {
  private routeSub: any;
  private req: any;
  query: string;
  videoList: [Video];

  constructor(private route: ActivatedRoute, private videoService: VideoService) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.query = params['q'];
      this.req = this.videoService.search(this.query).subscribe((data) => {
        this.videoList = data as [Video];
      });
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
