import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { LoginCredentials } from '../modals/login-credentials.interface';
import { RegisterUser } from '../modals/register-user.interface';
import { Blogs, CreateBlog } from '../modals/blogs.interface';

const httpOptions1 = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class BlogSiteServiceService {
  private readonly baseUrl = 'http://localhost:8081/api/v1.0/blogsite/users';
  private readonly blogUrl = 'http://localhost:8081/api/v1.0/blogsite/blogs';
  loggedIn: boolean;
  constructor(private httpClient: HttpClient) { }

  checkUserCredentials(value: LoginCredentials): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, value)
      .pipe(catchError(this._handleError));;
  }

  public storeUserData(
    username: string,
    authorization: string
  ) {
    localStorage.setItem("loginId", username);
    localStorage.setItem("authorization", authorization);
  }

  public logout() {
    localStorage.removeItem("loginId");
    localStorage.removeItem("authorization");
  }

  public getToken() {
    return this.httpClient
      .get(`${this.baseUrl}/jwt/authentication`)
      .pipe(map((data1) => (data1 = JSON.parse(JSON.stringify(data1)))))
      .pipe(catchError(this._handleError));;
  }

  public register(userInfo: RegisterUser): Observable<any> {
    return this.httpClient
      .post(this.baseUrl + "/register", userInfo, httpOptions1)
      .pipe(catchError(this._handleError));
  }

  public isLoggedIn() {
    if (localStorage.getItem("loginId")) {
      return true;
    } else {
      return false;
    }

  }

  public saveBlogDetails(blogDetails: CreateBlog): Observable<any> {
    const blog = {
      article: blogDetails.article,
      authorName: blogDetails.authorName,
      category: blogDetails.category,
    }
    const token = localStorage.getItem("authorization");
    return this.httpClient.post(`${this.baseUrl}/blogs/add/${blogDetails.blogName}`, blog, {
      headers: {
        Authorization: token,
        userName: localStorage.getItem("loginId"),
      },
    }).pipe(catchError(this._handleError));;
  }

  public getAllBlogs(): Observable<Blogs[]> {
    return this.httpClient.get<Blogs[]>(`${this.baseUrl}/getall`);
  }

  public searchBlogs(category: string, fromDate: string, toDate: string): Observable<Blogs[]> {
    return this.httpClient.get<Blogs[]>(`${this.blogUrl}/get/${category}/${fromDate}/${toDate}`)
      .pipe(catchError(this._handleError));;
  }

  public searchBlogsByCategory(category: string): Observable<Blogs[]> {
    return this.httpClient.get<Blogs[]>(`${this.blogUrl}/info/${category}`)
      .pipe(catchError(this._handleError));;
  }

  public getMyBlogs(userName: string): Observable<Blogs[]> {
    return this.httpClient.get<Blogs[]>(`${this.baseUrl}/get/${userName}`)
      .pipe(catchError(this._handleError));;
  }

  public deleteBlog(blogName: string): Observable<any> {
    const token = localStorage.getItem("authorization");
    return this.httpClient.delete(`${this.baseUrl}/delete/${blogName}`, {
      headers: {
        Authorization: token,
        userName: localStorage.getItem("loginId"),
      },
    }).pipe(catchError(this._handleError));
  }

  public _handleError(error: any) {
    const err = {} as any;
    if (error.error instanceof ErrorEvent) {
      err.message = error.error.message;
      err.type = error.error.type;
      err.status = error.error.status;
    } else {
      err.message = error.message;
      err.status = error.response ? error.response.status : error.status;
      const { data } = error.response ? error.response : error;
      if (data) {
        err.data = data;
      }
    }
    return throwError(err);
  }
}
