<template>
  <div>
    <el-tabs type="card" v-model="currentIndex" @tab-remove="handleRemove" @tab-click="handleSelect">
      <el-tab-pane v-for="(item,index) in tabs"
                   :label="item"
                   :closable="index==0?false:true"
                   :name="index.toString()"
                   :key="`tabname_${index}`"
      ></el-tab-pane>


    </el-tabs>

  </div>

</template>
<style>


</style>
<script>
  export default {
    name: 'tabs',
    data() {
      return {
        token: '',
        currentIndex: ''
      }
    },
    mounted() {
    },

    updated() {
      //用于404返回的情况，返回页不能触发watch，但会有updated；因此再次赋值切签的高亮；
      this.currentIndex = this.tabActive;
    },
    methods: {
      handleRemove(index) {
        let tabs = this.tabs;
        let tabActive = this.currentIndex;
        let nextIndex;
        if (index === tabActive) {//被删除项为当前高亮的
          if (tabs.length - 1 == index) {//没有后面的，给前面，-1
            nextIndex = (parseInt(index) - 1)
          } else {//有后面的，把自己的高亮值 给后面的
            nextIndex = parseInt(index);
          }
        } else {
          if (parseInt(index) < parseInt(tabActive)) {//删前面的项，自己的高亮-1
            nextIndex = parseInt(tabActive) - 1;
          } else {
            nextIndex = parseInt(tabActive) //删后面，自己的高亮不变
          }
        }
        tabActive = nextIndex;
        tabs = tabs.filter(function (item, key) {
          return key != index;
        });
        this.currentIndex = tabActive.toString();   //新的高亮值；

          var currentRouteName = tabs[parseInt(this.currentIndex)]; //路由切换
          this.$router.push({
            name: currentRouteName
          });
        if( index== tabs.length){//当前页为最后一个 高亮给前一个
          this.$emit('active',(index-1).toString() )
        }else{  //当前页为中间 一个  高亮给最后一个
          this.$emit('active',index)
        }


        this.$emit('tabchange',tabs)

      },
      handleSelect(index) {//选中切签路由更改；
        let tabs = Array.from(this.tabs);
        let currentIndex = tabs[index.name];
        this.$emit('active',index.name)
        this.$router.push({
          name: currentIndex
        });
      }
    },
    computed: {},
    watch: {
      tabActive(value) {
        this.currentIndex = this.tabActive   //由于子组件不允许更改tabActive的值，所以将值赋给currentIndex
      },
    },
    props: ['tabActive', 'tabs']

  }
</script>
