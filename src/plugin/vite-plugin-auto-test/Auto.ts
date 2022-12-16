/**
 * e2e用于端对端自动化测试
 */
 import { sleep, getRandomNum } from './utils';
 import { useRouter } from 'vue-router';
 const router = useRouter()

 function jumpGuidePage(str: string) {
   router.push('/guide?qid=' + str);
 }
 
 interface AutoOptions {
   oncetime: number; // 每点击一次延迟
   nextPageTime: number; // 跳转页面延迟
   canBackPage: boolean; // 是否可以跳转上一页面
   prevPageClassName: 'test-action-prev'; // 返回上一页的查询类名
   nextPageClassName: 'test-action-next'; // 返回下一页的查询类名
   randomTextList: string[]; //随机文本的list
 }
 
 export interface RecordData {
   successNum: number;
   errorNum: number;
 }
 
 export default class Auto {
   private isPause: boolean = false;
   private list: string[] = [];
   private loopTests: string[] = [];
   private recordData: RecordData = {
     successNum: 0,
     errorNum: 0,
   };
   static instance: any;
 
   private options: AutoOptions = {
     oncetime: 1000,
     nextPageTime: 1000,
     canBackPage: false,
     prevPageClassName: 'test-action-prev',
     nextPageClassName: 'test-action-next',
     randomTextList: ['test111111', 'test22222', 'test3333'],
   };
 
   constructor(initOptions?: AutoOptions) {
     if (initOptions) {
       this.options = initOptions;
     }
   }
 
   public setOptions(customOptions: AutoOptions) {
     this.options = { ...this.options, ...customOptions };
   }
 
   public getRecordData() {
     return this.recordData;
   }
   public setRecordData(data: RecordData) {
     this.recordData = data;
   }
   public getLoopTests() {
     return this.loopTests;
   }
   public setLoopTests(data: any) {
     this.loopTests = data;
   }
 
   public static getInstance(options?: any) {
     if (!this.instance) {
       this.instance = options ? new Auto(options) : new Auto();
     }
     return this.instance;
   }
   public async autoTestList(tests: string[]) {
     this.loopTests = tests;
     if (!tests.length) return;
     jumpGuidePage(this.loopTests[0]);
     await sleep(1000);
     //点击开始问卷
     let openDOM = document.getElementById('test-open');
     openDOM?.click();
 
     await sleep(1000);
     this.autoTest();
   }
   public autoTest() {
     this.isPause = false;
     this.list = [];
     this.autoCompleteTask();
   }
   public pauseTest() {
     this.isPause = true;
     this.list = [];
   }
   public filterList() {
     let typeList = ['circle', 'star', 'square', 'squares', 'c1', 'M1'];
     for (const type of typeList) {
       this.filterType(type);
     }
   }
   public filterType(type: string) {
     const { canBackPage, prevPageClassName } = this.options;
     if (!canBackPage) {
       this.list = this.list.filter((item) => item !== prevPageClassName);
     }
     //处理star
     let circleList = this.list.filter((item: string) => item.includes(type));
     let circleTypeSet = new Set();
     circleList.forEach((item: any) => {
       let k = item.split('-')[2];
       circleTypeSet.add(k);
     });
     let circleTypeList = Array.from(circleTypeSet);
     let randomList: string[] = [];
     //每个组件随机选中同组件的唯一id选择
     circleTypeList.forEach((type: any) => {
       //当前组件的所有同类型的id
       let compoentList = circleList.filter((item) => item.includes(type));
       //随机的id
       let selectItem = compoentList[getRandomNum(compoentList.length - 1)];
       randomList.push(selectItem);
     });
     let filterList = circleList
       .concat(randomList)
       .filter((item) => !randomList.includes(item));
 
     this.list = this.list.filter((item) => !filterList.includes(item));
   }
   public async autoTask(): Promise<void | undefined> {
     const { nextPageTime, oncetime, nextPageClassName, randomTextList } =
       this.options;
 
     for (const item of this.list) {
       if (this.isPause) return;
       await sleep(oncetime);
       if (item.includes('test-action')) {
         if (item === nextPageClassName) {
           await sleep(oncetime);
           let dom = document.getElementById(item);
           dom && dom.click();
           console.log(item, '下一步');
           setTimeout(() => {
             //下一页面处理自动点击
             this.autoTest();
           }, nextPageTime);
           return;
         }
       } else {
         let dom = document.getElementById(item) as any;
         // 根据组件类别随机点击
         dom && dom.click();
         console.log(item, 'clicked');
         if (item.includes('text')) {
           let ranNum = getRandomNum(randomTextList.length - 1);
           //textarea輸入
           dom && this.setNativeValue(dom, randomTextList[ranNum]);
           console.log(item, 'text inputed');
         }
       }
     }
   }
   public setNativeValue(dom: HTMLTextAreaElement, st: string): void {
     if (!dom) return;
     window.inputValue = function (dom: HTMLTextAreaElement, st) {
       var evt = new InputEvent('input', {
         inputType: 'insertText',
         data: st,
         dataTransfer: null,
         isComposing: false,
       });
       dom.value = st;
       dom.dispatchEvent(evt);
     };
     window.inputValue(dom, st);
   }
   /**
    * 自动测试的前置工作
    */
   public autoCompleteTask(): void {
     if (this.isPause) return;
 
     let domNode: any = document.querySelectorAll('*');
 
     for (const iterator of domNode) {
       if (/^test/gi.test(iterator.id)) {
         this.list.push(iterator.id);
       }
     }
     this.list = [...new Set(this.list)];
 
     this.filterList();
 
     //第一页有意愿购买导致后面多一题文本输入
     let findIndex = this.list.findIndex((item) => {
       return item.includes('test-text-2.5');
     });
     if (findIndex > -1) {
       this.list.splice(findIndex, 0, 'test-text-2.4');
     }
     //如果M1输入文本或按钮，那么M2自动输入
     let findIndex2 = this.list.findIndex((item) => {
       return item.includes('test-m1text-10.3') || item.includes('test-M1');
     });
     if (findIndex2 > -1) {
       this.list.splice(findIndex2 + 1, 0, 'test-text-10.4');
     }
 
     console.log('all text classNames', this.list, this.list.length);
 
     //开始自动化
     this.autoTask();
   }
 }
 