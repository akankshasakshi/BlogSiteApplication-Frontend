import { Component, OnInit } from '@angular/core';
import { Blogs } from 'src/app/modals/blogs.interface';
import { BlogSiteServiceService } from 'src/app/services/blog-site-service.service';

@Component({
  selector: 'view-my-blogs',
  templateUrl: './view-my-blogs.component.html',
  styleUrls: ['./view-my-blogs.component.css']
})
export class ViewMyBlogsComponent implements OnInit {
  myBlogs: Blogs[] = [];
  constructor(private blogSiteService: BlogSiteServiceService) { }

  ngOnInit() {
    this.fetchBlogs();
  }

  deleteBlog(blogName: string) {
    this.blogSiteService.deleteBlog(blogName).subscribe(() => {
      this.fetchBlogs();
    })
  }

  private fetchBlogs() {
    const userName = localStorage.getItem('loginId');
    this.blogSiteService.getMyBlogs(userName).subscribe((data) => {
      this.myBlogs = data;
    });
  }
}
