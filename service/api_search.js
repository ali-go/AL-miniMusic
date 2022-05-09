import alRequest from "./index"

// 1.获取热门搜索热词
export function getSearchHot() {
  return alRequest.get("/search/hot")
}
// 2.获取搜索建议
export function getSearchSuggest(keywords) {
  return alRequest.get(`/search/suggest`,{
    keywords,
    type:"mobile"
  })
}
// 3.查询歌曲
export function getSearchResult(keywords){
  return alRequest.get("/search",{
    keywords
  })
}