<template>
  <div>
    <h1>具名插槽</h1>
    <my-component>
      <h1 slot="header">child:具名插槽将匹配内容片段中有对应 slot 特性的元素</h1>

      <p>匿名插槽，它是默认插槽，作为找不到匹配的内容片段的备用插槽</p>
      <p>如果没有默认插槽，这些找不到匹配的内容片段将被抛弃。</p>

      <p slot="footer">我是具名插槽：slot='footer'</p>
    </my-component>
    <br>
    -----------------------------------------------------------------------------------------------------------
    <scope-slot>
      <template slot-scope="props">
        <h1>作用域插槽:hello form parent</h1>
        <br>
        <ul>
          <li>在父级中，具有特殊特性 slot-scope 的 < template> 元素必须存在，表示它是作用域插槽的模板</li>
          <li>eg:< template slot-scope="props"></li>
          <li>通过prop.子组件属性 获取子组件数据</li>
        </ul>
        <br>
        <span>children:{{ props.text }}:{{props.data}}</span>
      </template>
    </scope-slot>
    -------------------------------------------------------------------------------------------------------------
    <self-define>
      <!-- 作用域插槽也可以是具名的 -->
      <li
        slot="item"
        slot-scope="props"
        class="my-fancy-item">
        {{ props.text }}
      </li>

    </self-define>
  </div>
</template>
<style>


</style>
<script>
  //具名插槽
  var Child = {
    template:`
       <div class="container">
        <header>
          <slot name="header"></slot>
        </header>
        <main>
          <slot></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
`
  }

  //作用域插槽
  var scopeSlot={
    template:`
    <div class="child">
      <slot :text=this.text :data=this.data></slot>
    </div>
    `,
    data(){
      return{
        text:'子',
        data:'child data'
      }
    }
  }

  //自定义
  var selfdefine={
    template:`
      <ul>
        <slot name="item"
          v-for="item in items"
          :text="item.text"></slot>

      </ul>
      `,
    data(){
      return{
        items:[{text:'自定义测试'},{text:'自定义测试1'}]
      }
    }

  }


  export default{
    data(){
      return {
        text:'作用域插槽',
        parentitems:[{text:'from parent data'},{text:'dsfsdfdsf'}]
      }
    },
    components:{
      'my-component':Child,
      'scope-slot':scopeSlot,
      'self-define':selfdefine
    }
  }
</script>
