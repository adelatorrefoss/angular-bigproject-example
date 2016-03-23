'use strict';

class CommentService {
  constructor(bpHttpService) {
    this.bpHttpService = bpHttpService;

    this.comments = [];
  }

  fetchComments() {
//    return this.bpHttpService.get('/comments',{params:{id:1,color:'red'}})
    return this.bpHttpService.get('/comments',{params:{otherid:1,color:'red'}})
      .then(data => {
        this.comments = data;
        return this.comments;
      })
      .catch(error => {
        throw(error);
      });
  }
}

angular.module('bp.comment')
  .service('bpCommentService', CommentService);
