/**
 * Created by Liqiaomiao on 2018/4/12.
 */
import Role from "./role.js"
import menu from "./menu"
var tablist = sessionStorage.getItem("tablist");
var currentbread=localStorage.getItem("currentBread");
if(tablist){
  var tablistval=tablist.split(',');

}
var existedbread=new Map();
if(currentbread){
  var arr=JSON.parse(currentbread);
  for(let item of arr){
    existedbread.set(item[0],item[1])
  }
}

const app={
  state:{
    tabs:sessionStorage.getItem("tablist")?sessionStorage.getItem("tablist").split(','):['首页'],
    tabActive:"0",
    tablist:[],
    currentBread:[],
    breadsList:existedbread,
    Role
  },
  mutations:{
    tablechange(state,value){
      this.state=value
    }
  }
};
export default app;

