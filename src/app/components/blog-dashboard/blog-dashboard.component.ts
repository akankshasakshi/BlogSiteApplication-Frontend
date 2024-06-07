import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Blogs } from 'src/app/modals/blogs.interface';
import { BlogSiteServiceService } from 'src/app/services/blog-site-service.service';

@Component({
  selector: 'app-blog-dashboard',
  templateUrl: './blog-dashboard.component.html',
  styleUrls: ['./blog-dashboard.component.css']
})
export class BlogDashboardComponent implements OnInit {

  blog: FormGroup;
  displayStyle = "none";
  allBlogs: Blogs[] = [];
  search: string;
  toDate: string;
  fromDate: string;
  activetab = 'all-blogs';
  previousTabName: string;

  constructor(private fb: FormBuilder, private blogSiteService: BlogSiteServiceService) { }

  ngOnInit() {
    this.blog = this.fb.group(
      {
        category: [
          '',
          [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(20)],
        ],
        article: [
          '',
          [
            Validators.required,
            Validators.maxLength(1000),
          ],
        ],
        authorName: ['', [Validators.required]],
        blogName: ['', [Validators.required, Validators.maxLength(20)]],
      },
    );
    this.blogSiteService.getAllBlogs().subscribe((data) => {
      this.allBlogs = data;
    })
  }

  onSubmit() {
    console.log(this.blog.value);
    this.blogSiteService.saveBlogDetails(this.blog.value).subscribe(() => {
      this.closePopup();
      this.activetab = this.previousTabName;
    })
  }

  openPopup(tabName: string) {
    this.displayStyle = "block";
    this.blog.reset();
    this.previousTabName = this.activetab;
    this.activetab = tabName;
  }

  closePopup() {
    this.activetab = this.previousTabName
    this.displayStyle = "none";
  }

  searchBlogs() {
    if (this.search && this.fromDate) {
      if (!this.toDate) {
        this.toDate = new Date().toISOString().split('T')[0];
      }
      this.blogSiteService.searchBlogs(this.search, this.fromDate, this.toDate).subscribe((data) => {
        this.allBlogs = data;
      })
    }
    else {
      this.blogSiteService.searchBlogsByCategory(this.search).subscribe((data) => {
        this.allBlogs = data;
      })
    }
  }

  openTab(tabName: string) {
    this.activetab = tabName;
  }

  refreshData() {
    this.blogSiteService.getAllBlogs().subscribe((data) => {
      this.allBlogs = data;
    })
  }

}
