export default {
  data: () => ({
    cards: [{
      info: {
        type: 5,
        id: 1
      },
      content: "在公交车上站不动的老年人，免费发礼品时候都能冲刺",//文本消息
      photos: [""],//评论最多有一个图片
      author: {
        id: 10048,
        avatar: "https://avatars2.githubusercontent.com/u/30586220?s=460&v=4",
        name: "Sakura坠"
      },
      publishTime: "2018-08-26T15:15:04",
      like: 365,
      replies: {
        count: 15,
        representatives: [{//count大于等于2时最多两条
          author: {
            id: 10015,
            name: "怼图小姐姐扩列"
          },
          content: "中国大妈会让他们知道什么叫恐惧。。。真的。。。",
          photos: null
        }, {
          author: {
            id: 10016,
            name: "我来说句公道话"
          },
          content: "那些人还会觉得:既然免费送还花钱买，真傻。。这是一条超长评论这是一条超长评论这是一条超长评论这是一条超长评论",
          photos: [""]//评论最多有一个图片
        }]
      }
    }, {
      info: {
        type: 5,
        id: 1
      },
      content: "在公交车上站不动的老年人，免费发礼品时候都能冲刺",//文本消息
      photos: [""],//评论最多有一个图片
      author: {
        id: 10048,
        avatar: "https://avatars2.githubusercontent.com/u/30586220?s=460&v=4",
        name: "Sakura坠"
      },
      publishTime: "2018-08-26T15:15:04",
      like: 365,
      replies: {
        count: 15,
        representatives: [{//count大于等于2时最多两条
          author: {
            id: 10015,
            name: "怼图小姐姐扩列"
          },
          content: "中国大妈会让他们知道什么叫恐惧。。。真的。。。",
          photos: null
        }, {
          author: {
            id: 10016,
            name: "我来说句公道话"
          },
          content: "那些人还会觉得:既然免费送还花钱买，真傻。。",
          photos: [""]//评论最多有一个图片
        }]
      }
    }]
  })
}
