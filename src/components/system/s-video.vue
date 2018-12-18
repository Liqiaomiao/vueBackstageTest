<template>
  <div>
    <video-player class="video-player-box"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"
                  customEventName="customstatechangedeventname"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @waiting="onPlayerWaiting($event)"
                  @playing="onPlayerPlaying($event)"
                  @loadeddata="onPlayerLoadeddata($event)"
                  @canplay="onPlayerCanplay($event)"
    >
    </video-player>
  </div>
</template>

<script>


  export default {

    data() {
      return {
        playerOptions: {
          // videojs options
          muted: true,
          language: 'zh-cn',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          fluid: true,
          // aspectRatio: '16:9',
          sources: [{
            withCredentials: false,
            type: "application/x-mpegURL",
            src: "http://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
          }],
          // poster: require('../../assets/images/one.png'),
          notSupportedMessage: '此视频暂无法播放，请稍后再试',
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          },
        }
      }
    },
    mounted() {
      console.log('this is current player instance object', this.player)
    },
    computed: {
        player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      playerReadied(player) {
        var hls = player.tech({IWillNotUseThisInPlugins: true}).hls
        player.tech_.hls.xhr.beforeRequest = function (options) {
          // console.log(options)
          return options
        }
      },
      onPlayerPlay(players) {
        this.player.requestFullscreen();
        this.player.isFullscreen(true);
      },
      onPlayerPause(players) {
        this.player.exitFullscreen();
        this.player.isFullscreen(false);
      },
      onPlayerEnded(players) {
        this.player.exitFullscreen();
        this.player.isFullscreen(false);
      },
      onPlayerWaiting(player) {
        // console.log(player)
      },
      onPlayerPlaying(player) {
        // console.log(player)
      },
      onPlayerLoadeddata(player) {
        this.player.requestFullscreen();
        this.player.isFullscreen(true);
        // console.log(player)
      },
      onPlayerCanplay(player) {
        this.player.exitFullscreen();
        this.player.isFullscreen(false);
      }
    },
    beforeDestroy() {
      this.$refs.videoPlayer.$destroy()
    }
  }

</script>

<style>
  .video-player-box .video-js .vjs-big-play-button {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
