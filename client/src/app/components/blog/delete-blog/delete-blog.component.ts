import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  message;
  messageClass;
  foundBlog =false;
  processing = false;
  blog;
  currentURL;
  constructor(private blogService:BlogService,private activatedRoute:ActivatedRoute, private router:Router) { }


  deleteBlog(){
    this.processing = true;
    this.blogService.deleteBlog(this.currentURL).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentURL = this.activatedRoute.snapshot.params.id;
    console.log(this.currentURL);
    this.blogService.getSingleBlog(this.currentURL).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message
      } else {
        this.blog = {
          title : data.blog.title,
          body : data.blog.body,
          createdBy: data.blog.createdBy,
          createdAt: data.blog.createdAt
        }
        this.foundBlog = true;
      }
    });
  }

}
