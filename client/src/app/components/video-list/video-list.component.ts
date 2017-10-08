import { Component, OnInit, OnDestroy } from '@angular/core';
import { Video } from '../../models/video';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit, OnDestroy {
  private req: any;
  title = 'Video List';
  videoList: [Video];

  constructor(private videoService: VideoService) {
  }

  ngOnInit() {
    // this.todayDate = new Date()
    this.req = this.videoService.list().subscribe((data) => {
      this.videoList = data as [Video];
    });
  }

  ngOnDestroy() {
    this.req.unsubscribe();
  }
}
