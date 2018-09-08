import axios from 'axios'
import {getUserInfoFromToken} from 'assets/js/tokenTools'

export default {
  data: () => ({
    msgLoaded: false,
    msg: {
      //防止ajax之前渲染replyPlaceholder时出错
      author: {
        name: ""
      }
    },
    raw: [],
    noMore: false,
    loadingMoreComments: false,
    page: 0
  }),
  mounted() {
    if (!this.msgLoaded) {
      // console.log("mounted")
      this.loadData()
    }
  },
  watch: {
    '$route'(to, from) {
      // console.log(this.judgePushLevel(to, from) || !this.msgLoaded)
      let pushLevelCorrect = this.judgePushLevel(to, from)
      if ((pushLevelCorrect || !this.msgLoaded)
        && to.name === this.$options.name//进入本组件路由
      ) {
        //先拉白屏
        this.msg = {
          //防止replyPlaceholder出错
          author: {
            name: ""
          }
        }
        this.raw = []
        this.noMore = false
        this.loadingMoreComments = false
        this.page = 0
        this.loadData(pushLevelCorrect)
      }
    }
  },
  methods: {
    judgePushLevel(to, from) {
      let [f, t] = [0, 0];
      //undefined默认代表level0.
      if (from.meta.pushLevel) {
        f = from.meta.pushLevel
      }
      if (to.meta.pushLevel) {
        t = to.meta.pushLevel
      }
      //push顺序没错
      return f < t
    },
    loadData(tryVuex = true) {
      let loadMessage = null
      if (tryVuex && !!this.$store.state.pushRouter.cardItem) {
        //vuex里面存有状态，直接渲染
        this.msg = this.$store.state.pushRouter.cardItem
        loadMessage = Promise.resolve()
      } else {
        //老老实实axios
        console.log("此处应该有ajax", this.$route.query)
        loadMessage = axios({
          url: apiRoot + '/common/message',
          method: "get",
          params: this.$route.query
        }).then((res) => {
          this.msg = res.data.data
          this.msgLoaded = true
        }).catch((err) => {
          console.error(err)
        })
      }
      Promise.all([loadMessage, this.loadComment()]).then(() => {
        //触发一次watch msgLoaded
        this.msgLoaded = false
        this.$nextTick(() => {
          this.msgLoaded = true
        })
      })
    },
    loadComment() {
      let limit = [5, 10];
      //如果是回复列表
      if (this.$route.query.type.toString() === '2') {//query的特殊性
        limit = [10];
      }
      return axios({
        url: apiRoot + "/comment/list",
        method: "get",
        params: {
          ...this.$route.query,
          page: 0,
          limit: limit.toString()
        }
      }).then((res) => {
        if (res.data.code === "FAILED") {
          switch (res.data.message) {
            case "没有评论":
              console.log("糟了，没有评论")
              break
          }
          this.raw = []
          return
        }
        this.raw = res.data.data.raw
      }).catch((err) => {
        console.error(err)
      })
    },
    handleLoadMore() {
      //仅loadMore第二个，即最新评论
      let limit = [0, 10];
      let updateBlockIndex = 1
      //如果是回复列表
      if (this.$route.query.type.toString() === '2') {//query的特殊性
        limit = [10];
        updateBlockIndex = 0;
      }
      let that = this
      if (!this.loadingMoreComments) {
        ++this.page;
        this.loadingMoreComments = true
        axios({
          url: apiRoot + "/comment/list",
          method: "get",
          params: {
            ...that.$route.query,
            page: that.page,
            limit: limit.toString()
          }
        }).then((res) => {
          if (res.data.data.raw[updateBlockIndex].cards.length === 0) {
            // console.log("nomore", res.data.data.raw)
            that.noMore = true
            return
          }
          if (res.data.data.raw.every((raw, index) => (raw.cards.length < limit[index] || !limit[index]))) {
            that.noMore = true
          }
          that.raw[updateBlockIndex].cards = that.raw[updateBlockIndex].cards.concat(res.data.data.raw[updateBlockIndex].cards)
          // console.log(that.raw)
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          //500ms内不要重复ajax
          setTimeout(() => {
            that.loadingMoreComments = false
          }, 500)
        })
      }
    },
    handleComment(content, img, info) {
      let that = this
      axios({
        url: apiRoot + '/comment/newComment',
        method: 'post',
        data: {
          ...info,
          content,
          img: img === "" ? null : img
        }
      }).then((res) => {
        if (res.data.code === 'FAILED') {
          this.$vux.toast.text(res.data.message)
          return
        }
        this.replyName = this.msg.author.name;
        this.replyInfo = this.msg.info;
        (async () => {
          that.noMore = false
          that.page = 0
          await that.loadComment()
          that.$vux.toast.text('评论成功')
        })();

        // //如果是在评论界面回复评论
        // if (info.type.toString() !== this.$route.query.type.toString()) {
        //   for (let block of this.raw) {
        //     let cardIndex = block.cards.findIndex((card) => {
        //       return card.info.type === info.type && card.info.id === info.id
        //     })
        //     let card = block.cards[cardIndex]
        //     if (card.replies.count < 2) {
        //       card.replies.count++
        //       if (!card.replies.representatives) {
        //         card.replies.representatives = []
        //       }
        //       let uinfo = getUserInfoFromToken()
        //       card.replies.representatives.push({
        //         author: {
        //           name: "",
        //           id: uinfo.id
        //         },
        //         content: content,
        //         imgs: img ? [img] : null
        //       })
        //     }
        //   }
        // }
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
