/**
 * Created by Liqiaomiao on 2018/8/3.
 */

const menu={
  state:{
    menudata:[]
  },
  mutations:{
    handlemenu(state,value){
      state.menudata=value
      console.log('getmenu', state.menudata);
    }
  }

}
export default menu
