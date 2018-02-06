<template>
  <v-layout>
    <v-flex>
      <!-- <div v-html="html"></div> -->
      <iframe style="width: 100%; height: 100%" src="/s/rJfBzYr8M" frameborder="0"></iframe>
    </v-flex>
  </v-layout>
</template>

<script>
import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
const md = MarkdownIt()
export default {
  async asyncData ({ params, app }) {
    // const note = await app.$axios.$post('/remark/get-note', { id: params.id })
    const note = await mock()
    const content = fm(JSON.parse(note.content))
    const html = md.render(content.body)
    return {
      note: note,
      html: html,
      attributes: content.attributes
    }
  }
}

function mock () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        'status': 0,
        'msg': 'String',
        'shortid': 'String',
        'alias': 'String',
        'permission': 'String',
        'viewcount': 1,
        'title': 'title',
        'content': '"---\\ntitle: Portal 新報價調整\\n# description: Portal 新報價調整\\ntags: portal, billing\\ndisqus: hackmd-4\\n---\\n\\n# Portal 新報價調整\\n\\n[toc]\\n\\n-------\\n\\n## manager billing setting\\n\\n1. 設定 billing\\n    - **設定之後下個月生效**\\n    - **若帳號未開通，設定之後立刻生效**\\n    - **例外：「舊報價 -> 舊報價」，設定之後立刻生效**\\n    - **如果「新報價 --> 舊報價」，目前是可以的，而且會立即生效**\\n    - 生效方式實作方式：\\n        - 下個月生效：更新 user.next_month_fee\\n        - 立即生效：更新 user.next_month_fee 與 user.fee\\n        - checkout 時，會將 user.fee = user.next_month_fee 以使設定生效\\n    - 新報價會把選擇的 plan，轉換成:\\n        ```javascript\\n        {\\n            is_new: true,\\n            amount_fee: 0,\\n            remembercard_fee: 0,\\n            plan: {{ 選擇的 plan }},\\n            transaction_fee: {\\n                \'0\': {{ plan 對應的月費 }}\\n            },\\n            each_transaction_fee: {{ plan 對應的交易手續費 }}\\n        }\\n        ```\\n2. 設定「銷售稅計算方式」\\n    - **設定之後立即生效**\\n    - 新報價才可以使用\\n    - 設定 user.add_tax_override 與 user.add_tax_override_value\\n\\n\\n## Portal billing 顯示（新報價）\\n\\n- billing-history\\n    - 基本月費：check.monthly_fee\\n    - 交易手續費：\\n    ```\\n        Math.round(check.transaction_times * check.each_transaction_fee)\\n        ```\\n    - 銷售稅（如果 check.add_tax === true 才有）：\\n        ```\\n        Math.round((基本月費 + 交易手續費) * 0.05)\\n        ```\\n    - 總計：基本月費 + 交易手續費 + 銷售稅\\n- billing-estimate\\n    - 基本月費 - `transaction_fee[\'0\']`\\n        - 如果未滿一個月「依照當月比例計算」\\n    - 交易手續費\\n    - 銷售稅 - 如果沒綁卡，或者 override (User.add_tax_override)\\n    - 總計 - 基本月費 + 交易手續費\\n\\n## auto checkout\\n\\n1. 幫所有 active 的用戶，產生前個月的帳單\\n2. 使用 `/tpc/pm/getbillinghistory` 和 prod mainserver 取得交易紀錄\\n    - 查詢時間區間：\\n        - start: 上個月的第一 millis\\n        - end: 上個月的最後一 millis\\n    - 查詢到的資料會存到 check 的這三個欄位，欄位分別是：(mongo - api)\\n        - remembercard_times - remembercardtimes\\n        - amount - tradeamount\\n        - transaction_times - tradecount\\n3. 將 user.fee 的以下設定存到 check 裡\\n    - is_new\\n    - each_transaction_fee\\n    - plan\\n    - amount_fee\\n    - remembercard_fee\\n    - transaction_fee\\n4. 如果是新報價\\n    1. monthly_fee\\n        - 如果帳號開通未滿一個月，會依照比例計算\\n            - 假設 12/29 開通 C 方案，12 月的月費：6000 * 3 / 31\\n        - 否則使用方案設定（ `fee.transaction_fee[\'0\']` ）\\n    2. monthly_fee_start_date - monthly_fee 計算的起始日期\\n        - 假設 12/29 開通，monthly_fee_start_date = 29\\n        - 若不是這個月才開通，為 1\\n    3. add_tax:帳單計算是否要額外增加銷售稅\\n        1. 若 user.add_tax_override === true\\n            - add_tax = user.add_tax_override_value\\n        2. 有綁卡 -> add_tax = false\\n        3. 沒綁卡 -> add_tax = true\\n    4.have_bind_card - 用戶有沒有綁卡\\n5. 把 user.fee 設定為 user.next_month_fee\\n6. 如果執行過程中有 error，會存到 logs/log_YYYYMMDD_HHmmss.json\\n\\n## 帳單.pdf (新報價)\\n\\n1. 依照 portal 的方式計算\\n2. 若有綁卡（check.have_bind_card），則不顯示轉帳資訊\\n3. 以 check.monthly_fee_start_date 決定計價區間的第一天\\n    - checkout_date = 201712\\n    - monthly_fee_start_date = 18\\n    - 計價區間 = 106/12/18 ~ 106/12/31\\n\\n## 新用戶註冊\\n\\n- 預設新報價\\n- Plan: A\\n\\n\\n\\n\\n# 測試\\n\\n## 舊用戶\\n\\n1. 舊報價 __(開舊的 portal 與 checkout 比較)__\\n    - 檢查 billing estimate 是否正確\\n    - checkout\\n        - 檢查 billing history是否正確\\n        - 檢查 帳單是否正確\\n            ```bash\\n            # checkout\\n            $ DEBUG=AutoCheckout:* node app\\n            # PDF\\n            $ DATE=201712 DEBUG=AutoCheckout:* node exportPDF.js\\n            ```\\n2. 轉成新報價\\n    - Manager 在後台設定\\n        - 檢查 next_month_fee 是否正確\\n        - fee 要維持不變\\n    - 在 db 更新 fee 為 next_month_fee 以測試\\n        - 檢查 billing estimate 是否正確\\n            - 銷售税（還沒做）\\n                - 有綁卡\\n                - 沒綁卡\\n                - 有 override\\n            - 基本月費依照比例計算（還沒做）\\n    - checkout\\n        - 檢查 billing history 是否正確\\n        - 檢查 帳單是否正確\\n    - 更改綁卡與override狀態，並重新測試checkout\\n    - 更改帳號開通時間，以測試基本月費計算\\n\\n## 新用戶\\n\\n1. 註冊\\n    - fee & next_month_fee = \\n        ```json\\n        {\\n            \\"is_new\\": true,\\n            \\"amount_fee\\": 0,\\n            \\"remembercard_fee\\": 0,\\n            \\"plan\\": \\"B\\",\\n            \\"transaction_fee\\": {\\n  \\"0\\": 2500\\n            },\\n            \\"each_transaction_fee\\": 2\\n        }\\n        ```\\n2. Manager 在後台設定方案\\n    - 要同時更新 fee & next_month_fee（因為還沒開通）"',
        'authorship': 'String',
        'lastchangeAt': 1,
        'savedAt': 1,
        'createdAt': 1,
        'updatedAt': 1,
        'deletedAt': 1,
        'ownerId': 1,
        'lastchangeuserId': 1
      })
    }, 300)
  })
}
</script>
