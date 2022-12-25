<script setup lang="ts">
import { ref, Ref } from "vue";
import { useRouter } from 'vue-router';
import Auto from './Auto';
import type { RecordData } from "./Auto";
import { sleep } from "./utils";
import { useRouteChange } from "./useRouteChange";
const router = useRouter()

let auto = Auto.getInstance()
const isAuto = ref(false)
// const forceClose = ref(false)  //是否强制关闭自动测试
const isExpand = ref(false)  //展开配置项
const isLoop = ref(false)  //是否多样本测试
const pos = ref({
  left: 0,
  top: 100
})
const autoRef = ref() as Ref<HTMLDivElement>
let autoQids = ref('')
let jumpQid = ref('')
let testData = ref<null | RecordData>({ successNum: 0, errorNum: 0 })

const startAutoClick = () => {
  console.log("clicked");
  isAuto.value = !isAuto.value
  isAuto.value ? auto.autoTest() : auto.pauseTest()
}

const handleSpeed = (time: number) => {
  console.log("change speed");

  if (auto) {
    auto.setOptions({ oncetime: time })
  }
}

const touchMove = (e: TouchEvent) => {
  e.preventDefault()
  let touchX = e.targetTouches[0].pageX
  let touchY = e.targetTouches[0].pageY
  if (touchX > 0 && touchY > 0 && touchY < window.innerHeight && touchX < window.innerWidth) {
    pos.value.left = touchX - autoRef.value.offsetWidth / 2
    pos.value.top = touchY - autoRef.value.offsetHeight / 2
  }
}

const handleExpand = (expand: boolean) => {
  isExpand.value = expand
}

const handleAutoQids = async () => {
  isAuto.value = true
  console.log("输入的自动测试qid", isAuto.value);
  let qidList = autoQids.value.split('-')
  auto.autoTestList(qidList)
  isLoop.value = true
}

const jumpQidPage = () => {
  router.push('/guide?qid=' + jumpQid.value)
  jumpQid.value = ''
}

const autoTestPrevWork = async (items: string[]) => {
  await sleep(2000);
  auto.autoTestList(items)
}

useRouteChange((val) => {
  if (val === '/result') {
    if (isLoop.value) {
      let tests = auto.getLoopTests()
      console.log("测试下一个tests", tests);
      let copyTests = [...tests]
      if (copyTests.length) {
        copyTests.shift()
        console.log("测试下一个", copyTests);
        auto.setLoopTests(copyTests)
        autoTestPrevWork(copyTests)
      } else {
        isLoop.value = false
      }
    } else {
      auto.pauseTest()
      isAuto.value = false
    }
  }
  testData.value = auto.getRecordData() as RecordData
  testData.value.successNum += 1
  auto.setRecordData(testData.value)
})
</script>

<template>
  <div ref="autoRef" :style="{ left: pos.left + 'px', top: pos.top + 'px' }" class="fixed  z-50  text-[14px] text-white  text-center bg-green-500 common-shadow w-[100px]  flex-column-center
  rounded-[4px]" @touchmove.stop="touchMove">
    <div @click="startAutoClick" class="leading-[24px]">{{ isAuto ? "PAUSE" : "AUTO" }}</div>
    <div v-if="isExpand">
      <div @click="handleSpeed(1000)">1.x</div>
      <div @click="handleSpeed(500)">2.x</div>
      <input type="text" v-model.trim="autoQids" class="auto-qid-input " placeholder="input qxx-qxx">
      <div @click="handleAutoQids">auto qids</div>
      <input type="text" v-model.trim="jumpQid" class="auto-qid-input " placeholder="input qid">
      <div @click="jumpQidPage">jump qid</div>
      <div>succss: {{ testData?.successNum }}</div>
      <div>error: {{ testData?.errorNum }}</div>
      <div class="text-white text-[12px] leading-[12px]" @click="handleExpand(false)">▲</div>
    </div>
    <div v-else @click="handleExpand(true)" class=" text-white text-[12px] leading-[12px]">▼</div>
  </div>
</template>

<style scoped>
.auto-qid-input {
  width: 100px;
  background: transparent;
  text-decoration: none;
  outline: none;
  text-align: center;
}
</style>
