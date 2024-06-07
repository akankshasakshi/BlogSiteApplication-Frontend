export interface CreateBlog {
    category: string;
    article: string;
    authorName: string;
    blogName: string;
}

export interface Blogs {
    article: string;
    authorName: string;
    category: string;
    blogName: string;
    creationTimeStamp: string;
}