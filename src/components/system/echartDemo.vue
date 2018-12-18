<template>
  <div>
    {{values}}
    <div ref="pcicontainer" id="main">

    </div>
    <el-dialog
      title=" 修改票价"
      :visible.sync="dialogVisible"
      append-to-body
      width="500px"
    >
      <el-form ref="form" :model="form" label-width="60px" size="small" class="dialogform1">
        <el-form-item label="上车站">
          <el-input v-model="form.upname" disabled></el-input>
        </el-form-item>
        <el-form-item label="下车站">
          <el-input v-model="form.downname" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let echarts = require('echarts');
  let   myChart,dom;
  // 基于准备好的dom，初始化echarts实例
  let stations = {
    "obj": [{
      "delFlag": 0,
      "id": "b76b6843be194a2d97772d7751dbd3e7",
      "lineCode": "10",
      "lineId": "a45a22158e0f43709b7bba958765bb37",
      "orderNo": 1,
      "stationAlias": "地铁1站",
      "stationId": 201,
      "stationName": "地铁1站",
      "upDown": 1
    }, {
      "delFlag": 0,
      "id": "3417bc231c4e49fca57f6275269c551b",
      "lineCode": "10",
      "lineId": "a45a22158e0f43709b7bba958765bb37",
      "orderNo": 2,
      "stationAlias": "地铁2站",
      "stationId": 202,
      "stationName": "地铁2站",
      "upDown": 1
    }, {
      "delFlag": 0,
      "id": "e47ff28e77ab47c5a334ba1f46ae5ae6",
      "lineCode": "10",
      "lineId": "a45a22158e0f43709b7bba958765bb37",
      "orderNo": 3,
      "stationAlias": "地铁3站",
      "stationId": 203,
      "stationName": "地铁3站",
      "upDown": 1
    }, {
      "delFlag": 0,
      "id": "552cc4b6f2fe40b5be60a53eb5bd727d",
      "lineCode": "10",
      "lineId": "a45a22158e0f43709b7bba958765bb37",
      "orderNo": 4,
      "stationAlias": "地铁4站",
      "stationId": 204,
      "stationName": "地铁4站",
      "upDown": 1
    }, {
      "delFlag": 0,
      "id": "b9d92e6470f1475fa5e820ad77f86761",
      "lineCode": "10",
      "lineId": "a45a22158e0f43709b7bba958765bb37",
      "orderNo": 5,
      "stationAlias": "地铁5站",
      "stationId": 205,
      "stationName": "地铁5站",
      "upDown": 1
    }, {
      "delFlag": 0,
      "id": "079d90db5c22472887ec6be8a8256c16",
      "lineCode": "10",
      "lineId": "a45a22158e0f43709b7bba958765bb37",
      "orderNo": 6,
      "stationAlias": "地铁6站",
      "stationId": 206,
      "stationName": "地铁6站",
      "upDown": 1
    }],
    "status": true
  }
  let pricelist = {
    "obj": [{
      "downId": "079d90db5c22472887ec6be8a8256c16",
      "downNo": "6",
      "isDisabled": 0,
      "price": "4.00",
      "upId": "3417bc231c4e49fca57f6275269c551b",
      "upNo": "2"
    }, {
      "downId": "552cc4b6f2fe40b5be60a53eb5bd727d",
      "downNo": "4",
      "isDisabled": 0,
      "price": "2.00",
      "upId": "3417bc231c4e49fca57f6275269c551b",
      "upNo": "2"
    }, {
      "downId": "b9d92e6470f1475fa5e820ad77f86761",
      "downNo": "5",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "3417bc231c4e49fca57f6275269c551b",
      "upNo": "2"
    }, {
      "downId": "e47ff28e77ab47c5a334ba1f46ae5ae6",
      "downNo": "3",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "3417bc231c4e49fca57f6275269c551b",
      "upNo": "2"
    }, {
      "downId": "079d90db5c22472887ec6be8a8256c16",
      "downNo": "6",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "552cc4b6f2fe40b5be60a53eb5bd727d",
      "upNo": "4"
    }, {
      "downId": "b9d92e6470f1475fa5e820ad77f86761",
      "downNo": "5",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "552cc4b6f2fe40b5be60a53eb5bd727d",
      "upNo": "4"
    }, {
      "downId": "079d90db5c22472887ec6be8a8256c16",
      "downNo": "6",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "b76b6843be194a2d97772d7751dbd3e7",
      "upNo": "1"
    }, {
      "downId": "3417bc231c4e49fca57f6275269c551b",
      "downNo": "2",
      "isDisabled": 0,
      "price": "3.00",
      "upId": "b76b6843be194a2d97772d7751dbd3e7",
      "upNo": "1"
    }, {
      "downId": "552cc4b6f2fe40b5be60a53eb5bd727d",
      "downNo": "4",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "b76b6843be194a2d97772d7751dbd3e7",
      "upNo": "1"
    }, {
      "downId": "b9d92e6470f1475fa5e820ad77f86761",
      "downNo": "5",
      "isDisabled": 0,
      "price": "4.00",
      "upId": "b76b6843be194a2d97772d7751dbd3e7",
      "upNo": "1"
    }, {
      "downId": "e47ff28e77ab47c5a334ba1f46ae5ae6",
      "downNo": "3",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "b76b6843be194a2d97772d7751dbd3e7",
      "upNo": "1"
    }, {
      "downId": "079d90db5c22472887ec6be8a8256c16",
      "downNo": "6",
      "isDisabled": 0,
      "price": "5.00",
      "upId": "b9d92e6470f1475fa5e820ad77f86761",
      "upNo": "5"
    }, {
      "downId": "079d90db5c22472887ec6be8a8256c16",
      "downNo": "6",
      "isDisabled": 0,
      "price": "1.00",
      "upId": "e47ff28e77ab47c5a334ba1f46ae5ae6",
      "upNo": "3"
    }, {
      "downId": "552cc4b6f2fe40b5be60a53eb5bd727d",
      "downNo": "4",
      "isDisabled": 0,
      "price": "3.00",
      "upId": "e47ff28e77ab47c5a334ba1f46ae5ae6",
      "upNo": "3"
    }, {
      "downId": "b9d92e6470f1475fa5e820ad77f86761",
      "downNo": "5",
      "isDisabled": 0,
      "price": "5.00",
      "upId": "e47ff28e77ab47c5a334ba1f46ae5ae6",
      "upNo": "3"
    }],
    "status": true
  };
  let xline = [];
  let yline = [];
  let values = [];

  export default {
    name: "echartDemo",
    data() {
      return {
        dialogVisible: false,
        values: {},
        current: [],
        option:{},
        form: {
          price: '',
          upname: '',
          downname: ''
        }
      }
    },
    methods: {
      setdata(){
        //获取xy轴字段
        xline = stations.obj.map((item, index) => {
          return item.stationAlias
        });
        yline = [].concat(xline).reverse();
        //坐标赋值
        pricelist.obj.forEach((price) => {
          let len = xline.length;
          let y = len - price.downNo;
          let x = price.upNo - 1;
          values.push([x, y, price.price])

        })
      },
      confirm() {
        this.dialogVisible = false;
        this.option.series[0].data=[[0,0,'8.00']];
        this.values.price=this.form.price;
        myChart.clear();
        this.drawPic()
      },
      drawPic(){
        let  that = this;
         setTimeout(()=>{
           myChart.setOption(that.option, true);
         },100)

      }
    },
    mounted() {
      dom = document.getElementById("main");

      myChart = echarts.init(dom);
      let app = {};
      let option = null;
      app.title = '上下行车票价统计';
      this.setdata();

      option={
        tooltip: {
          position: 'top',
            formatter: function (a) {
            let index = xline.indexOf(a.name);
            let yname = yline[index];
            return a.seriesName + '<br/>' + '上车：' + a.name + '<br/>' + '下车：' + yname + '<br>票价：' + Number(a.value[2]).toFixed(2) + '（元）'
          }
        },
        animation: false,
          grid: {
          height: '50%',
            y: '10%'
        },
        xAxis: {
          nameLocation: 'center',
            nameGap: 50,
            name: '上行站',
            type: 'category',
            data: xline,
            splitArea: {
            show: true
          },
          triggerEvent: true
        },
        yAxis: {
          nameLocation: 'center',
            nameGap: 70,
            name: '下行站',
            type: 'category',
            data: yline,
            splitArea: {
            show: true
          }
        },
        visualMap: {
          min: 0,
            max: 5,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        series: [{
          name: '站点信息',
          type: 'heatmap',
          data: values,
          label: {
            normal: {
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      this.option=option;
      if (option && typeof option === "object") {
        this.drawPic()
        myChart.on('click', (params) => {//params =》[x,y,值]
          let upname = params.name;        //上行站名
          let currentval  =  params.value; //下行站名
          let index = currentval[1];
          let downname = yline[index];
          let price = params.value[2];
          this.form = {
            price,
            upname,
            downname
          }
          this.option.series.data=[];
          this.current =params.value;
          this.dialogVisible = true;
          let downid='';
          let upid='';
          stations.obj.forEach((item)=>{
            if(item.stationAlias==downname){
              downid= item.id;
            }
            if(item.stationAlias==upname){
              upid= item.id;
            }
          });
          this.values={
            downname,
            upname,
            downid,
            upid
          }

        });
      }
    },
    updated(){



    }
  }
</script>

<style scoped lang="less">
  #main {
    width: 100%;
    height: 500px;
  }
</style>
