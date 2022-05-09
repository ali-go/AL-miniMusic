// 关于歌曲排行的状态存储
import {
  HYEventStore
} from "hy-event-store";
import {
  getRankings
} from "../service/api_music";

// 榜单idx和数据存储的映射关系
const RANKING_MAP = {
  0: "upRanking",
  1: "hotRanking",
  2: "newRanking",
  3: "originRanking"
};

const rankingStore = new HYEventStore({
  state: {
    upRanking: {}, //飙升歌曲 0
    hotRanking: {}, //热门歌曲 1
    newRanking: {}, //新歌歌曲 2
    originRanking: {}, //原创歌曲 3
  },
  actions: {
    // 1.获取榜单歌曲的数据
    getRankingDataAction(ctx, payload) {
      // 0 飙升 1 热门 2新歌 3原创
      for (let i = 0; i < 4; i++) {
        getRankings(i).then(res => {
          ctx[RANKING_MAP[i]] = res.playlist;
        })
      }
    }
  }
})

export {
  rankingStore,
  RANKING_MAP
}